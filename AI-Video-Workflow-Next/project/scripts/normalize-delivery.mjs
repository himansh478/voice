#!/usr/bin/env node
/** Normalize a rendered master for social delivery without altering its audio. */
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);

export function normalizeDelivery(input, aspect = '9:16') {
  const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
  const output = input.replace(/\.mp4$/i, '.bt709.mp4');
  const args = [
    '-hide_banner', '-y', '-i', input,
    '-map', '0:v:0', '-map', '0:a:0?',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-color_range', 'tv',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'copy', '-movflags', '+faststart',
    '-metadata', 'title=Python Data Types — Original Voice Motion Graphics',
    '-metadata', `comment=${aspect} responsive master; original Roman-Hinglish narration; no reference footage`,
    output,
  ];
  console.log('Normalizing video to BT.709 / yuv420p / faststart; copying AAC audio unchanged…');
  const result = spawnSync(ffmpeg, args, {stdio: 'inherit'});
  if (result.error || result.status !== 0) throw result.error || new Error(`FFmpeg exited with ${result.status}`);
  fs.renameSync(output, input);
  console.log(`Delivery master complete: ${input}`);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const input = process.argv[2];
  if (!input) throw new Error('Usage: node scripts/normalize-delivery.mjs <master.mp4> [9:16|16:9]');
  normalizeDelivery(path.resolve(input), process.argv[3] || '9:16');
}
