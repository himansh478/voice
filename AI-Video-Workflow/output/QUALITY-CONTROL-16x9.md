# Quality Control — 16x9

**Result:** PASS
**Master:** `output/final_voice_video_16x9.mp4`

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

- Video: H264, 1920×1080, 30/1 fps, 566 frames, yuv420p
- Audio: AAC, 48000 Hz, 2 channels, 18.880000 seconds
- Container duration: 18.880000 seconds; source recording: 18.83425 seconds
- Integrated loudness: **-14.6 LUFS** (source -14.6 LUFS)
- True peak: **-2.0 dBFS**
- Source/export waveform correlation at zero lag: **0.999953**
- File size: 2.30 MB
- Black-frame events: **0**

## Documented visual review

```json
{
  "pass": true,
  "inspectedContactSheet": "output/qc/timeline-final-16x9.jpg",
  "decodedFinalTimelineFrames": 19,
  "representativeStillsDirectory": "output/qc/stills/horizontal",
  "representativeStills": 14,
  "checks": {
    "maximumTwoSubtitleLines": true,
    "activeWordHighlightsReadable": true,
    "noTextClippingOrUnsafeEdges": true,
    "sceneOrderMatchesNarration": true,
    "semanticTypeHighlightsCorrect": true,
    "noReferenceFootageOrStockMediaVisible": true,
    "colorAndContrastReadableAfterBt709Normalization": true,
    "openingAndEndingReadable": true,
    "separateResponsiveCompositionNotStretched": true
  },
  "notes": "Inspected all 19 decoded one-second frames from the delivered 1920x1080 MP4 and 14 representative horizontal renders. The horizontal version uses separate left/right or four-column compositions, not a stretched or center-cropped vertical export."
}
```

Visual approval is recorded separately from automated tests; this script does not claim to watch the video by itself.
