#!/usr/bin/env python3
"""Decode one frame per second from an actual MP4 and build a review contact sheet."""
from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import subprocess
from PIL import Image, ImageDraw, ImageFont

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent

parser = argparse.ArgumentParser()
parser.add_argument("video", type=Path)
parser.add_argument("output", type=Path)
parser.add_argument("--aspect", choices=["9x16", "16x9"], default="9x16")
args = parser.parse_args()
video, output = args.video.resolve(), args.output.resolve()
frames_dir = output.parent / (output.stem + "-frames")
if frames_dir.exists():
    shutil.rmtree(frames_dir)
frames_dir.mkdir(parents=True)
ffmpeg = subprocess.check_output(["node", "-p", "require('@ffmpeg-installer/ffmpeg').path"], cwd=PROJECT, text=True).strip()
width, height = (270, 480) if args.aspect == "9x16" else (480, 270)
subprocess.run([
    ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
    "-vf", f"select='not(mod(n,30))',scale={width}:{height}", "-vsync", "vfr",
    "-q:v", "2", str(frames_dir / "frame-%03d.jpg"),
], check=True)
files = sorted(frames_dir.glob("*.jpg"))
if len(files) != 19:
    raise SystemExit(f"Expected 19 one-second review frames, found {len(files)}")
font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
font = ImageFont.truetype(str(font_path), 17) if font_path.exists() else ImageFont.load_default(size=17)
columns, label_h = (5, 38) if args.aspect == "9x16" else (4, 38)
rows = (len(files) + columns - 1) // columns
sheet = Image.new("RGB", (columns * width, rows * (height + label_h)), (35, 35, 38))
draw = ImageDraw.Draw(sheet)
for i, file in enumerate(files):
    image = Image.open(file).convert("RGB")
    x, y = (i % columns) * width, (i // columns) * (height + label_h)
    sheet.paste(image, (x, y))
    draw.text((x + 8, y + height + 8), f"{i:02d}.00s / frame {i * 30:03d}", fill=(245, 242, 234), font=font)
output.parent.mkdir(parents=True, exist_ok=True)
sheet.save(output, quality=94)
print(f"Wrote {output} from {len(files)} decoded frames")
