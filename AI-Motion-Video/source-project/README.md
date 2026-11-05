# PYTHON — Remotion Source Project

A deterministic 9:16 motion-design production built around the original 52.21875-second Hindi/Hinglish narration.

See [`TECHNOLOGY.md`](TECHNOLOGY.md) for the selected toolchain and the evaluated alternatives.

## Open and render (video only)

The curated transcript, scene plan, fonts, mixed audio and all visual code are included. Python and Whisper are **not** required to edit or render the video.

```bash
npm ci
npm run typecheck
npm run studio
```

Remotion Studio opens the `PythonStory` composition: **1080×1920, 30 fps, 1567 frames**.

### Windows 10/11

1. Install Node.js 22 LTS and Google Chrome.
2. In PowerShell, point the renderer at Chrome:

```powershell
cd AI-Motion-Video\source-project
npm ci
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
npm run preview
npm run render
```

If Chrome is in a different location, update `CHROME_PATH`. Without it, Remotion uses its normal browser-setup workflow. The Linux sandbox uses the bundled `@sparticuz/chromium` automatically.

### Render commands

```bash
npm run stills    # 20 full-timeline QC frames at 540×960
npm run preview   # complete 540×960 H.264/AAC preview
npm run render    # final 1080×1920 H.264/AAC MP4
```

Outputs are written to `../renders/`.

## Editable source map

| Path | Purpose |
|---|---|
| `src/Video.tsx` | Master timeline, transitions, subtitle layout and finishing |
| `src/scenes/` | Eleven individually art-directed scenes |
| `src/components/Graphics.tsx` | Original animated SVG assets |
| `src/components/ThreeCore.tsx` | Three.js core and ecosystem geometry/cameras |
| `src/components/Layout.tsx` | Scene wrappers, masking, typography and palette |
| `src/motion.ts` | Shared springs, curves and deterministic randomness |
| `src/data/` | Generated transcript and scene plan consumed by the composition |
| `scripts/render.mjs` | Preview/final/still renderer and Chrome setup |
| `../render-config.json` | Human-readable export settings |

## Regenerate the timing files

The supplied timing master is already curated. To rerun transcription, install Python 3.11+, then:

```bash
python -m venv .venv
# Windows: .venv\Scripts\pip install -r requirements.txt
# macOS/Linux: .venv/bin/pip install -r requirements.txt

python scripts/fetch_whisper_model.py --output .models/whisper-small
python scripts/transcribe.py --audio ../audio/1104.MP3 --model .models/whisper-small --output ../subtitles/transcript-whisper-raw.json
python scripts/build_timing.py
```

`build_timing.py` contains the manually reviewed word timings and scene plan. It writes the TXT, SRT and JSON transcripts plus the JSON consumed by Remotion. Raw ASR passes are retained for audit; no narration is generated or translated.

## Regenerate the sound design

The original score and SFX are procedural, not sampled. With the Python requirements installed:

```bash
python scripts/generate_audio.py
python scripts/mix_audio.py
```

The mix script uses the platform-specific FFmpeg supplied by npm. It preserves `../audio/1104.MP3` unchanged, trims the music and SFX stems below the voice, and writes a new master WAV plus the MP3 used by Remotion.

## Rendering guarantees

- All motion is frame-deterministic; no wall-clock or unseeded animation.
- No external footage, web fonts or remote assets are requested at render time.
- Subtitles use bundled Inter in Roman Hinglish / Latin script; the spoken Hinglish is transliterated, not translated.
- Three.js renders through software-compatible WebGL (`swangle`) in the sandbox.
- Final renders are automatically normalized to BT.709 limited-range yuv420p with fast-start MP4 metadata for Reels, Shorts and Facebook.
- AAC audio is copied without another encode during delivery normalization.
