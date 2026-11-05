#!/usr/bin/env python3
"""Build the reviewed Roman-Hinglish subtitle and six-scene timing master."""
from __future__ import annotations

import json
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent
ANALYSIS = ROOT / "analysis"
DURATION = 18.834250
FPS = 30
FRAMES = 566
SOURCE_SHA256 = "b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7"

# Confirmed wording: matlab (0.88–1.24), variable (14.50–14.90),
# and “automatically samajh jaata hai ki” (starting at 14.90).
CUES = [
    (0.00, 2.08, [4], [
        ("To",0.00,0.32),("data",0.32,0.58),("type",0.58,0.78),("se",0.78,0.88),
        ("matlab,",0.88,1.24),("kis",1.24,1.58),("tarah",1.58,1.72),("ka",1.72,2.08),
    ]),
    (2.08, 4.04, [2], [
        ("data",2.08,2.48),("variable",2.48,2.90),("store",2.90,3.30),
        ("kar",3.30,3.44),("sakta",3.44,3.76),("hai?",3.76,4.04),
    ]),
    (4.04, 6.58, [5], [
        ("To",4.04,4.14),("integer",4.14,4.64),("ek",4.64,4.76),("type",4.76,5.00),
        ("hota",5.00,5.18),("hai,",5.18,5.28),("float",5.34,5.62),("ek",5.62,5.86),
        ("type",5.86,6.12),("hota",6.12,6.36),("hai,",6.36,6.58),
    ]),
    (6.58, 9.16, [4], [
        ("string",6.60,7.14),("ek",7.14,7.32),("type",7.32,7.54),("hota",7.54,7.74),("hai,",7.74,7.88),
        ("boolean",7.92,8.24),("ek",8.24,8.50),("type",8.50,8.70),("hota",8.70,8.92),("hai.",8.92,9.16),
    ]),
    (9.16, 11.68, [5], [
        ("Aur",9.16,9.32),("ye",9.32,9.44),("data",9.44,9.74),("type",9.74,9.96),
        ("ko",9.96,10.20),("represent",10.20,10.80),("karne",10.80,11.14),
        ("ke",11.14,11.26),("liye",11.26,11.38),("Python",11.38,11.68),
    ]),
    (11.68, 13.64, [4], [
        ("mein",11.68,11.84),("koi",11.84,12.02),("alag",12.02,12.28),("se",12.28,12.40),
        ("symbol",12.40,12.78),("nahi",12.78,13.00),("lagana",13.00,13.26),
        ("padta",13.26,13.54),("hai.",13.54,13.64),
    ]),
    (13.64, 16.22, [3], [
        ("Python",13.64,14.36),("ka",14.36,14.50),("variable",14.50,14.90),
        ("automatically",14.90,15.50),("samajh",15.50,15.76),("jaata",15.76,16.02),
        ("hai",16.02,16.08),("ki",16.08,16.22),
    ]),
    (16.22, 18.60, [5], [
        ("ye",16.22,16.30),("kis",16.30,16.50),("tarah",16.50,16.68),("ka",16.68,16.82),
        ("data",16.82,17.08),("type",17.08,17.28),("store",17.28,17.60),
        ("kar",17.60,17.74),("raha",17.74,18.00),("hai.",18.00,18.22),
    ]),
]

KEYWORDS = {"data","type","matlab","variable","integer","float","string","boolean","python","symbol","automatically"}
SCENES = [
    {"id":"S01","start":0.00,"end":1.15,"title":"DATA TYPES","purpose":"Immediate data-types hook with an original variable/type relationship."},
    {"id":"S02","start":1.15,"end":4.04,"title":"DATA + VARIABLE","purpose":"Show the variable/data/type relationship without adding an example or new claim."},
    {"id":"S03","start":4.04,"end":6.58,"title":"INTEGER & FLOAT","purpose":"Reveal integer and float cards at their spoken anchors."},
    {"id":"S04","start":6.58,"end":9.16,"title":"STRING & BOOLEAN","purpose":"Complete the four-type system with string and boolean cards."},
    {"id":"S05","start":9.16,"end":13.64,"title":"NO SEPARATE SYMBOL","purpose":"Remove a generic symbol placeholder while retaining the variable/data association."},
    {"id":"S06","start":13.64,"end":FRAMES/FPS,"title":"AUTOMATICALLY","purpose":"Show generic automatic type recognition without selecting an unspoken example type."},
]


def srt_time(seconds: float) -> str:
    milliseconds = int(round(seconds * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    secs, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{milliseconds:03d}"


def scene_for_time(seconds: float) -> str:
    for scene in SCENES:
        if scene["start"] <= seconds < scene["end"]:
            return scene["id"]
    return "S06"


def main() -> None:
    captions = []
    words = []
    for cue_index, (start, end, breaks, items) in enumerate(CUES, 1):
        cue_words = []
        for text, word_start, word_end in items:
            word = {
                "id": len(words), "text": text, "start": word_start, "end": word_end,
                "keyword": text.strip(".,?").lower() in KEYWORDS,
                "sceneId": scene_for_time(word_start),
            }
            words.append(word)
            cue_words.append(word)
        text = " ".join(item[0] for item in items)
        lines = []
        current = []
        for index, item in enumerate(items):
            current.append(item[0])
            if index in breaks:
                lines.append(" ".join(current))
                current = []
        if current:
            lines.append(" ".join(current))
        assert len(lines) <= 2, (cue_index, lines)
        captions.append({
            "id": cue_index, "start": start, "end": end, "text": text,
            "lines": lines, "breakAfter": breaks, "words": cue_words,
        })

    assert len(words) == 72, len(words)
    assert len(captions) == 8
    assert len(SCENES) == 6
    assert all(word["start"] < word["end"] for word in words)
    assert all(words[i]["start"] <= words[i+1]["start"] for i in range(len(words)-1))
    assert all(ord(char) < 128 for word in words for char in word["text"])

    transcript = {
        "title": "Python Data Types — Original Voice Explainer",
        "language": "Hinglish",
        "script": "Latin / Roman Hinglish",
        "translated": False,
        "reviewed": True,
        "source": "1104 (1)(2).MP3",
        "sourceCommit": "993b4bedbb078988a25a9213cede66718a9a1b28",
        "sourceSha256": SOURCE_SHA256,
        "duration": DURATION,
        "fps": FPS,
        "durationInFrames": FRAMES,
        "wordCount": len(words),
        "cueCount": len(captions),
        "transcriptionMethod": "Two local Faster Whisper Small passes, followed by user confirmation of matlab, variable, and automatically samajh jaata hai ki. Obvious ASR spelling and token boundaries normalized without changing spoken wording.",
        "fullText": " ".join(caption["text"] for caption in captions),
        "words": words,
        "captions": captions,
    }
    timing = {
        "duration": DURATION, "fps": FPS, "durationInFrames": FRAMES,
        "sourceSha256": SOURCE_SHA256, "scenes": SCENES, "captions": captions,
    }

    (ANALYSIS / "transcript.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2) + "\n")
    (PROJECT / "src/data").mkdir(parents=True, exist_ok=True)
    (PROJECT / "src/data/timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2) + "\n")
    (ANALYSIS / "scene-plan.json").write_text(json.dumps({"fps":FPS,"durationInFrames":FRAMES,"scenes":SCENES}, indent=2) + "\n")

    srt_blocks = []
    for caption in captions:
        srt_blocks.append(
            f"{caption['id']}\n{srt_time(caption['start'])} --> {srt_time(caption['end'])}\n" + "\n".join(caption["lines"])
        )
    (ANALYSIS / "subtitles.srt").write_text("\n\n".join(srt_blocks) + "\n")

    full_text = (
        "To data type se matlab, kis tarah ka data variable store kar sakta hai?\n\n"
        "To integer ek type hota hai, float ek type hota hai, string ek type hota hai, boolean ek type hota hai.\n\n"
        "Aur ye data type ko represent karne ke liye Python mein koi alag se symbol nahi lagana padta hai.\n\n"
        "Python ka variable automatically samajh jaata hai ki ye kis tarah ka data type store kar raha hai."
    )
    (ANALYSIS / "subtitles.txt").write_text(full_text + "\n")
    markdown = f"""# Reviewed Narration Transcript and Timing

**Status:** REVIEWED — final subtitle master for production.

- Language: Hindi/Hinglish with English programming terms
- Subtitle script: **Roman Hinglish / Latin**
- Source duration: **{DURATION:.6f} seconds**
- Whole-frame composition: **{FRAMES} frames / {FRAMES/FPS:.6f} seconds at {FPS} FPS**
- Reviewed words: **{len(words)}**
- Subtitle cues: **{len(captions)}**, maximum two lines
- Source SHA-256: `{SOURCE_SHA256}`

The original voice is unchanged. Two local Faster Whisper Small passes were compared, then the user confirmed **matlab**, **variable**, and **automatically samajh jaata hai ki**. Obvious ASR spelling and merged/split token boundaries were normalized without adding, deleting or translating spoken words.

## Full reviewed transcript

{full_text}

## Cue timeline

"""
    for caption in captions:
        markdown += f"### Cue {caption['id']} — {caption['start']:.2f}–{caption['end']:.2f} s\n\n" + " / ".join(caption["lines"]) + "\n\n"
    markdown += "## Machine-readable files\n\n- `analysis/transcript.json`: reviewed word and cue timings\n- `analysis/subtitles.srt`: eight cues, maximum two lines\n- `analysis/subtitles.txt`: clean transcript\n- `project/src/data/timing.json`: the exact data used by both Remotion aspect ratios\n\nRaw ASR evidence remains in `transcript-raw.json`, `transcript-second-pass.json`, and `transcript-asr-review.md`.\n"
    (ANALYSIS / "transcript.md").write_text(markdown)
    print(f"Built {len(words)} reviewed words, {len(captions)} cues and {len(SCENES)} scenes.")


if __name__ == "__main__":
    main()
