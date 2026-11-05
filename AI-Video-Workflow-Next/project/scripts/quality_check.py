#!/usr/bin/env python3
"""Reproducible media, source-audio, timing, and documented-visual-review QC."""
from __future__ import annotations

import argparse
from array import array
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
import sys

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent
OUTPUT = ROOT / "output"
EXPECTED_SOURCE_SHA256 = "b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7"


def binary(package: str) -> str:
    return subprocess.check_output(["node", "-p", f"require('{package}').path"], cwd=PROJECT, text=True).strip()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pcm_mono_48k(ffmpeg: str, path: Path) -> array:
    raw = subprocess.check_output([
        ffmpeg, "-v", "error", "-i", str(path), "-map", "0:a:0",
        "-ac", "1", "-ar", "48000", "-f", "f32le", "-",
    ])
    samples = array("f")
    samples.frombytes(raw)
    if sys.byteorder != "little":
        samples.byteswap()
    return samples


def waveform_comparison(ffmpeg: str, source: Path, exported: Path) -> dict:
    """Pearson correlation at zero lag; lossy AAC should remain extremely close to the source decode."""
    a, b = pcm_mono_48k(ffmpeg, source), pcm_mono_48k(ffmpeg, exported)
    n = min(len(a), len(b))
    if n < 48000:
        raise ValueError("Not enough decoded audio for waveform comparison")
    mean_a = math.fsum(a[i] for i in range(n)) / n
    mean_b = math.fsum(b[i] for i in range(n)) / n
    covariance = math.fsum((a[i] - mean_a) * (b[i] - mean_b) for i in range(n))
    energy_a = math.fsum((a[i] - mean_a) ** 2 for i in range(n))
    energy_b = math.fsum((b[i] - mean_b) ** 2 for i in range(n))
    correlation = covariance / math.sqrt(energy_a * energy_b)
    rms_a = math.sqrt(math.fsum(a[i] * a[i] for i in range(n)) / n)
    rms_b = math.sqrt(math.fsum(b[i] * b[i] for i in range(n)) / n)
    return {
        "pearsonCorrelationZeroLag": correlation,
        "lagSeconds": 0.0,
        "sourceDecodedSeconds": len(a) / 48000,
        "exportDecodedSeconds": len(b) / 48000,
        "sourceRMS": rms_a,
        "exportRMS": rms_b,
        "method": "Both audio tracks decoded independently to mono float PCM at 48 kHz, then compared over their shared duration at zero lag. AAC is lossy, so this is a similarity check, not a bit-identical audio claim.",
    }


def loudness(ffmpeg: str, path: Path) -> tuple[dict, str]:
    log = subprocess.run([
        ffmpeg, "-hide_banner", "-nostats", "-i", str(path), "-map", "0:a:0",
        "-af", "ebur128=peak=true", "-f", "null", "-",
    ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=True).stdout
    integrated = re.findall(r"I:\s*(-?[0-9.]+) LUFS", log)
    peaks = re.findall(r"Peak:\s*(-?[0-9.]+) dBFS", log)
    return ({
        "integratedLUFS": float(integrated[-1]) if integrated else None,
        "truePeakDbFS": float(peaks[-1]) if peaks else None,
    }, log)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("video", nargs="?", type=Path, default=OUTPUT / "final_voice_video_9x16.mp4")
    parser.add_argument("--preview", action="store_true")
    parser.add_argument("--aspect", choices=["9x16", "16x9"], default="9x16")
    args = parser.parse_args()
    video = args.video.resolve()
    if not video.exists():
        raise SystemExit(f"Video not found: {video}")
    key = ("preview-" if args.preview else "final-") + args.aspect
    qc_dir = OUTPUT / "qc"
    qc_dir.mkdir(parents=True, exist_ok=True)
    ffprobe, ffmpeg = binary("@ffprobe-installer/ffprobe"), binary("@ffmpeg-installer/ffmpeg")
    probe = json.loads(subprocess.check_output([
        ffprobe, "-v", "error", "-show_entries",
        "format=filename,duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,pix_fmt,r_frame_rate,avg_frame_rate,sample_rate,channels,duration,nb_frames,color_range,color_space,color_transfer,color_primaries",
        "-of", "json", str(video),
    ], text=True))
    streams = probe["streams"]
    v = next(s for s in streams if s["codec_type"] == "video")
    a = next(s for s in streams if s["codec_type"] == "audio")
    expected_dimensions = (540, 960) if args.preview else ((1080, 1920) if args.aspect == "9x16" else (1920, 1080))

    black_log = subprocess.run([
        ffmpeg, "-hide_banner", "-i", str(video), "-vf",
        "blackdetect=d=0.04:pix_th=0.03:pic_th=0.995", "-an", "-f", "null", "-",
    ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=True).stdout
    (qc_dir / f"{key}-blackdetect.log").write_text(black_log, encoding="utf-8")
    black_events = re.findall(r"black_start:[^\n]+", black_log)
    decode = subprocess.run([
        ffmpeg, "-v", "error", "-i", str(video), "-map", "0", "-f", "null", "-",
    ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (qc_dir / f"{key}-decode.log").write_text(decode.stdout, encoding="utf-8")

    source = ROOT / "assets" / "audio" / "1104 (1)(2).MP3"
    output_loudness, loudness_log = loudness(ffmpeg, video)
    source_loudness, _ = loudness(ffmpeg, source)
    (qc_dir / f"{key}-loudness.log").write_text(loudness_log, encoding="utf-8")
    waveform = waveform_comparison(ffmpeg, source, video)

    transcript = json.loads((ROOT / "analysis" / "transcript.json").read_text(encoding="utf-8"))
    timing = json.loads((PROJECT / "src" / "data" / "timing.json").read_text(encoding="utf-8"))
    plan = json.loads((ROOT / "analysis" / "scene-plan.json").read_text(encoding="utf-8"))
    with video.open("rb") as media_file:
        mp4_header = media_file.read(1_000_000)
    moov_offset, mdat_offset = mp4_header.find(b"moov"), mp4_header.find(b"mdat")
    fast_start = moov_offset >= 0 and (mdat_offset < 0 or moov_offset < mdat_offset)
    required = [
        source, ROOT / "analysis" / "subtitles.srt", ROOT / "analysis" / "architecture.md",
        ROOT / "analysis" / "source-verification.md", ROOT / "analysis" / "scene-plan.json",
        PROJECT / "src" / "Video.tsx", PROJECT / "components" / "Scenes.tsx",
        PROJECT / "public" / "1104 (1)(2).MP3",
    ]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    timings_valid = all(
        w["start"] < w["end"] and c["start"] <= w["start"] and w["end"] <= c["end"] + .01
        for c in transcript["captions"] for w in c["words"]
    )
    cues_valid = all(
        len(c["lines"]) <= 2 and len(c["breakAfter"]) == len(c["lines"]) - 1
        and all(0 <= i < len(c["words"]) - 1 for i in c["breakAfter"])
        for c in transcript["captions"]
    )
    review_path = qc_dir / "visual-review.json"
    reviews = json.loads(review_path.read_text(encoding="utf-8")) if review_path.exists() else {}
    visual_review = reviews.get(key, {"pass": False, "note": "No documented visual review for this output yet."})
    source_duration = float(transcript["duration"])
    level_delta = abs(output_loudness["integratedLUFS"] - source_loudness["integratedLUFS"])
    checks = {
        "h264Video": v["codec_name"] == "h264",
        "aacAudio": a["codec_name"] == "aac",
        "dimensions": (v.get("width"), v.get("height")) == expected_dimensions,
        "requestedAspectRatio": (v.get("width", 0) * (16 if args.aspect == "9x16" else 9) == v.get("height", 0) * (9 if args.aspect == "9x16" else 16)),
        "30fps": v.get("avg_frame_rate") == "30/1",
        "566Frames": int(v.get("nb_frames", 0)) == 566,
        "completeNarration": abs(float(a["duration"]) - source_duration) < .06,
        "frameRoundedVideoDuration": abs(float(v["duration"]) - 566 / 30) < .002,
        "stereo48kHz": a.get("sample_rate") == "48000" and a.get("channels") == 2,
        "bt709LimitedRange": args.preview or (v.get("pix_fmt") == "yuv420p" and v.get("color_range") == "tv" and v.get("color_space") == "bt709"),
        "fastStartMp4": args.preview or fast_start,
        "completeDecodeClean": decode.returncode == 0 and not decode.stdout.strip(),
        "noDetectedBlackFrames": not black_events,
        "noMissingAssets": not missing,
        "sourceAudioSha256Preserved": sha256(source) == EXPECTED_SOURCE_SHA256,
        "publicAudioCopyIdentical": sha256(PROJECT / "public" / "1104 (1)(2).MP3") == EXPECTED_SOURCE_SHA256,
        "voiceWaveformPreserved": waveform["pearsonCorrelationZeroLag"] >= .995 and waveform["lagSeconds"] == 0,
        "voiceLevelPreserved": level_delta <= .25,
        "wordTimingsValid": timings_valid,
        "72TimedWords": len(transcript["words"]) == 72,
        "8SubtitleCues": len(transcript["captions"]) == 8,
        "maximumTwoSubtitleLines": cues_valid,
        "romanHinglishSubtitles": transcript.get("script") == "Latin / Roman Hinglish" and all(ord(char) < 128 for word in transcript["words"] for char in word["text"]),
        "transcriptMatchesWordTokens": transcript["fullText"] == " ".join(w["text"] for w in transcript["words"]),
        "6Scenes": len(plan["scenes"]) == 6,
        "renderTimingMatchesReviewedMaster": timing["captions"] == transcript["captions"] and timing["scenes"] == plan["scenes"],
        "documentedVisualReviewPassed": visual_review.get("pass") is True,
    }
    failed = [name for name, passed in checks.items() if not passed]
    report = {
        "file": str(video.relative_to(ROOT)), "profile": key, "pass": not failed,
        "checks": checks, "failedChecks": failed, "missingAssets": missing,
        "blackFrameEvents": black_events, "media": probe,
        "loudness": {**output_loudness, "sourceIntegratedLUFS": source_loudness["integratedLUFS"], "absoluteIntegratedDeltaDb": level_delta},
        "waveformComparison": waveform,
        "sourceAudioSha256": sha256(source),
        "subtitleReview": {
            "language": "Roman Hinglish", "maximumLines": 2,
            "timedWords": len(transcript["words"]), "cues": len(transcript["captions"]),
            "timingsMatchRenderer": checks["renderTimingMatchesReviewedMaster"],
        },
        "visualReview": visual_review,
        "editorialNotes": [
            "No reference footage, stock media, music, or sound effects are included.",
            "The 566-frame video duration is whole-frame quantization of the 18.83425-second source; no narration was stretched.",
            "The encoded AAC stream may include normal codec padding. Waveform alignment and similarity are measured independently of container duration.",
        ],
    }
    destination = qc_dir / f"{key}-qc-report.json"
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if not args.preview:
        lines = [
            f"# Quality Control — {args.aspect}", "", f"**Result:** {'PASS' if report['pass'] else 'FAIL'}",
            f"**Master:** `{report['file']}`", "", "## Automated checks", "", "| Check | Result |", "|---|---|",
        ]
        lines += [f"| {name} | {'PASS' if passed else 'FAIL'} |" for name, passed in checks.items()]
        lines += [
            "", "## Measured output", "",
            f"- Video: {v['codec_name'].upper()}, {v['width']}×{v['height']}, {v['avg_frame_rate']} fps, {v.get('nb_frames')} frames, {v.get('pix_fmt')}",
            f"- Audio: {a['codec_name'].upper()}, {a.get('sample_rate')} Hz, {a.get('channels')} channels, {a.get('duration')} seconds",
            f"- Container duration: {probe['format']['duration']} seconds; source recording: {source_duration} seconds",
            f"- Integrated loudness: **{output_loudness['integratedLUFS']} LUFS** (source {source_loudness['integratedLUFS']} LUFS)",
            f"- True peak: **{output_loudness['truePeakDbFS']} dBFS**",
            f"- Source/export waveform correlation at zero lag: **{waveform['pearsonCorrelationZeroLag']:.6f}**",
            f"- File size: {int(probe['format']['size']) / 1_000_000:.2f} MB",
            f"- Black-frame events: **{len(black_events)}**", "",
            "## Documented visual review", "", "```json", json.dumps(visual_review, ensure_ascii=False, indent=2), "```", "",
            "Visual approval is recorded separately from automated tests; this script does not claim to watch the video by itself.",
        ]
        (OUTPUT / f"QUALITY-CONTROL-{args.aspect}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"pass": report["pass"], "failedChecks": failed, "loudness": report["loudness"], "waveform": waveform, "report": str(destination)}, indent=2))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
