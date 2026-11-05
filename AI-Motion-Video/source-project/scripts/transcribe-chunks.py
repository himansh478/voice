#!/usr/bin/env python3
"""Second-pass pause-aligned transcription to audit and repair long Whisper spans."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import soundfile as sf
from faster_whisper import WhisperModel

# Boundaries are placed in measured silences from silence-detection.txt.
CHUNKS = [(0.0, 10.35), (10.35, 19.30), (19.30, 25.00), (25.00, 34.05), (34.05, 44.40), (44.40, 52.21875)]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True, type=Path, help="Mono 16 kHz WAV")
    parser.add_argument("--model", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--prompt", default=None)
    args = parser.parse_args()

    audio, sample_rate = sf.read(args.audio, dtype="float32")
    model = WhisperModel(str(args.model), device="cpu", compute_type="int8", cpu_threads=2)
    output = []
    for index, (start, end) in enumerate(CHUNKS):
        clip = audio[round(start * sample_rate):round(end * sample_rate)]
        segments_iter, info = model.transcribe(
            clip,
            language="hi",
            task="transcribe",
            beam_size=5,
            best_of=5,
            word_timestamps=True,
            condition_on_previous_text=False,
            temperature=0.0,
            initial_prompt=args.prompt,
            vad_filter=False,
        )
        segments = []
        for segment in segments_iter:
            item = {
                "start": round(start + segment.start, 3),
                "end": round(start + segment.end, 3),
                "text": segment.text.strip(),
                "avg_logprob": segment.avg_logprob,
                "words": [
                    {
                        "start": round(start + w.start, 3),
                        "end": round(start + w.end, 3),
                        "word": w.word,
                        "probability": w.probability,
                    }
                    for w in (segment.words or [])
                ],
            }
            segments.append(item)
            print(f"[{item['start']:6.2f} -> {item['end']:6.2f}] {item['text']}", flush=True)
        output.append({"chunk": index, "source_start": start, "source_end": end, "segments": segments})

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({"language": "hi", "chunks": output}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
