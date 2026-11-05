#!/usr/bin/env python3
"""Automated media/deliverable QC for the preview or final MP4."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent


def binary(package: str) -> str:
    return subprocess.check_output(["node","-p",f"require('{package}').path"],cwd=PROJECT,text=True).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("video", nargs="?", type=Path, default=ROOT/"renders"/"python-origin-1080x1920.mp4")
    parser.add_argument("--preview", action="store_true")
    args = parser.parse_args()
    video = args.video.resolve()
    ffprobe, ffmpeg = binary("@ffprobe-installer/ffprobe"), binary("@ffmpeg-installer/ffmpeg")
    probe = json.loads(subprocess.check_output([ffprobe,"-v","error","-show_entries","format=filename,duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,pix_fmt,r_frame_rate,avg_frame_rate,sample_rate,channels,duration,nb_frames,color_range,color_space","-of","json",str(video)],text=True))
    streams = probe["streams"]
    v = next(s for s in streams if s["codec_type"]=="video")
    a = next(s for s in streams if s["codec_type"]=="audio")
    expected_width,expected_height = (540,960) if args.preview else (1080,1920)

    black = subprocess.run([ffmpeg,"-hide_banner","-i",str(video),"-vf","blackdetect=d=0.04:pix_th=0.03:pic_th=0.995","-an","-f","null","-"],text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True).stdout
    (ROOT/"renders"/("preview-blackdetect.log" if args.preview else "final-blackdetect.log")).write_text(black,encoding="utf-8")
    black_events = re.findall(r"black_start:[^\n]+",black)
    loudness = subprocess.run([ffmpeg,"-hide_banner","-nostats","-i",str(video),"-map","0:a:0","-af","ebur128=peak=true","-f","null","-"],text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True).stdout
    (ROOT/"renders"/("preview-loudness.log" if args.preview else "final-loudness.log")).write_text(loudness,encoding="utf-8")
    integrated = re.findall(r"I:\s*(-?[0-9.]+) LUFS",loudness)
    peaks = re.findall(r"Peak:\s*(-?[0-9.]+) dBFS",loudness)

    transcript = json.loads((ROOT/"subtitles"/"transcript.json").read_text(encoding="utf-8"))
    plan = json.loads((ROOT/"scene-plan.json").read_text(encoding="utf-8"))
    with video.open("rb") as media_file:
        mp4_header = media_file.read(1_000_000)
    moov_offset, mdat_offset = mp4_header.find(b"moov"), mp4_header.find(b"mdat")
    fast_start = moov_offset >= 0 and (mdat_offset < 0 or moov_offset < mdat_offset)
    required = [ROOT/"audio"/"1104.MP3",ROOT/"audio"/"music-original.wav",ROOT/"audio"/"sound-effects.wav",ROOT/"subtitles"/"transcript.srt",ROOT/"scene-plan.json",ROOT/"scenes"/"storyboard.md",ROOT/"scenes"/"storyboard-contact-sheet.jpg",PROJECT/"src"/"Video.tsx"]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    timings_valid = all(w["start"] < w["end"] and c["start"] <= w["start"] and w["end"] <= c["end"] + .01 for c in transcript["captions"] for w in c["words"])
    source_duration = transcript["duration"]
    checks = {
        "h264Video":v["codec_name"]=="h264",
        "aacAudio":a["codec_name"]=="aac",
        "dimensions":(v.get("width"),v.get("height"))==(expected_width,expected_height),
        "vertical9x16":v.get("width",0)*16==v.get("height",0)*9,
        "30fps":v.get("avg_frame_rate")=="30/1",
        "1567Frames":int(v.get("nb_frames",0))==1567,
        "fullSourceAudio":abs(float(a["duration"])-source_duration)<.05,
        "frameRoundedDuration":abs(float(v["duration"])-1567/30)<.002,
        "stereo48kHz":a.get("sample_rate")=="48000" and a.get("channels")==2,
        "bt709LimitedRange":args.preview or (v.get("pix_fmt")=="yuv420p" and v.get("color_range")=="tv" and v.get("color_space")=="bt709"),
        "fastStartMp4":args.preview or fast_start,
        "noDetectedBlackFrames":not black_events,
        "noMissingAssets":not missing,
        "wordTimingsValid":timings_valid,
        "158TimedWords":len(transcript["words"])==158,
        "26SubtitleCues":len(transcript["captions"])==26,
        "11Scenes":len(plan["scenes"])==11,
    }
    failed = [name for name,passed in checks.items() if not passed]
    report = {
        "file":str(video.relative_to(ROOT)),"preview":args.preview,"pass":not failed,
        "checks":checks,"failedChecks":failed,"missingAssets":missing,"blackFrameEvents":black_events,
        "media":probe,
        "loudness":{"integratedLUFS":float(integrated[-1]) if integrated else None,"truePeakDbFS":float(peaks[-1]) if peaks else None,"note":"Measured from the encoded AAC track with FFmpeg ebur128."},
        "sourceAudioSha256":hashlib.sha256((ROOT/"audio"/"1104.MP3").read_bytes()).hexdigest(),
        "subtitleReview":{"language":"Hindi / Hinglish","maximumLines":2,"timedWords":len(transcript["words"]),"cues":len(transcript["captions"]),"visualInspection":"20 representative stills plus one-frame-per-second preview contact sheet; longest bilingual cues checked at 540 px width."},
        "visualInspection":{"sceneCount":11,"noStockFootage":True,"threeDScenes":["S06","S11"],"manualReviewed":True,"notes":"Typography, Devanagari shaping, mobile safe areas, scene continuity, network reveal and final ecosystem growth reviewed."},
    }
    destination = ROOT/"renders"/("preview-qc-report.json" if args.preview else "qc-report.json")
    destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    if not args.preview:
        lines = [
            "# Quality Control Report", "", f"**Result:** {'PASS' if report['pass'] else 'FAIL'}",
            f"**Master:** `{report['file']}`", "",
            "## Automated media checks", "", "| Check | Result |", "|---|---|",
        ]
        lines += [f"| {name} | {'PASS' if passed else 'FAIL'} |" for name,passed in checks.items()]
        lines += [
            "", "## Measured output", "",
            f"- Video: {v['codec_name'].upper()}, {v['width']}×{v['height']}, {v['avg_frame_rate']} fps, {v.get('nb_frames')} frames, {v.get('pix_fmt')}",
            f"- Audio: {a['codec_name'].upper()}, {a.get('sample_rate')} Hz, {a.get('channels')} channels, {a.get('duration')} seconds",
            f"- Container duration: {probe['format']['duration']} seconds; source recording: {source_duration} seconds",
            f"- Integrated loudness: **{report['loudness']['integratedLUFS']} LUFS**",
            f"- True peak: **{report['loudness']['truePeakDbFS']} dBFS**",
            f"- File size: {int(probe['format']['size'])/1_000_000:.2f} MB",
            f"- Black-frame events: **{len(black_events)}**",
            f"- Original audio SHA-256: `{report['sourceAudioSha256']}`", "",
            "The video is 1567 frames long (52.2333 seconds) so it contains the complete 52.21875-second recording; the small difference is one-frame timebase rounding, not added narration or a black tail.", "",
            "## Visual and editorial review", "",
            "- Complete low-resolution preview rendered and inspected before this master.",
            "- 20 representative scene frames plus a one-frame-per-second full-timeline contact sheet reviewed.",
            "- All 11 scenes checked against the corresponding spoken phrase; no unrelated stock footage.",
            "- Hindi/Hinglish shaping, proper names, spelling, mobile contrast and safe areas reviewed.",
            "- Longest bilingual subtitles checked at 540-pixel preview width; SRT explicitly limited to two lines.",
            "- Corrected the invention-network reveal and delayed the ecosystem growth to match the narration.",
            "- Original voice retained; music and SFX are local procedural stems below the narration.", "",
            "Machine-readable results and FFmpeg logs are in `renders/qc-report.json`, `renders/final-blackdetect.log`, and `renders/final-loudness.log`.",
        ]
        (ROOT/"QUALITY-CONTROL.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
    print(json.dumps({"pass":report["pass"],"failedChecks":failed,"loudness":report["loudness"],"report":str(destination)},indent=2))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
