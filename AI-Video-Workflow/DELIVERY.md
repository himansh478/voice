# Delivery Notes

## Open these first

1. **Primary video:** `output/final_voice_video_9x16.mp4`
2. **Horizontal video:** `output/final_voice_video_16x9.mp4`
3. **Setup and editing:** `README.md`
4. **QC:** `output/QUALITY-CONTROL-9x16.md` and `output/QUALITY-CONTROL-16x9.md`
5. **Exact file hashes:** `delivery-manifest.json`

## What is included

- Two actual H.264/AAC MP4 masters, each 566 frames at 30 FPS with 48 kHz stereo audio.
- Separate responsive 1080×1920 and 1920×1080 compositions.
- Original, unchanged MP3 master and byte-identical public render copy.
- Reviewed 72-word Roman-Hinglish transcript, eight-cue SRT, word/cue timing JSON, and six-scene plan.
- Complete editable Remotion/React/TypeScript source and local render/QC scripts.
- Source/reference analysis, 23-repository audit, architecture report, raw ASR evidence, and final QC evidence.

## Final measured results

| Check | 9:16 | 16:9 |
|---|---:|---:|
| Technical and documented visual QC | PASS | PASS |
| Dimensions | 1080×1920 | 1920×1080 |
| Video | H.264, yuv420p, BT.709 limited range | H.264, yuv420p, BT.709 limited range |
| Audio | AAC, 48 kHz stereo | AAC, 48 kHz stereo |
| Integrated loudness | −14.6 LUFS | −14.6 LUFS |
| True peak | −2.0 dBFS | −2.0 dBFS |
| Source/export waveform correlation | 0.999953 | 0.999953 |
| Detected black-frame events | 0 | 0 |
| Complete decode errors | 0 | 0 |

The delivered AAC is lossy, so audio is not claimed to be bit-identical to the MP3. Both stored MP3 files are bit-identical to the verified Git source. No speed/pitch change, narration rewrite, music, SFX, stock media, or reference footage was introduced.

## Review boundary

Representative stills and 19 decoded one-second frames from each final MP4 were visually inspected. This is documented frame-based review, not continuous playback on a physical device. Automated QC and visual approval are separate fields in the JSON reports. Windows/PowerShell instructions are reproducible project commands but were not executed on the user's PC.

See `README.md` for editing and rendering, and `analysis/repository-audit.md` for license/privacy decisions—including Remotion's organization-size license condition.
