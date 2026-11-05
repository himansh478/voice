#!/usr/bin/env node
/** Render original responsive Remotion compositions with the existing local browser. */
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {normalizeDelivery} from './normalize-delivery.mjs';

const require = createRequire(import.meta.url);
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(project, '../output');
const mode = process.argv[2] || 'preview';
fs.mkdirSync(output, {recursive: true});

let browserExecutable = process.env.CHROME_PATH || null;
let chromeMode = 'chrome-for-testing';
if (process.platform === 'linux' && !browserExecutable) {
  const helper = await import(pathToFileURL(path.join(project, 'node_modules/@sparticuz/chromium/build/helper.js')));
  const lambdaFs = await import(pathToFileURL(path.join(project, 'node_modules/@sparticuz/chromium/build/lambdafs.js')));
  const libraryRoot = await lambdaFs.inflate(path.join(project, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
  helper.setupLambdaEnvironment(path.join(libraryRoot, 'lib'));
  process.env.FONTCONFIG_PATH ??= '/tmp/fonts';
  const chromium = (await import('@sparticuz/chromium')).default;
  browserExecutable = await chromium.executablePath();
  chromeMode = 'headless-shell';
}

console.log(`Bundling ${mode} render…`);
const serveUrl = await bundle({
  entryPoint: path.join(project, 'src/index.ts'),
  publicDir: path.join(project, 'public'),
  onProgress: (p) => { if (p === 100) console.log('Bundle complete.'); },
});
const browserOptions = {
  browserExecutable,
  chromeMode,
  chromiumOptions: {gl: 'swangle', headless: true, enableMultiProcessOnLinux: true},
  timeoutInMilliseconds: 120000,
  onBrowserLog: ({text, type}) => { if (type === 'error' || /error|failed/i.test(text)) console.log(`[browser ${type}] ${text}`); },
};
const compositions = await getCompositions(serveUrl, {...browserOptions, inputProps: {}});
const vertical = compositions.find((c) => c.id === 'NextVoiceVideo9x16');
const horizontal = compositions.find((c) => c.id === 'NextVoiceVideo16x9');
if (!vertical || !horizontal) throw new Error('NextVoiceVideo9x16 and NextVoiceVideo16x9 compositions are required.');
for (const composition of [vertical, horizontal]) {
  if (composition.durationInFrames !== 566 || composition.fps !== 30) throw new Error(`Unexpected timeline for ${composition.id}`);
  console.log(`${composition.id}: ${composition.width}×${composition.height}, ${composition.fps} fps, ${composition.durationInFrames} frames`);
}

if (mode === 'stills') {
  const times = [0, .45, 1.6, 3.5, 4.35, 5.55, 6.75, 8.15, 9.5, 11.95, 12.8, 13.9, 15.2, 17.4, 18.55];
  for (const [name, composition] of [['vertical', vertical], ['horizontal', horizontal]]) {
    const destination = path.join(output, 'qc', 'stills', name);
    fs.mkdirSync(destination, {recursive: true});
    for (const time of times) {
      const frame = Math.min(composition.durationInFrames - 1, Math.round(time * composition.fps));
      const filename = `f${String(frame).padStart(3, '0')}-t${time.toFixed(2).replace('.', '_')}.jpg`;
      console.log(`Rendering ${name}/${filename}`);
      await renderStill({
        ...browserOptions, composition, serveUrl, frame,
        output: path.join(destination, filename), imageFormat: 'jpeg', jpegQuality: 94,
        scale: .5, overwrite: true,
      });
    }
  }
  console.log(`Stills written to ${path.join(output, 'qc', 'stills')}`);
} else {
  const isHorizontal = mode === 'horizontal';
  const composition = isHorizontal ? horizontal : vertical;
  const preview = mode === 'preview';
  if (!['preview', 'vertical', 'horizontal'].includes(mode)) throw new Error(`Unknown render mode: ${mode}`);
  const filename = preview ? 'preview_voice_video_9x16.mp4' : isHorizontal ? 'final_voice_video_16x9.mp4' : 'final_voice_video_9x16.mp4';
  const outputLocation = path.join(output, filename);
  let previousBucket = -1;
  await renderMedia({
    ...browserOptions, composition, serveUrl,
    codec: 'h264', audioCodec: 'aac', audioBitrate: '192k', outputLocation,
    inputProps: {}, scale: preview ? .5 : 1, crf: preview ? 21 : 17,
    jpegQuality: preview ? 88 : 94, imageFormat: 'jpeg', pixelFormat: 'yuv420p',
    x264Preset: preview ? 'veryfast' : 'medium', concurrency: 2, overwrite: true,
    enforceAudioTrack: true,
    metadata: {
      title: 'Python Data Types — Next Dark Console Version',
      comment: 'Original reviewed Roman-Hinglish narration; new responsive dark-console motion design; no reference footage reused.',
    },
    onProgress: ({progress, renderedFrames, encodedFrames, stitchStage}) => {
      const bucket = Math.floor(progress * 20);
      if (bucket !== previousBucket) {
        previousBucket = bucket;
        console.log(`${Math.round(progress * 100)}% · ${renderedFrames} rendered · ${encodedFrames} encoded · ${stitchStage}`);
      }
    },
  });
  console.log(`Finished: ${outputLocation}`);
  if (!preview) normalizeDelivery(outputLocation, isHorizontal ? '16:9' : '9:16');
}
