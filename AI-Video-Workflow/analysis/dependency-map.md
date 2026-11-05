# Final Dependency and Compatibility Map

## Implemented architecture

```text
GitHub source commit 993b4be
        │
        ▼
Original 1104 (1)(2).MP3 ─────────────── untouched master / Git blob / SHA-256
        │                                      │
        ▼                                      │
Existing local Faster Whisper + Whisper Small  │
        │                                      │
        ▼                                      │
Two raw ASR passes → user wording review → 72-word timing master + 8-cue SRT
                                               │
Reference MP4 → FFmpeg frame decode → style report only (not production media)
                                               │
                                               ▼
                         Remotion + React + TypeScript + original CSS/SVG
                         ├─ VoiceVideo9x16: 1080×1920, 30 FPS, 566 frames
                         └─ VoiceVideo16x9: 1920×1080, 30 FPS, 566 frames
                                               │
                         Original voice starts at frame 0; no rate/pitch processing
                                               │
                                               ▼
                         Local Remotion renderer / bundled headless Chromium
                                               │
                                               ▼
                         Existing FFmpeg / FFprobe
                         ├─ H.264, yuv420p, BT.709 limited range, faststart
                         ├─ AAC, 48 kHz stereo (audio copied during normalization)
                         └─ decode/duration/black-frame/loudness/waveform/timing QC
                                               │
                                               ▼
                         output/final_voice_video_9x16.mp4  [PRIMARY]
                         output/final_voice_video_16x9.mp4  [RECOMPOSED]
```

## Actual production dependencies

| Dependency | Version used | Purpose | Compatibility / network behavior |
|---|---|---|---|
| Node.js | 22.22.3 | Build and render scripts | Cross-platform; Node 22+ recommended on Windows. |
| npm | 10.9.8 | Lockfile and script runner | Network needed for a fresh `npm ci`, not for already installed local rendering. |
| Remotion CLI/bundler/renderer/core | 4.0.540, pinned together | Only animation/render engine | Windows supported. Special commercial license: free for eligible individuals/nonprofits/for-profit teams up to 3 employees; Company License otherwise. |
| React / React DOM | 19.2.0 | Responsive scene components | MIT; local runtime. |
| TypeScript | 5.9.3 | Static validation | `npm run typecheck` passes after final implementation. |
| `@sparticuz/chromium` | 153.0.0 | Existing bundled Linux browser used by this sandbox | Inflated locally by `render.mjs`; no cloud rendering. Windows uses Remotion's Chrome-for-Testing setup instead. |
| `@ffmpeg-installer/ffmpeg` | 1.1.0; existing static build `N-47683-g0e8eb07980` | Audio/video probing support, normalization, decode/QC | Existing binary is old and GPL/version-3-enabled; used locally, not committed. No media network calls. |
| `@ffprobe-installer/ffprobe` | 2.1.2; build `N-66595-gc2b38619c0` | Stream/frame/duration metadata | Local executable resolved through Node; no PATH lookup in QC scripts. |
| Python | 3.11.2 | Reviewed timing builder, technical QC, optional sheets | Timing and technical QC use only the standard library. Windows launcher calls `python`. |
| Faster Whisper | Existing 1.2.1 | Two local ASR passes | MIT; local CPU inference. Not required to render delivered reviewed timing files. |
| CTranslate2 | Existing 4.8.5 | Whisper inference runtime | Existing transitive dependency; local only. |
| Whisper Small | Existing local CTranslate2 int8 model | Hindi/Hinglish ASR evidence | Local model directory; no audio upload. Model weights are outside Git. |
| Inter / Space Grotesk | Fontsource 5.3.0 | Subtitles/body and headings | SIL OFL 1.1; bundled locally through npm, no runtime Google Fonts request. |
| Pillow | Existing 13.0.0 | Optional JPEG contact-sheet assembly | Not required for rendering or technical QC. Listed separately in `scripts/requirements-qc.txt`. |

**JetBrains Mono was not installed or used.** Code and state typography uses the existing Inter/Space Grotesk stack.

## Deliberately absent dependencies

- HyperFrames, Bun, PostHog transport, or a second HTML renderer.
- MotionClone/FastAPI/Playwright app/Codex workflow; no reference frames were uploaded for reconstruction.
- Three.js, React Three Fiber, GSAP, Blender, or another motion engine; deterministic 2D CSS/SVG was sufficient.
- Torch/OpenAI Whisper package; existing Faster Whisper avoided a second ASR stack.
- yt-dlp; both source assets came directly from their specified GitHub repositories.
- Stock footage/music APIs, external TTS, AI voice/video generation, and paid media services.

## Data ownership and delivery treatment

| File / directory | Role | Treatment |
|---|---|---|
| `assets/audio/1104 (1)(2).MP3` | Original master voice | Preserved byte-for-byte; SHA-256 verified repeatedly. |
| `project/public/1104 (1)(2).MP3` | Remotion audio input | Byte-identical copy of the master; not a cleanup or re-encode. |
| `assets/reference/Video-43221.mp4` | Visual analysis only | Local-only, Git-ignored, absent from both final videos. |
| `analysis/transcript-raw.json` and `transcript-second-pass.json` | Local ASR evidence | Preserved separately; not authoritative for rendering. |
| `analysis/transcript.json` + `subtitles.srt` | Reviewed timing master | 72 words, 8 cues; drives the actual renderer. |
| `project/src` and `project/components` | Original editable scenes | Delivered source; both aspect ratios share timing but use different layouts. |
| `output/` | Actual MP4s and QC evidence | Final masters, reports, review sheets, and manifest delivered. |
| `logs/repository-snapshots` and model/dependency folders | Audit/runtime evidence | Local-only, excluded from Git. |

## Timeline and audio preservation

- Source duration: **18.834250 seconds**.
- Video: **566 frames = 18.866667 seconds**, whole-frame quantization that contains the complete source.
- AAC stream duration: **18.880 seconds**, including normal codec padding; not an inserted spoken pause.
- No time stretch, pitch shift, rewrite, TTS, music, SFX, or artificial silence insertion.
- Both masters measured **0.999953 zero-lag source/export waveform correlation**, **−14.6 LUFS** integrated loudness (same as source), and **−2.0 dBFS** true peak.
- Audio is lossy AAC in the MP4 and is not claimed to be bit-identical; the stored MP3 master and public copy are bit-identical.

## Completed verification chain

```text
Source Git/blob/SHA match
  → exact-word user review
  → 72-word / 8-cue / 6-scene timing validation
  → TypeScript validation
  → 28 representative vertical/horizontal stills and contact sheets inspected
  → 3-line subtitle wrap defect found, corrected, and all stills regenerated
  → complete 540×960 preview rendered and 19 decoded timeline frames inspected
  → preview automated QC passed
  → full-resolution vertical render + independent horizontal render
  → BT.709 / limited-range / faststart normalization with AAC stream copy
  → 19 decoded frames from each final MP4 inspected
  → all final automated media/audio/timing/decode checks passed
```

Visual approval is explicitly recorded in `output/qc/visual-review.json`; automated scripts do not claim to perform human-like watching. Windows instructions are supplied but were not executed on the user's Windows PC.
