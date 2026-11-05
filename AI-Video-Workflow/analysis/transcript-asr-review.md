# Narration Transcription and Review

## Status

**REVIEW REQUIRED — the raw ASR output is not yet the final subtitle master.** Two independent local decoding passes were completed. Unclear words are preserved for review rather than silently replaced with plausible text.

## Source

- File: `1104 (1)(2).MP3`
- Duration: **18.834250 seconds**
- Source commit: `993b4bedbb078988a25a9213cede66718a9a1b28`
- SHA-256: `b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7`
- Audio was not trimmed, slowed, pitch-shifted or regenerated.

## Verified local speech-to-text workflow

- Engine: existing **Faster Whisper 1.2.1**
- Model: local **Whisper Small**, CTranslate2 int8
- Inference: local CPU; no audio upload or paid API
- Detected language: **Hindi (`hi`)**, probability **0.9808684**
- Content: Hindi/Hinglish with English programming terms
- Pass 1: automatic language detection, beam size 5, VAD enabled, word timestamps enabled, no previous-text conditioning
- Pass 2: Hindi explicitly selected, beam size 10, VAD disabled, previous-text conditioning enabled

The second pass's language was forced from the first pass's detection; its reported language value is not treated as an independent language-detection score.

## First-pass segment transcription

```text
[0.000–4.040]
तो देटा ताइप से मडब किस तरा का देटा वेरियवल इस्टोर कर सकता हैं

[4.040–9.160]
तो इंटीजर एक ताइप होता हैं, फलोड एक ताइप होता हैं, अस्ट्रिंग एक ताइप होता हैं, बूलिन एक ताइप होता हैं

[9.160–13.640]
और ये देटा ताईप को रिप्रज़ें करने किलिए पाइदन में कोई अलेक से सिंबोल नहीं लगा रहा पड़ता है

[13.640–18.140]
पाइदन का विर्यवल अतोमेटिकलि समझ जाता है के ये किस तरागा देटा ताईप इस्तूर कर रहा है
```

## Second-pass segment transcription

```text
[0.000–4.040]
तो देटा ताइप से मडब किस तरा का देटा वेरियवल इस्टोर कर सकता हैं

[4.040–9.160]
तो इंटीजर एक ताइप होता हैं, फलोड एक ताइप होता हैं, इस्ट्रिंग एक ताइप होता हैं, बूलिन एक ताइप होता हैं

[9.160–18.220]
और ये देटा ताइप को रिप्रज़ें करने के लिए पाइदन में कोई अलेक से सिंबोल नहीं लगा रहा पड़ता हैं, पाइदन का विरियवल अतोमेटी के लिए समझ जाता हैं, ये किस तरा का देटा ताइप इस्टोर कर रहा हैं
```

The second pass is not automatically better: it changes several tokens and merges the final two segments. Both outputs are evidence, not ground truth.

## Required human wording review

| Time | Raw ASR evidence | Why it is blocked for final subtitles |
|---|---|---|
| **0.88–1.24 s** | Both passes produced **“मडब”** | This is not a reliable normalized word. Confirm the exact spoken word instead of silently inserting “matlab,” “map,” or another plausible term. |
| **14.50–14.90 s** | Pass 1: **“विर्यवल”**; pass 2: **“विरियवल”** | Confirm whether the speaker says “variable,” “interpreter,” or something else. These have different technical meanings. |
| **14.90–15.76 s** | Pass 1 suggests “automatically”; pass 2 splits the phrase differently | Confirm the complete phrase before caption normalization. |

Additional technical terms are contextually clear but still require final spelling review: **integer, float, string, boolean, Python, variable, data type**.

## Safe high-level understanding for visual planning

Without resolving the uncertain exact tokens, the recording clearly communicates:

1. A question about what kind of data a variable can store / how a data type relates to it.
2. Four named types: integer, float, string and boolean.
3. Python does not require a separate symbol to represent the data type.
4. Python/its variable mechanism recognizes the stored data type automatically; the exact subject wording around 14.5 seconds still needs confirmation.

No extra programming rule, example or sentence should be added to the captions.

## Timing evidence

- First-pass word timestamps and confidence values: `analysis/transcript-raw.json`
- Second-pass comparison: `analysis/transcript-second-pass.json`
- Low-confidence report: `analysis/transcription-review.json`

Useful visual anchors from the first pass:

| Anchor | Time |
|---|---|
| Opening question | 0.00–4.04 s |
| “integer” phrase | approximately 4.14–5.28 s |
| “float” phrase | approximately 5.34–6.58 s |
| “string” phrase | approximately 6.60–7.88 s |
| “boolean” phrase | approximately 7.92–9.16 s |
| No-separate-symbol explanation | 9.16–13.64 s |
| Automatic-recognition conclusion | 13.64–18.14 s |
| Remaining source tail | 18.14–18.83425 s |

## Subtitle plan after review

- Preserve the exact spoken Hinglish wording; do not translate the narration into English subtitles.
- Following the user's established subtitle preference, use **Roman Hinglish in a Latin font**.
- Create a reviewed word-level timing master and a maximum-two-line SRT.
- Highlight only actual spoken keywords at their measured times.
- Do not generate or deliver an “accurate final SRT” until the three review points are resolved.
