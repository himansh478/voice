# Transcript and Subtitle Files

## Timing masters — use these

- `transcript.txt`: reviewed full Roman Hinglish transcript with cue timestamps.
- `transcript.srt`: 26 subtitle cues.
- `transcript.json`: the same cues plus 158 word-level timings, keywords, measured pauses and narrative structure.

These are the files used by the Remotion composition. Obvious ASR spelling mistakes and proper nouns were normalized without changing narration order or meaning. Subtitles use Inter / Latin letters and preserve the original Hinglish wording through transliteration, not English translation.

## ASR audit files — not subtitle masters

- `transcript-whisper-raw.json`: initial full-length Faster-Whisper pass.
- `transcript-verified-passes.json`: pause-aligned second passes used to recover long unreliable spans.

Raw ASR output can contain recognition errors; it is retained only to make the transcription workflow auditable. The reviewed timing master above supersedes it.

Detected language: Hindi (`hi`), probability 0.9480. Model: OpenAI Whisper Small / CTranslate2 int8 / Faster-Whisper 1.2.1. All processing was local; the voice was not uploaded to a transcription service.
