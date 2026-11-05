# Next AI Video — Dark Data Console

A new, separate visual version created from the GitHub narration `1104 (1)(2).MP3` at commit `993b4bedbb078988a25a9213cede66718a9a1b28`. The earlier light-card production remains untouched in `AI-Video-Workflow/`.

## Delivered videos

| Output | Path | Specification |
|---|---|---|
| **Primary next-version video** | **`output/final_voice_video_9x16.mp4`** | 1080×1920, 30 FPS, 566 frames, H.264/AAC, 48 kHz stereo, BT.709, faststart |
| Independently recomposed horizontal | `output/final_voice_video_16x9.mp4` | 1920×1080 with split/wide layouts, not a stretched vertical export |
| Vertical QC | `output/QUALITY-CONTROL-9x16.md` | **PASS — 27/27 automated checks plus documented visual review** |
| Horizontal QC | `output/QUALITY-CONTROL-16x9.md` | **PASS — 27/27 automated checks plus documented visual review** |
| Exact file hashes | `delivery-manifest.json` | SHA-256 and byte sizes |

Both MP4s were actually rendered, decoded, and visually inspected. Each final timeline sheet contains 19 frames decoded from the delivered MP4; 15 representative stills per aspect ratio were also reviewed. The complete preview passed before final rendering.

## New visual direction

This version uses an original dark data-console system: deep navy canvas, cyan/mint/amber semantic colors, memory consoles, a numbered data flow rail, wide numeric rails, a four-cell type stack, a detachable symbol module, and automatic scan/recognition graphics. It does not reuse the earlier light compositions or any reference footage.

The reviewed narration remains exactly the same: **72 words / 8 Roman-Hinglish subtitle cues / 6 scenes / 566 frames at 30 FPS**. Subtitles have a maximum of two lines and stable active-word highlighting.

## Audio identity

```text
GitHub source: 1104 (1)(2).MP3
Commit: 993b4bedbb078988a25a9213cede66718a9a1b28
Git blob: 0666e805fe775ea9acea24470b74e727527ece74
SHA-256: b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7
Source duration: 18.834250 seconds
Video duration: 18.866667 seconds (whole-frame quantization)
```

GitHub `origin/main`, the source blob, and the local/public audio hashes were reverified before production. No narration rewrite, TTS, pitch/speed change, cleanup, music, SFX, stock media, or paid API was introduced. AAC is a lossy delivery codec; the stored MP3 copies remain bit-identical.

Measured for both masters: **0.999953 zero-lag source/export waveform correlation**, **−14.6 LUFS** integrated loudness, **−2.0 dBFS** true peak, zero detected black-frame events, and clean complete decode. AAC reports 18.880 seconds because of normal codec padding, not an inserted narration pause.

## Editable project

- `project/src/Root.tsx` — `NextVoiceVideo9x16` and `NextVoiceVideo16x9`
- `project/src/Video.tsx` — scene sequencing, original audio, responsive background, subtitles
- `project/components/Scenes.tsx` — six new scene implementations
- `project/components/UI.tsx` — dark consoles, rails, tiles, symbol module primitives
- `project/components/Subtitles.tsx` — reviewed two-line active-word captions
- `project/config/design.ts` — dark palette and typography
- `project/src/data/timing.json` — shared reviewed timing data
- `project/scripts/` — deterministic timing, render, normalization, sheets, and QC

The existing-tools-only decision was preserved. No new package, software, font, or third-party repository installer was used; the local dependency symlink is Git-ignored. The prior repository audit remains at `../AI-Video-Workflow/analysis/repository-audit.md`.

## Windows / PowerShell reproduction

These commands were not executed on the user's Windows PC. Prerequisites: Node.js 22+, npm 10+, Python 3.11 as `python`, and Git. Claude Code is not required to render.

```powershell
Set-Location 'C:\Users\sudha\Downloads\voice\AI-Video-Workflow-Next\project'
npm ci
npx --no-install remotion browser ensure
npm run typecheck
npm run timing

# Optional editable Studio:
npm run studio

# Preview and both final masters:
npm run preview
npm run render:vertical
npm run render:horizontal

# Repeat delivered technical QC:
npm run qc -- '..\output\preview_voice_video_9x16.mp4' --preview --aspect 9x16
npm run qc -- '..\output\final_voice_video_9x16.mp4' --aspect 9x16
npm run qc -- '..\output\final_voice_video_16x9.mp4' --aspect 16x9
```

Optional JPEG sheet assembly uses Pillow only if it is not already available:

```powershell
py -3.11 -m pip install Pillow==13.0.0
npm run contact-sheet
npm run timeline-sheet -- '..\output\final_voice_video_9x16.mp4' '..\output\qc\timeline-final-9x16.jpg' --aspect 9x16
npm run timeline-sheet -- '..\output\final_voice_video_16x9.mp4' '..\output\qc\timeline-final-16x9.jpg' --aspect 16x9
```

After editing visuals, inspect new renders and update `output/qc/visual-review.json` honestly. Automated QC does not claim to watch the video by itself. Remotion's organization-size commercial license condition remains applicable; see the prior audit.

## Review boundary

Visual approval is frame-based, not continuous physical-device playback. Windows compatibility follows the cross-platform stack, but the commands were not run on the user's PC. The previous final videos were not overwritten.
