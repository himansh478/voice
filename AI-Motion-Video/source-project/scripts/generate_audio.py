#!/usr/bin/env python3
"""Create an original ambient score and restrained synchronized sound design.

No samples or external recordings are used. The narration is never synthesized.
Run with the project virtual environment (numpy + soundfile).
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "AI-Motion-Video" / "audio"
SR = 44100
DURATION = 52.21875
N = round(SR * DURATION)
RNG = np.random.default_rng(1989)


def midi(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def pan_add(destination: np.ndarray, signal: np.ndarray, start: int, pan: float = 0.0) -> None:
    if start >= N or start + len(signal) <= 0:
        return
    source_start = max(0, -start)
    start = max(0, start)
    length = min(len(signal) - source_start, N - start)
    if length <= 0:
        return
    angle = (pan + 1) * np.pi / 4
    destination[start:start+length, 0] += signal[source_start:source_start+length] * np.cos(angle)
    destination[start:start+length, 1] += signal[source_start:source_start+length] * np.sin(angle)


def tone(freq: float, seconds: float, decay: float = 3.0) -> np.ndarray:
    t = np.arange(round(seconds * SR)) / SR
    envelope = (1 - np.exp(-t * 45)) * np.exp(-t * decay)
    return (np.sin(2*np.pi*freq*t) + .24*np.sin(2*np.pi*freq*2.002*t)) * envelope


def whoosh(seconds: float = .55) -> np.ndarray:
    t = np.arange(round(seconds * SR)) / SR
    noise = RNG.normal(0, 1, len(t))
    smooth = np.convolve(noise, np.ones(18)/18, mode="same")
    envelope = np.sin(np.pi * np.clip(t/seconds, 0, 1)) ** 2
    shimmer = np.sin(2*np.pi*(180*t + 900*t*t)) * .12
    return (smooth * .8 + shimmer) * envelope


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    music = np.zeros((N, 2), dtype=np.float64)
    sfx = np.zeros_like(music)

    # D-minor-centred ambient harmony, deliberately sparse under the narration.
    sections = [
        (0.0, 8.26, 50), (8.26, 16.45, 46), (16.45, 24.70, 53),
        (24.70, 34.05, 48), (34.05, 40.20, 50), (40.20, 46.35, 53),
        (46.35, DURATION, 50),
    ]
    for section_index, (start_s, end_s, root) in enumerate(sections):
        start = round(start_s * SR)
        end = round(end_s * SR)
        t = np.arange(end-start) / SR
        fade = np.minimum(1, t/1.1) * np.minimum(1, (end-start)/SR - t)
        fade = np.sin(np.clip(fade, 0, 1)*np.pi/2)**2
        chord = [root, root+7, root+12, root+15 if section_index%2 else root+16]
        pad = np.zeros_like(t)
        for j, note in enumerate(chord):
            freq = midi(note)
            pad += (.022/(1+j*.25)) * (
                np.sin(2*np.pi*freq*t + j*.7) +
                .25*np.sin(2*np.pi*(freq*1.003)*t + j) +
                .12*np.sin(2*np.pi*freq*2*t + j*.3)
            )
        bass = .019*np.sin(2*np.pi*midi(root-12)*t) * (.55+.45*np.sin(2*np.pi*.09*t)**2)
        signal = (pad+bass)*fade
        pan_add(music, signal*(.94+.06*np.sin(2*np.pi*.05*t)), start, -.18)
        pan_add(music, signal*(.94+.06*np.cos(2*np.pi*.047*t)), start, .18)

        for k, offset in enumerate(np.arange(1.0, end_s-start_s, 1.5)):
            note = chord[(k+section_index)%len(chord)] + 12
            pluck = tone(midi(note), 1.8, 3.7) * .014
            pan_add(music, pluck, round((start_s+offset)*SR), -.55 + (k%4)*.36)

    events: list[dict] = []
    boundaries = [3.05, 8.26, 10.50, 16.45, 21.20, 27.50, 34.05, 37.45, 40.20, 46.35]
    for i, at in enumerate(boundaries):
        signal = whoosh() * .095
        pan_add(sfx, signal, round((at-.25)*SR), -.45 if i%2 else .45)
        events.append({"time":round(at-.25,3),"type":"whoosh","purpose":"scene transition"})

    impacts = [0.08, 1.66, 6.48, 8.28, 19.94, 24.22, 36.86, 38.90, 44.50, 50.96]
    for i, at in enumerate(impacts):
        seconds = 1.35
        t = np.arange(round(seconds*SR))/SR
        low = np.sin(2*np.pi*(52 if i%2 else 58)*t)*np.exp(-t*5.2)
        body = np.sin(2*np.pi*midi(62+i%3)*t)*np.exp(-t*7.5)*.25
        click = RNG.normal(0,1,len(t))*np.exp(-t*60)*.06
        signal = (low*.12+body*.1+click)*np.minimum(1,t*100)
        pan_add(sfx, signal, round(at*SR), 0)
        events.append({"time":at,"type":"tonal impact","purpose":"visual reveal"})

    for i, at in enumerate([4.30,9.36,11.05,14.86,15.48,16.60,21.62,25.84,26.64,29.66,32.28,34.16,40.18,40.94,42.49,46.38,52.02]):
        signal = tone(midi(74+(i%5)*2), .38, 15) * .018
        pan_add(sfx, signal, round(at*SR), -.35+(i%4)*.22)
        events.append({"time":at,"type":"UI / bell tick","purpose":"narration-synchronized detail"})

    # Gentle stem headroom. Mixing levels are documented in mix command and README.
    music *= .8 / max(1e-9, np.max(np.abs(music)))
    sfx *= .72 / max(1e-9, np.max(np.abs(sfx)))
    sf.write(OUT/"music-original.wav", music, SR, subtype="PCM_16")
    sf.write(OUT/"sound-effects.wav", sfx, SR, subtype="PCM_16")
    (OUT/"sound-design.json").write_text(json.dumps({
        "sampleRate":SR,"duration":DURATION,"channels":2,
        "music":"Original procedural ambient score; no samples",
        "mixIntent":"Voice first. Music -11 dB stem trim; SFX -7 dB stem trim before final loudness normalization.",
        "events":sorted(events,key=lambda e:e["time"]),
    },indent=2),encoding="utf-8")
    print(f"Wrote original music and {len(events)} synchronized sound events to {OUT}")


if __name__ == "__main__":
    main()
