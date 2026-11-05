#!/usr/bin/env python3
"""Create the delivered visual storyboard from rendered QC frames."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
PROJECT = ROOT/"AI-Motion-Video"
files = sorted((PROJECT/"renders"/"preview-frames").glob("*.jpg"))
if not files:
    raise SystemExit("No QC frames found. Run npm run stills first.")
thumb_w, thumb_h, label_h, columns = 270, 480, 34, 5
rows = (len(files)+columns-1)//columns
sheet = Image.new("RGB", (columns*thumb_w,rows*(thumb_h+label_h)), (7,9,20))
draw = ImageDraw.Draw(sheet)
font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
font = ImageFont.truetype(str(font_path),16) if font_path.exists() else ImageFont.load_default(size=16)
for i,path in enumerate(files):
    image = Image.open(path).convert("RGB")
    image.thumbnail((thumb_w,thumb_h))
    x,y = (i%columns)*thumb_w,(i//columns)*(thumb_h+label_h)
    sheet.paste(image,(x,y))
    draw.text((x+8,y+thumb_h+7),path.stem,fill=(220,225,235),font=font)
for output in [PROJECT/"scenes"/"storyboard-contact-sheet.jpg",PROJECT/"renders"/"storyboard-contact-sheet.jpg"]:
    output.parent.mkdir(parents=True,exist_ok=True)
    sheet.save(output,quality=92)
    print(f"Wrote {output}")
