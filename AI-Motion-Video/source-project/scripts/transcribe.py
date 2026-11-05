#!/usr/bin/env python3
"""Offline Faster-Whisper transcription with segment and word timestamps.

Usage:
  python scripts/transcribe.py --audio ../audio/1104.MP3 \
    --model /path/to/whisper-small --output ../subtitles/transcript-whisper-raw.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from faster_whisper import WhisperModel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True, type=Path)
    parser.add_argument("--model", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--language", default=None)
    args = parser.parse_args()

    model = WhisperModel(str(args.model), device="cpu", compute_type="int8", cpu_threads=2)
    segments_iter, info = model.transcribe(
        str(args.audio),
        language=args.language,
        task="transcribe",
        beam_size=5,
        best_of=5,
        patience=1.0,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 300, "speech_pad_ms": 180},
        condition_on_previous_text=True,
        temperature=0.0,
    )

    segments = []
    for segment in segments_iter:
        item = {
            "id": segment.id,
            "seek": segment.seek,
            "start": round(segment.start, 3),
            "end": round(segment.end, 3),
            "text": segment.text.strip(),
            "avg_logprob": segment.avg_logprob,
            "no_speech_prob": segment.no_speech_prob,
            "compression_ratio": segment.compression_ratio,
            "words": [
                {
                    "start": None if word.start is None else round(word.start, 3),
                    "end": None if word.end is None else round(word.end, 3),
                    "word": word.word,
                    "probability": word.probability,
                }
                for word in (segment.words or [])
            ],
        }
        segments.append(item)
        print(f"[{segment.start:6.2f} -> {segment.end:6.2f}] {segment.text.strip()}", flush=True)

    payload = {
        "audio": str(args.audio),
        "model": "OpenAI Whisper small / CTranslate2 int8 / faster-whisper 1.2.1",
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "duration_after_vad": info.duration_after_vad,
        "transcription": "transcribe (original spoken language; no translation)",
        "segments": segments,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDetected language: {info.language} ({info.language_probability:.3f})")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
