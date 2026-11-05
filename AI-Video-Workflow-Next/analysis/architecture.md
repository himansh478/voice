# Next-Version Architecture

## Shared source, new visual system

```text
GitHub 1104 (1)(2).MP3 @ 993b4be
  → unchanged local master + reviewed 72-word timing JSON
  → Remotion 4.0.540 / React 19.2.0 / TypeScript 5.9.3
  → NextVoiceVideo9x16 + NextVoiceVideo16x9
  → local Chromium frame rendering
  → H.264/AAC delivery + BT.709/faststart normalization
  → decoded visual review + media/audio/timing QC
```

The original 23-repository static audit and installation decision remain in `../AI-Video-Workflow/analysis/repository-audit.md`. The user's existing-tools-only decision still applies: no new package, software, font, AI service, or repository installer was introduced for this version. Dependencies are reused through the local `node_modules` symlink; no external media is uploaded.

## Original dark-console graphics

- Deep navy canvas with subtle grid and cyan/mint/amber semantic accents.
- Variable/data memory console, numbered DATA → VARIABLE → TYPE flow rail.
- Wide numeric rails and a four-cell text/logic type stack.
- Separate-symbol module with non-overlapping outgoing/incoming content fades.
- Scanning data console and automatic DATA TYPE / RECOGNIZED result.
- Dark two-line subtitle panels with stable active-word padding.

No reference footage, stock media, music, SFX, TTS, Three.js, HyperFrames, MotionClone, or paid API is used. Inter and Space Grotesk remain the only font families.

## Responsive output

Both compositions share exactly 566 frames at 30 FPS and the same audio/word timing. Vertical layouts use centered consoles, stacked wide numeric rails, 2×2 type grids, and mobile-safe captions. Horizontal layouts use separate left/right compositions, side-by-side numeric cards, four-column type grids, and wider captions. Neither is stretched from the other.

## Verification gates

Source Git/blob/SHA verification → deterministic timing validation → TypeScript → 30 representative stills (15 per aspect) → visual corrections for symbol text overlap and vertical result centering → complete preview and decoded 19-frame timeline review → final vertical/horizontal renders → decoded final review → full automated QC.

The QC script independently checks source/public MP3 hashes, 72/8/6 timing counts, exact renderer/master timing equality, codecs, dimensions, 30 FPS, 566 frames, 48 kHz stereo, complete decode, black frames, loudness, source/export waveform correlation, BT.709/faststart delivery, and documented visual approval.
