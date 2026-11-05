# Quality Control — 9x16

**Result:** PASS
**Master:** `output/final_voice_video_9x16.mp4`

## Automated checks

| Check | Result |
|---|---|
| h264Video | PASS |
| aacAudio | PASS |
| dimensions | PASS |
| requestedAspectRatio | PASS |
| 30fps | PASS |
| 566Frames | PASS |
| completeNarration | PASS |
| frameRoundedVideoDuration | PASS |
| stereo48kHz | PASS |
| bt709LimitedRange | PASS |
| fastStartMp4 | PASS |
| completeDecodeClean | PASS |
| noDetectedBlackFrames | PASS |
| noMissingAssets | PASS |
| sourceAudioSha256Preserved | PASS |
| publicAudioCopyIdentical | PASS |
| voiceWaveformPreserved | PASS |
| voiceLevelPreserved | PASS |
| wordTimingsValid | PASS |
| 72TimedWords | PASS |
| 8SubtitleCues | PASS |
| maximumTwoSubtitleLines | PASS |
| romanHinglishSubtitles | PASS |
| transcriptMatchesWordTokens | PASS |
| 6Scenes | PASS |
| renderTimingMatchesReviewedMaster | PASS |
| documentedVisualReviewPassed | PASS |

## Measured output

- Video: H264, 1080×1920, 30/1 fps, 566 frames, yuv420p
- Audio: AAC, 48000 Hz, 2 channels, 18.880000 seconds
- Container duration: 18.880000 seconds; source recording: 18.83425 seconds
- Integrated loudness: **-14.6 LUFS** (source -14.6 LUFS)
- True peak: **-2.0 dBFS**
- Source/export waveform correlation at zero lag: **0.999953**
- File size: 2.68 MB
- Black-frame events: **0**

## Documented visual review

```json
{
  "pass": true,
  "inspectedContactSheet": "output/qc/timeline-final-9x16.jpg",
  "decodedFinalTimelineFrames": 19,
  "representativeStillsDirectory": "output/qc/stills/vertical",
  "representativeStills": 15,
  "checks": {
    "maximumTwoSubtitleLines": true,
    "activeWordHighlightsReadable": true,
    "noTextClippingOrUnsafeEdges": true,
    "symbolTextDoesNotOverlap": true,
    "sceneOrderMatchesNarration": true,
    "semanticTypeHighlightsCorrect": true,
    "darkContrastReadableAfterBt709Normalization": true,
    "noReferenceFootageOrStockMediaVisible": true
  },
  "notes": "Inspected all 19 decoded one-second frames from the delivered 1080x1920 dark-console MP4 and 15 representative vertical renders. The corrected S05/S06 centering and symbol fades remain intact; no clipping or unreadable subtitle was observed."
}
```

Visual approval is recorded separately from automated tests; this script does not claim to watch the video by itself.
