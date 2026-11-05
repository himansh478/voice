# Final Scene-by-Scene Visual Plan

**Status:** Implemented and rendered. The authoritative timings are `analysis/scene-plan.json` and `project/src/data/timing.json`; the reviewed narration is `analysis/transcript.json`.

## Visual direction

The final design uses an original warm off-white canvas, charcoal typography, amber active states, white code/type cards, dark result panels, and restrained green/blue/red semantic accents. Space Grotesk headings and Inter body/subtitle fonts are bundled through the existing Fontsource dependencies. No JetBrains Mono font was installed or used.

All compositions are original CSS/SVG: variable/data relationship, four type cards, generic symbol removal, scanning line, and automatic-recognition result. The reference contributed only high-level clarity and palette inspiration. There is no copied mascot, logo, footage, code sequence, music, or stock media.

## Implemented timeline

The source is 18.834250 seconds. Both compositions use **566 frames at 30 FPS** (18.866667 seconds of video), the smallest whole-frame timeline containing the complete narration.

| Scene | Time | Narration purpose | Implemented visual action |
|---|---|---|---|
| **S01 — DATA TYPES** | 0.00–1.15 s | Immediate opening hook | Two-line DATA TYPES title and an original rotating amber variable/data/type relationship. No artificial intro delay. |
| **S02 — DATA + VARIABLE** | 1.15–4.04 s | What kind of data a variable stores | Generic `variable = data` window, variable-to-data-type result, and DATA → VARIABLE → TYPE chips. No unspoken example or factual rule is introduced. |
| **S03 — INTEGER & FLOAT** | 4.04–6.58 s | First two named types | INTEGER and FLOAT cards enter and exchange the active amber state at the float anchor; prior type recedes but remains visible. |
| **S04 — STRING & BOOLEAN** | 6.58–9.16 s | Remaining two named types | STRING and BOOLEAN complete a four-card system. Vertical uses a 2×2 grid; horizontal uses four columns. STRING yields the active state to BOOLEAN at its spoken anchor. |
| **S05 — NO SEPARATE SYMBOL** | 9.16–13.64 s | No separate symbol is needed for type representation | Generic crossed-symbol placeholder shrinks/rotates away while `variable = data` stays. Result reads DATA TYPE / NO EXTRA SYMBOL without presenting unspoken syntax. |
| **S06 — AUTOMATICALLY** | 13.64–18.8667 s | Variable automatically understands the stored data type | A scan line crosses the generic code card; DATA TYPE / RECOGNIZED appears from 14.90 s, followed by all four type chips as context. No specific unspoken inferred type is selected. |

## Speech-linked anchors

- INTEGER: **4.14 s**
- FLOAT: **5.34 s**
- STRING: **6.60 s**
- BOOLEAN: **7.92 s**
- Automatic result: **14.90 s**

Normal transitions use short spring/fade timing. Scene fades reveal the warm canvas rather than black. Motion never changes the narration duration.

## Subtitle implementation

- Reviewed Roman Hinglish, not translated English.
- **72 word timings / 8 cues / maximum two lines**.
- Dark high-contrast rounded panel, Inter SemiBold, amber active-word background and persistent spoken-keyword color.
- Fixed word padding prevents active highlighting from reflowing a line.
- Vertical captions use a protected lower mobile-safe region; horizontal captions use their own size and width.
- A still-review catch corrected shrink-to-fit subtitle boxes that had produced three lines; every render was regenerated and the two-line result verified.

## Responsive adaptation

The two aspect ratios share narration and timing, not pixel positions:

- **9:16:** centered stacked cards, 2×2 type grid, lower caption panel.
- **16:9:** split code/relationship layouts, horizontal relation chain, four-column type grid, right-side chip groups, and a wider lower caption zone.

Neither master is a stretch, rotation, or crop of the other.

## Sound and completion gates

Original voice only; no music or SFX. The following gates were completed in order: source hash verification, wording confirmation, timing validation, TypeScript checks, representative still inspection, complete preview render/review, final vertical and horizontal renders, final decoded contact-sheet review, full decode/black-frame checks, loudness/peak measurement, and source/export waveform comparison. Evidence is under `output/qc/`.
