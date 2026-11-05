#!/usr/bin/env python3
"""Rebuild the voice-first master mix using the npm-provided FFmpeg binary."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent


def binary(package: str, key: str = "path") -> str:
    result = subprocess.check_output(["node", "-p", f"require('{package}').{key}"], cwd=PROJECT, text=True)
    return result.strip()


def main() -> None:
    ffmpeg = binary("@ffmpeg-installer/ffmpeg")
    voice = ROOT/"audio"/"1104.MP3"
    music = ROOT/"audio"/"music-original.wav"
    effects = ROOT/"audio"/"sound-effects.wav"
    master = ROOT/"audio"/"master-mix.wav"
    public = PROJECT/"public"/"audio"/"master-mix.mp3"
    filters = (
        "[0:a]highpass=f=65,loudnorm=I=-16:LRA=7:TP=-1.5[voice];"
        "[1:a]volume=0.28[music];[2:a]volume=0.45[sfx];"
        "[voice][music][sfx]amix=inputs=3:duration=first:dropout_transition=0,"
        "alimiter=limit=0.90,loudnorm=I=-14:LRA=9:TP=-1.0[out]"
    )
    subprocess.run([ffmpeg,"-hide_banner","-y","-i",str(voice),"-i",str(music),"-i",str(effects),"-filter_complex",filters,"-map","[out]","-ar","44100","-ac","2","-c:a","pcm_s16le",str(master)],check=True)
    public.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run([ffmpeg,"-hide_banner","-loglevel","error","-y","-i",str(master),"-c:a","libmp3lame","-b:a","192k",str(public)],check=True)
    print(f"Master mix written to {master} and {public}")


if __name__ == "__main__":
    main()
