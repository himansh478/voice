#!/usr/bin/env node
/** Normalize a rendered master for social delivery: BT.709 / TV range / faststart. */
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);

export function normalizeDelivery(input) {
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
    '-metadata', 'title=PYTHON — The Name Behind the Language',
    '-metadata', 'comment=1080x1920 BT.709 social master; original Hindi/Hinglish narration',
    output,
  ];
  console.log('Normalizing master to BT.709 / yuv420p with fast-start metadata…');
  const result = spawnSync(ffmpeg, args, {stdio: 'inherit'});
  if (result.error || result.status !== 0) throw result.error || new Error(`FFmpeg exited with ${result.status}`);
  fs.renameSync(output, input);
  console.log(`Social-delivery master complete: ${input}`);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const input = process.argv[2];
  if (!input) throw new Error('Usage: node scripts/normalize-delivery.mjs <master.mp4>');
  normalizeDelivery(path.resolve(input));
}
