#!/usr/bin/env node
/** Render the Remotion production using the locally bundled headless Chromium. */
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {normalizeDelivery} from './normalize-delivery.mjs';

const require = createRequire(import.meta.url);
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(project, '../renders');
const mode = process.argv[2] || 'preview';
fs.mkdirSync(output, {recursive: true});

// The sandbox uses bundled Linux Chromium. On Windows/macOS, set CHROME_PATH
// to an installed Chrome executable or leave it unset for Remotion's browser setup.
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
const composition = compositions.find((c) => c.id === 'PythonStory');
if (!composition) throw new Error('PythonStory composition was not found.');
console.log(`Composition: ${composition.width}×${composition.height}, ${composition.fps} fps, ${composition.durationInFrames} frames`);

if (mode === 'stills') {
  const destination = path.join(output, 'preview-frames');
  fs.mkdirSync(destination, {recursive: true});
  const times = [0.5,1.9,4.5,7.0,9.1,12.2,15.4,18.0,20.1,23.4,26.8,30.0,33.0,36.95,39.0,41.4,43.0,45.0,47.5,51.3];
  const plan = JSON.parse(fs.readFileSync(path.join(project, 'src/data/scene-plan.json'), 'utf8'));
  for (const time of times) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(time * composition.fps));
    const scene = plan.scenes.find((s) => time >= s.start && time < s.end);
    const filename = `${scene?.id || 'SXX'}-${time.toFixed(2).replace('.', '_')}.jpg`;
    console.log(`Rendering ${filename}`);
    await renderStill({
      ...browserOptions,
      composition,
      serveUrl,
      frame,
      output: path.join(destination, filename),
      imageFormat: 'jpeg',
      jpegQuality: 92,
      scale: 0.5,
      overwrite: true,
    });
  }
  console.log(`Stills written to ${destination}`);
} else {
  const final = mode === 'final';
  const outputLocation = path.join(output, final ? 'python-origin-1080x1920.mp4' : 'python-origin-preview-540x960.mp4');
  let previousBucket = -1;
  await renderMedia({
    ...browserOptions,
    composition,
    serveUrl,
    codec: 'h264',
    audioCodec: 'aac',
    audioBitrate: '192k',
    outputLocation,
    inputProps: {},
    scale: final ? 1 : 0.5,
    crf: final ? 17 : 21,
    jpegQuality: final ? 94 : 88,
    imageFormat: 'jpeg',
    pixelFormat: 'yuv420p',
    x264Preset: final ? 'medium' : 'veryfast',
    concurrency: 2,
    overwrite: true,
    enforceAudioTrack: true,
    metadata: {
      title: 'PYTHON — The Name Behind the Language',
      comment: 'Original Hindi/Hinglish narration with programmatic motion design, SVG and Three.js.',
    },
    onProgress: ({progress, renderedFrames, encodedFrames, stitchStage}) => {
      const bucket = Math.floor(progress * 20);
      if (bucket !== previousBucket) {
        previousBucket = bucket;
        console.log(`${Math.round(progress*100)}% · ${renderedFrames} rendered · ${encodedFrames} encoded · ${stitchStage}`);
      }
    },
  });
  console.log(`Finished: ${outputLocation}`);
  if (final) normalizeDelivery(outputLocation);
}
