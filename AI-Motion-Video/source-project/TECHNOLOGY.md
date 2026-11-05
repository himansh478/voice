# Technology Choices

The actual build environment was a Debian Linux sandbox with Node.js 22 and Python 3.11; Windows compatibility is documented in `README.md` rather than assumed.

| Tool | Decision | Reason |
|---|---|---|
| Faster-Whisper / Whisper Small | **Used** | Local Hindi/Hinglish transcription, word timestamps and multiple repair passes; no voice upload. |
| FFmpeg / FFprobe | **Used** | Audio analysis, stem mixing, AAC/H.264 verification, loudness and black-frame QC. Platform binaries come from npm. |
| Remotion | **Primary video framework** | Deterministic frame rendering, React scene editing, reliable audio sync and direct MP4 export. |
| SVG / CSS / Remotion springs | **Primary motion system** | Custom masks, kinetic typography, parallax, infographics and transitions without template presets. |
| Three.js | **Used selectively in S06 and S11** | Real geometry, physical materials, particles, network lines, lighting and deterministic 3D cameras. |
| GSAP | **Evaluated; not required in the render path** | Remotion springs and frame-pure interpolation provide the needed motion without wall-clock timelines or a second animation runtime. |
| HyperFrames | **Not required** | This project already uses the equivalent HTML/CSS/React approach directly inside Remotion. |
| MotionClone | **Not applicable** | No reference-motion video was supplied; the scene choreography is original and narration-driven. |
| AI image/video generation | **Not claimed or required** | No generation service was configured. All visuals are local vector/CSS/Three.js artwork. |

The final source intentionally avoids unused render-time dependencies and remote services. Every frame can be reproduced from the included code, fonts, audio and JSON timing data.
