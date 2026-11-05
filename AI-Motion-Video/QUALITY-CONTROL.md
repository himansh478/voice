# Quality Control Report

**Result:** PASS
**Master:** `renders/python-origin-1080x1920.mp4`

## Automated media checks

| Check | Result |
|---|---|
| h264Video | PASS |
| aacAudio | PASS |
| dimensions | PASS |
| vertical9x16 | PASS |
| 30fps | PASS |
| 1567Frames | PASS |
| fullSourceAudio | PASS |
| frameRoundedDuration | PASS |
| stereo48kHz | PASS |
| bt709LimitedRange | PASS |
| fastStartMp4 | PASS |
| noDetectedBlackFrames | PASS |
| noMissingAssets | PASS |
| wordTimingsValid | PASS |
| wordTimingsPreservedFromCuratedMaster | PASS |
| cueTimingsPreservedFromCuratedMaster | PASS |
| 158TimedWords | PASS |
| 26SubtitleCues | PASS |
| romanHinglishSubtitles | PASS |
| 11Scenes | PASS |

## Measured output

- Video: H264, 1080×1920, 30/1 fps, 1567 frames, yuv420p
- Audio: AAC, 48000 Hz, 2 channels, 52.224000 seconds
- Container duration: 52.233333 seconds; source recording: 52.21875 seconds
- Integrated loudness: **-14.9 LUFS**
- True peak: **-0.8 dBFS**
- File size: 23.77 MB
- Black-frame events: **0**
- Original audio SHA-256: `6b8b155231d2e236010dec3156b1d9ff329e1aadb19a0e3f614d34f343c38367`

The video is 1567 frames long (52.2333 seconds) so it contains the complete 52.21875-second recording; the small difference is one-frame timebase rounding, not added narration or a black tail.

## Visual and editorial review

- Complete low-resolution preview rendered and inspected before this master.
- 20 representative scene frames plus a one-frame-per-second full-timeline contact sheet reviewed.
- All 11 scenes checked against the corresponding spoken phrase; no unrelated stock footage.
- Roman Hinglish spelling, Inter / Latin-font subtitles, proper names, mobile contrast and safe areas reviewed.
- All 158 word timings and 26 cue timings preserved exactly from the curated pre-transliteration master (word SHA-256: 502a06cd87fbaffb25fbe11378113df1b5c2cc92be836deecb76ce3be313e1d6).
- Longest bilingual subtitles checked at 540-pixel preview width; SRT explicitly limited to two lines.
- Corrected the invention-network reveal and delayed the ecosystem growth to match the narration.
- Original voice retained; music and SFX are local procedural stems below the narration.

Machine-readable results and FFmpeg logs are in `renders/qc-report.json`, `renders/final-blackdetect.log`, and `renders/final-loudness.log`.
