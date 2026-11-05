# AI Video Workflow — Python Data Types

A complete, editable Remotion production built around the unchanged 18.834250-second recording `1104 (1)(2).MP3`. The supplied reference video was decoded and studied for visual language only; none of its footage, audio, logo, mascot, or code sequence appears in the output.

## Delivery status: complete

Both masters were actually rendered, decoded, visually inspected, and passed the delivered QC scripts.

| Deliverable | Path | Result |
|---|---|---|
| **Primary vertical master** | **`output/final_voice_video_9x16.mp4`** | 1080×1920, 30 FPS, 566 frames, H.264/AAC, 48 kHz stereo, BT.709, faststart |
| Adapted horizontal master | `output/final_voice_video_16x9.mp4` | 1920×1080 with separate wide/split layouts, never a stretched vertical export |
| Reviewed transcript and word timings | `analysis/transcript.md`, `analysis/transcript.json` | 72 spoken words, reviewed Roman Hinglish |
| Subtitles | `analysis/subtitles.srt`, `analysis/subtitles.txt` | 8 cues, maximum two rendered lines, active-word highlights in the video |
| Final scene plan | `analysis/scene-plan.md`, `analysis/scene-plan.json` | 6 scenes tied to the narration |
| Editable animation project | `project/` | Remotion + React + TypeScript + original CSS/SVG |
| 23-repository audit | `analysis/repository-audit.md` | Static audit completed and presented before production |
| Architecture/dependencies | `analysis/dependency-map.md` | Final implemented stack and privacy/license notes |
| Reference/source analysis | `analysis/reference-analysis.md`, `analysis/source-verification.md` | Actual frame analysis and exact Git/SHA identity |
| Vertical QC | `output/QUALITY-CONTROL-9x16.md`, `output/qc/final-9x16-qc-report.json` | **PASS** |
| Horizontal QC | `output/QUALITY-CONTROL-16x9.md`, `output/qc/final-16x9-qc-report.json` | **PASS** |
| Visual evidence | `output/qc/timeline-final-9x16.jpg`, `timeline-final-16x9.jpg` | 19 decoded frames from each delivered MP4, plus representative render sheets |
| File hashes | `delivery-manifest.json` | SHA-256 and byte sizes for primary delivery artifacts |

The preview render and technical preview QC also passed before final rendering. No music, stock media, external TTS, paid media API, or reference footage was added.

## Original narration preservation

```text
Source commit: 993b4bedbb078988a25a9213cede66718a9a1b28
Source Git blob: 0666e805fe775ea9acea24470b74e727527ece74
Source SHA-256: b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7
Source duration: 18.834250 seconds
Video timeline: 566 frames / 30 FPS = 18.866667 seconds
```

The voice was not rewritten, regenerated, pitch-shifted, sped up, slowed down, or replaced. AAC encoding necessarily creates a lossy delivery copy, while both stored MP3 copies remain byte-identical. Measured source/export audio correlation at zero lag is **0.999953** for both masters; integrated loudness remains **−14.6 LUFS**, with **−2.0 dBFS** true peak.

The video duration rounds the complete recording up to a whole frame. The AAC stream reports 18.880 seconds because of normal codec padding; this is not an inserted spoken pause. See the machine QC reports for the measurement method.

## Editable source map

```text
AI-Video-Workflow/
├── assets/audio/1104 (1)(2).MP3   # Untouched source master
├── analysis/                     # Audit, ASR evidence, reviewed timings, SRT, plans
├── project/
│   ├── src/Root.tsx              # 9:16 and 16:9 compositions
│   ├── src/Video.tsx             # Scene sequencing, original audio, subtitle overlay
│   ├── src/data/timing.json      # Generated shared timing master
│   ├── components/Scenes.tsx     # Six responsive scene implementations
│   ├── components/UI.tsx         # Original cards, chips, windows, result panels, SVG icons
│   ├── components/Subtitles.tsx  # Two-line cues and stable active-word highlighting
│   ├── animations/motion.ts      # Springs, fades, interpolation helpers
│   ├── config/design.ts          # Palette, fonts, responsive design values
│   └── scripts/                  # Timing, rendering, normalization, contact sheets, QC
├── output/                       # Delivered MP4s, QC reports, review sheets
└── delivery-manifest.json
```

Edit `analysis/transcript.json` only through the reviewed source constants in `project/scripts/build_timing.py`, then run `npm run timing`; this keeps the transcript, SRT, scene plan, and Remotion JSON synchronized. Edit scene visuals in `project/components/Scenes.tsx` and shared design tokens in `project/config/design.ts`.

## Windows / PowerShell reproduction

These commands are provided for reproducibility; **they were not executed on the user's Windows PC**. The current sandbox production used existing dependencies through a local `node_modules` symlink. No npm/pip package, new font, repository installer, or third-party setup script was installed/executed for this production.

### Prerequisites

- Node.js 22+ and npm 10+
- Python 3.11 available as `python` for timing/QC scripts
- Git
- Remotion's local headless browser, downloaded once below
- Claude Code is **not** required to render the delivered project

The locked npm dependencies include platform FFmpeg/FFprobe binaries. Remotion's commercial license still applies: free for eligible individuals, nonprofits, and for-profit organizations up to 3 employees; larger for-profit organizations require a Company License.

### Install and render

```powershell
Set-Location 'C:\Users\sudha\Downloads\voice'
git rev-parse --show-toplevel
Set-Location '.\AI-Video-Workflow\project'

# Installs only the versions in package-lock.json.
npm ci

# One-time local browser download; does not use an unpinned npx package.
npx --no-install remotion browser ensure

# Validate source and regenerate the already reviewed timing artifacts.
npm run typecheck
npm run timing

# Optional editable Studio preview.
npm run studio

# Full low-resolution preview, then both full-resolution masters.
npm run preview
npm run render:vertical
npm run render:horizontal

# Technical QC plus the documented visual-review record.
npm run qc -- '..\output\preview_voice_video_9x16.mp4' --preview --aspect 9x16
npm run qc -- '..\output\final_voice_video_9x16.mp4' --aspect 9x16
npm run qc -- '..\output\final_voice_video_16x9.mp4' --aspect 16x9
```

`npm run render` runs both final renders sequentially. `npm run normalize -- '..\output\final_voice_video_9x16.mp4' 9:16` is available if a master needs delivery normalization again; it copies the AAC stream rather than re-encoding it.

### Optional review-sheet regeneration

Pillow is used only to assemble decoded JPEGs into contact sheets, not to render or run technical QC. If it is already available, no installation is needed. Otherwise, this is the exact optional dependency command (not run during the approved existing-tools-only production):

```powershell
py -3.11 -m pip install Pillow==13.0.0
npm run contact-sheet
npm run timeline-sheet -- '..\output\final_voice_video_9x16.mp4' '..\output\qc\timeline-final-9x16.jpg' --aspect 9x16
npm run timeline-sheet -- '..\output\final_voice_video_16x9.mp4' '..\output\qc\timeline-final-16x9.jpg' --aspect 16x9
```

After changing visuals, inspect the new sheets and update `output/qc/visual-review.json` honestly. The QC program deliberately separates automated media checks from the documented visual approval; it does not claim to watch the video by itself.

## Reviewed narration

> To data type se matlab, kis tarah ka data variable store kar sakta hai?
> To integer ek type hota hai, float ek type hota hai, string ek type hota hai, boolean ek type hota hai.
> Aur ye data type ko represent karne ke liye Python mein koi alag se symbol nahi lagana padta hai.
> Python ka variable automatically samajh jaata hai ki ye kis tarah ka data type store kar raha hai.

Two local Faster Whisper Small passes and the user's exact-word confirmations resolved the unclear narration. Raw ASR evidence remains separate from the reviewed master.

## Scope and honest limitations

- Visual inspection covered representative renders and 19 decoded one-second frames from each final MP4. It was frame-based visual review, not a claim of continuous real-time playback on a physical phone.
- Windows compatibility follows the cross-platform stack and source inspection; the PowerShell commands were not run on the user's Windows machine.
- No face/talking-head footage was supplied or generated. The original audio-only narration is illustrated with generic educational graphics.
- The sandbox's existing static FFmpeg build is old and GPL-enabled; it was used locally and is not committed. A fresh `npm ci` resolves the locked platform packages. No tool license changes the ownership of the rendered graphics.
- `assets/reference/`, third-party audit snapshots, model weights, local dependencies, preview files, and decoded frame folders are excluded from Git by `.gitignore`.
