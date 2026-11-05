# Source Verification

## Voice recording

| Check | Result |
|---|---|
| Repository | `https://github.com/himansh478/voice.git` |
| Requested file | `1104 (1)(2).MP3` |
| Confirmed remote `main` commit | `993b4bedbb078988a25a9213cede66718a9a1b28` |
| GitHub Git blob | `0666e805fe775ea9acea24470b74e727527ece74` |
| Local extracted Git blob | `0666e805fe775ea9acea24470b74e727527ece74` |
| Blob identity | **PASS — exact match** |
| SHA-256 | `b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7` |
| File size | 452,072 bytes |
| Codec | MP3 |
| Duration | **18.834250 seconds** |
| Sample rate | 44,100 Hz |
| Channels | 2 / stereo |
| Bit rate reported by container | 192,021 bits/s |

The project copy was extracted from the fetched `origin/main` Git object, not transcoded. The original audio remains the master.

### Windows-local limitation

The agent cannot directly access `C:\Users\sudha\Downloads\voice` from the sandbox. The local file verified here is the new project copy inside the sandbox checkout. The PowerShell commands in `analysis/repository-audit.md` let the user perform the same Git-blob and SHA-256 comparison on the Windows PC before rendering.

## Reference video

| Check | Result |
|---|---|
| Repository | `https://github.com/himansh478/refrence-video.git` |
| File | `Video-43221.mp4` |
| Audited commit | `cda241a79a179f916b1c936fcecd2ad846a1b147` |
| GitHub Git blob | `0a71703c14582c9848449769ccdf20c47aeedd29` |
| Local Git blob | `0a71703c14582c9848449769ccdf20c47aeedd29` |
| Blob identity | **PASS — exact match** |
| SHA-256 | `4e23506ce11b04abcd757618f44032d426454d83efb95fbafaf62e02f217a265` |
| File size | 1,700,649 bytes |
| Video | H.264, 720×1280, 30 FPS, 1215 frames |
| Audio | AAC, 44.1 kHz stereo |
| Duration | 40.585624 seconds |

The reference is for visual analysis only and will not be uploaded to another media service or committed into this repository.

## Machine-readable evidence

- `analysis/source-verification.json`
- `logs/audio-probe.json`
- `logs/reference-probe.json`
