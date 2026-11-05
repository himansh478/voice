#!/usr/bin/env python3
"""Contact sheets from actual rendered stills; Pillow comes from the existing local venv."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PROJECT = Path(__file__).resolve().parents[1]
OUTPUT = PROJECT.parent / "output"
font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
font = ImageFont.truetype(str(font_path), 18) if font_path.exists() else ImageFont.load_default(size=18)
for aspect, thumb_size, columns in [("vertical", (270, 480), 7), ("horizontal", (480, 270), 4)]:
    files = sorted((OUTPUT / "qc" / "stills" / aspect).glob("*.jpg"))
    if not files:
        raise SystemExit(f"No {aspect} QC frames found. Run npm run stills first.")
    tw, th = thumb_size
    label_h, rows = 38, (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * tw, rows * (th + label_h)), (35, 35, 38))
    draw = ImageDraw.Draw(sheet)
    for i, file in enumerate(files):
        image = Image.open(file).convert("RGB")
        image.thumbnail((tw, th))
        x, y = (i % columns) * tw, (i // columns) * (th + label_h)
        sheet.paste(image, (x, y))
        draw.text((x + 8, y + th + 8), file.stem, fill=(245, 242, 234), font=font)
    destination = OUTPUT / "qc" / f"contact-sheet-{aspect}.jpg"
    sheet.save(destination, quality=94)
    print(f"Wrote {destination}")
