# Repository Audit and Installation Approval Gate

**Audit date:** 2026-11-05
**Project:** `AI-Video-Workflow`
**Source voice commit:** `993b4bedbb078988a25a9213cede66718a9a1b28`
**Audit status:** Complete for installation decision; no repository installation or third-party script execution was performed.

## Implementation outcome after the audit

The user selected **existing tools only** and confirmed the unclear narration as “matlab,” “variable,” and “automatically samajh jaata hai ki.” No npm/pip package, new font, repository installer, or third-party setup script was installed/executed for the production. Existing Remotion/React/FFmpeg/Fontsource dependencies were reused; the lockfile was generated metadata-only without lifecycle scripts. JetBrains Mono was not installed or used.

The approved existing-tools implementation is now complete: reviewed 72-word/8-cue timings, six original scenes, separate vertical/horizontal Remotion masters, and actual media/visual QC. Final reproduction commands and measured results are in `README.md`, `DELIVERY.md`, and `output/`; the historical approval commands below are retained as audit evidence. Where they differ, the delivered `project/package.json` and `package-lock.json` are authoritative.

## 1. Scope and method

All 23 requested repositories were checked through the GitHub API. The audit inspected repository metadata, current README files, recursive file trees, license files, dependency manifests, and selected installers/source files. Installers were read as text, never run. No npm/pip package was installed for this audit.

- 22 repositories were available; `stefancrcbiz-dev/hyperframes-editor` returned HTTP 404.
- Windows compatibility below means **documented or inferred from source/manifests**, not tested on the user's Windows PC.
- Maintenance is based on each repository's reported default-branch `pushed_at` date, not stars alone.
- Security findings are a focused static supply-chain/privacy review, not a formal penetration test or proof that a project is vulnerability-free.
- Exact metadata is saved in `analysis/repository-metadata.json`. Raw third-party snapshots are local audit evidence and are excluded from delivery commits.

## 2. Executive decision

Use **one primary animation engine: Remotion**, with original React/CSS/SVG scenes. Use **FFmpeg** for probing, audio preservation, final H.264/AAC delivery and QC. Keep the already available **Faster Whisper + local Whisper Small** model for offline transcription. Do not install HyperFrames, MotionClone, GSAP, Three.js skill packs, a second editor, or any paid media API for this project.

The reference is a clean, light educational code explainer. Its design can be reproduced with deterministic 2D Remotion compositions; 3D, reference reconstruction and a second HTML renderer would add cost and risk without improving the result.

## 3. Repository comparison

| # | Repository, actual function and type | Windows / Claude Code compatibility | License and maintenance | Dependencies, APIs, privacy and security findings | Decision / integration potential |
|---|---|---|---|---|---|
| 1 | **kurbaitaev/ghost-editor** — AI talking-head reel editor and Claude skill, not a general motion engine. | Built/tested for Apple-silicon macOS; caption QA uses macOS text recognition. Other agents are untested. | MIT core; bundled fonts/models/assets have separate notices. Pushed 2026-10-30. | FFmpeg, Node, Whisper, OpenCV and large optional model environments. Paid Claude plan expected. Optional Gemini vision sends selected frames to Google; optional ElevenLabs. Installer downloads asset libraries and can prepare multi-GB environments. | **Reject.** Wrong OS and wrong input type; unnecessary cloud vision and heavy dependencies. |
| 2 | **AgriciDaniel/claude-shorts** — interactive longform-to-shortform clipping, segment scoring, cursor tracking and Remotion captions. | Windows documented through WSL 2 and Unix tools; designed for Claude Code. | MIT; fonts under SIL OFL. Pushed 2026-07-11. | `setup.sh` creates a shared/user venv and installs Torch, Faster Whisper, MediaPipe, OpenCV and npm dependencies. Requires FFmpeg, bash, jq and Claude. Install scripts were not run. | **Reject for this brief.** Input is already an 18.83-second short; clipping/scoring adds no value and Remotion would be duplicated. |
| 3 | **blixvip/MotionClone** — Windows app that reconstructs reference videos into editable HyperFrames/Remotion projects using Codex/ChatGPT. | Explicit Windows support; local FastAPI server on `127.0.0.1:4319`; ChatGPT/Codex workflow rather than Claude-native. | **No project-wide open-source license**; third-party notices do not grant rights to the whole app. Pushed 2026-10-27. | `start.ps1` creates a venv, installs pinned FastAPI/Playwright/OpenCV/yt-dlp packages and runs `npm ci`. Selected reference frames are sent to ChatGPT. User account model access, costs and limits apply; no API key is not the same as no external upload. | **Reject.** Privacy-sensitive reference upload, no whole-project license, paid/account dependency, and unnecessary reconstruction for an original 2D design. |
| 4 | **austriandev/motionclone** — earlier/derived MotionClone app with the same basic function. | Windows local app, same server/renderer model. | No project-wide license. Pushed 2026-09-12; no stars/forks at audit time. | Same ChatGPT frame-transfer and account requirements. Tree comparison with `blixvip/MotionClone`: 133 common paths, **91 identical blobs (68.4%)**. | **Reject as duplicate.** Older derivative, no license and no advantage over the already rejected upstream. |
| 5 | **kajisho5/ffmpeg-skill** — 42 local FFmpeg editing/QC tools, agent skill and optional MCP server. | Documented and CI-tested on Windows, macOS and Linux; Claude Code, Cursor and Codex. | MIT. Very actively maintained; pushed 2026-11-05. | Node ≥16 installer; Python ≥3.10 and FFmpeg ≥6.1 at runtime; no runtime npm dependencies or cloud/API requirement. Optional local ASR may download model weights. Installer copies files into agent directories and invokes local Python/FFmpeg checks. | **Best audited auxiliary repo, but optional.** Direct project scripts already cover this short render, so it is not required. Useful later for advanced footage workflows. |
| 6 | **donghaozhang/ffmpeg-claude-skill** — small FFmpeg command documentation/demo skill. | Claude-oriented; basic commands are portable, but no meaningful Windows validation was found. | **No license file**; README's “Generated with Claude Code” is not a license. Pushed 2025-12-15. | Requires FFmpeg and an agent; mostly documentation and demo media. No unique processing engine. | **Reject.** Unclear reuse rights and fully duplicated by FFmpeg documentation/the better-maintained skill above. |
| 7 | **yt-dlp/yt-dlp** — feature-rich command-line media downloader, not an editor or Claude skill. | Standalone Windows binaries and Python package available. | Source is Unlicense; some bundled executables include GPLv3+ code, and other release artifacts have separate terms. Pushed 2026-11-04. | Network access to source sites is its purpose; many optional networking/metadata/extractor dependencies. FFmpeg needed for merging/post-processing. | **Do not install.** Both source assets are already on GitHub and were fetched directly with verified hashes. |
| 8 | **openai/whisper** — official local speech-recognition Python package and model weights. | Windows usable with Python and FFmpeg; not Claude-specific. | **MIT for code and model weights.** Pushed 2026-08-31. | Dependencies include Torch, tiktoken, numba, NumPy and platform-specific Triton; relatively heavy. First model use downloads weights from `openaipublic.azureedge.net` and verifies the SHA-256 embedded in the model URL. Local inference does not require a paid API or upload audio. | **License passes; official implementation not required here.** Existing Faster Whisper uses the same Whisper Small model family with lower operational weight. Keep official Whisper as a fallback, not a second ASR install. |
| 9 | **iart-ai/motion-skills** — collection/index linking to separately installable motion packs, not a renderer itself. | `npx skills` and agent discovery are cross-platform; compatibility belongs to each linked pack. | MIT for this index; linked projects retain their own licenses. Pushed 2026-10-25. Current README lists 19 packs despite broader repository description. | Installs through a third-party skills CLI and external repositories. No local animation engine in this nine-file repo. | **Skip.** Only an index; install nothing transitively. Also substantially duplicated by #11. |
| 10 | **imMamdouhaboammar/motion-graphics-skills** — very large HyperFrames/GSAP/Blender skill and project collection. | Agent-compatible text exists, but shell tooling and optional providers vary by skill. | **Proprietary / All Rights Reserved.** License limits public viewing to personal non-commercial inspection and prohibits production copying/modification without written permission. Pushed 2026-11-01. | Large repository, shell install/validation, HyperFrames and optional media/TTS providers. Media-use code contains PostHog telemetry with opt-out environment variables. | **Do not use, copy or install.** License alone disqualifies it for production; telemetry and size add further risk. |
| 11 | **kevinbadi/claude-motion-skills** — another motion-pack index. | Same skills CLI/agent model as #9; linked-pack compatibility varies. | MIT index. Pushed 2026-09-23. | Nine-file tree; **8 of 9 common paths have identical blobs to #9 (88.9%)**. Linked packs require separate review. | **Reject as duplicate.** No direct renderer or unique material benefit. |
| 12 | **charlie947/motion-graphics-skills** — 15 workflow/prompt skills for briefs, launch videos, reference analysis and export. | Claude Code/Codex guidance; manual text use is portable. Export workflows generally expect HyperFrames. | MIT. Pushed 2026-10-11. | Repository says no API key is needed; an agent account may still have its own cost. Reference-to-motion produces prompts, while reel-export supplies FFmpeg commands; neither is a separate engine. | **Useful general ideas, no installation needed.** Our own reference analysis and QC already cover this project's needs without adopting its HyperFrames route. |
| 13 | **remotion-dev/skills** — official Remotion agent instructions for captions, rendering, studio, licensing and upgrades. | Cross-platform agent text; Remotion itself supports Windows. | **No repository license file found**, so default copyright applies to copying the skill content. Very active; pushed 2026-11-05. | Remotion 4.x development dependencies; no independent media API. License skill points to Remotion's commercial terms. | **Do not copy/install the unlicensed skill pack.** Use the installed Remotion product and its public documentation directly. |
| 14 | **Barty-Bart/motion-graphics** — explainer, motion-B-roll, object-separation and sound-effect skills with a small HTML renderer. | Claude/Codex text is portable; setup scripts and `NODE_PATH` examples are Unix-oriented and would need Windows adaptation. | MIT core; Geist OFL, Lucide ISC, bundled SFX CC0; some runtime media has separate Mixkit terms. Pushed 2026-10-13. | Playwright/Chromium, Node, Python, FFmpeg; optional Faster Whisper and scientific audio packages. Some typing/music downloads occur at runtime. Includes its own renderer and approval/QC workflow. | **Skip for this build.** Helpful patterns, but it would introduce another renderer and unnecessary B-roll/audio dependencies. No talking-head footage is present. |
| 15 | **cesartevisual/threejs-skills** — 24 text skills for Three.js/R3F/WebGPU/shaders. | Agent text is cross-platform; independent of Three.js maintainers. | MIT. Pushed 2026-09-10. | No rendering runtime in the skill repo itself; uses the external skills CLI. Actual Three.js dependencies arise only in a project that needs 3D. | **Not required.** The reference and narration need clear 2D code/state graphics, not 3D. |
| 16 | **impertio-studio/three.js-claude-skill-package** — 24 deterministic Three.js instruction packs. | Documentation/skill format is agent-compatible and OS-neutral. | MIT. Pushed 2026-07-08. | Package manifest has no scripts or runtime dependencies; underlying Three.js stack would still need installation if used. | **Reject as duplicate guidance.** No 3D scenes are justified for this short reference style. |
| 17 | **alton47/threejs-skills** — Three.js best-practice skill set. | Agent text works with multiple hosts; no OS-specific runtime. | MIT. Pushed 2026-03-25. | Text guidance does not make network requests by itself; uses external `npx skills` if installed that way. | **Skip.** Older duplicate of #15/#16 and no project-specific benefit. |
| 18 | **SoftwareInFocus/threejs-skills** — broad agent-skill collection covering web design, games and media, not just Three.js. | Compatibility varies across 891 files and many workflows; not uniformly Windows-validated. | MIT. Pushed 2026-08-18. | Includes optional external service workflows such as ElevenLabs/Aura/Unsplash and browser/video tasks. Much broader than this project requires. | **Reject as overbroad.** Large unrelated surface and no need for its media or WebGL workflows. |
| 19 | **heygen-com/hyperframes** — full HTML-to-video framework, CLI, studio, skills and cloud deployment options. | Documented Windows support and Windows render CI; CLI requires Node ≥22; repository development uses Bun. | **Apache-2.0**, no per-render fee/commercial threshold. Extremely active; pushed 2026-11-05. | Local rendering uses headless Chrome and FFmpeg. Pro studio models are paid/optional; basic use needs no env API key. **Telemetry defaults to enabled** and posts usage/system metadata to PostHog. Source says paths/composition content are not collected; `HYPERFRAMES_NO_TELEMETRY=1` or `DO_NOT_TRACK=1` disables it. Signed-in usage can be linked to the HeyGen account. | **Technically viable but not selected.** It duplicates Remotion and has a larger install/telemetry surface. No HyperFrames code or service is needed. |
| 20 | **saranambiar/hyperframes-video-agent-skills** — eight community workflow skills for HyperFrames production, captions, audio and QA. | Includes PowerShell examples; requires the HyperFrames route for full value. | Apache-2.0. Pushed 2026-06-14. | FFmpeg/captions/audio workflow guidance; provider needs depend on the chosen media skills. Not an official HeyGen repo. | **Good QA ideas, but no install.** The planned Remotion pipeline implements equivalent source-scene, caption and QC stages directly. |
| 21 | **stefancrcbiz-dev/hyperframes-editor** — availability and functionality could not be verified. | Unknown. | GitHub API returned **HTTP 404** on 2026-11-05; no license or maintenance data available. | No files were available for safe inspection. It may be private, renamed or deleted; do not infer which. | **Block/reject.** Do not install from mirrors or guessed replacement URLs. |
| 22 | **zhuyansen/awesome-claude-video-skills** — curated catalog and external evaluation links, not an executable video tool. | Information resource only; linked tools need individual audits. | **CC0 1.0 for the list itself**; every linked project has its own license. Pushed 2026-11-04. Current README describes 419 listed repos. | No runtime dependency in the list. External safety grades are secondary evidence, not a substitute for source review. | **Reference only.** Its “no skill can also work” conclusion supports keeping this build simple. |
| 23 | **clonn/awesome-agent-video-skills** — curated catalog of 184 video-agent repositories with metadata and cards. | Information resource only. | MIT for the collection; linked licenses remain independent. Pushed 2026-10-10. | README explicitly says install text was not executed and safety grades cover limited evidence. No renderer to install. | **Reference only.** Do not treat catalog inclusion as approval for any linked package. |

## 4. Security assessment for the recommended stack

### Privacy

- The source MP3 and reference MP4 were fetched only from the user-specified GitHub repositories through authenticated GitHub tooling.
- No audio or reference frame was sent to Gemini, ChatGPT, HeyGen, an AI video generator, stock service, or another external media service.
- Faster Whisper transcription used a local model path and local audio. Once model weights and packages are cached, inference and rendering can run offline.
- Reference media, extracted reference frames and raw third-party source snapshots are excluded from delivery commits. The reference footage will not be included in final video content.

### Supply chain and execution

- No requested repository's installer, setup script, shell script, PowerShell script or npm lifecycle script was executed.
- Production dependencies must be version-pinned and installed from a reviewed lockfile. Avoid unversioned `npx` package execution.
- Remotion's browser download and Python model download are one-time network operations; the final project must use local paths thereafter.
- Development servers should bind to localhost on the user's PC. No cloud rendering, Lambda, MCP server or external API server is needed.
- The currently available sandbox FFmpeg static binary is old and configured with GPL/version-3 components. It is sufficient for inspecting user-supplied media here, but the Windows reproduction should install a current trusted FFmpeg build rather than redistribute that binary. FFmpeg tool licensing does not relicense the rendered video.

### Telemetry

- HyperFrames telemetry was verified in source and is one reason it is not selected.
- No PostHog/analytics indicator was found in the installed Remotion CLI/renderer paths during focused static search. This was not a live network-monitor test; optional Remotion cloud/web-renderer packages are outside the selected architecture.
- Faster Whisper's Hugging Face dependency may download models when given a model name. The production transcription script will use a local model directory, so audio is not uploaded and inference makes no required network request.

## 5. Recommended technology stack

| Layer | Selected component | Why it materially improves this video | License / cost / network |
|---|---|---|---|
| Primary animation | **Remotion 4.0.540 + React 19.2.0 + TypeScript** | Deterministic frame rendering, precise word timing, responsive 9:16 and 16:9 compositions, editable source. Already proven in the existing workspace. | Remotion Free License covers individuals, nonprofits and for-profit organizations with up to 3 employees, including commercial video creation. Larger for-profit organizations need a Company License. No per-render API fee. |
| Motion and graphics | **Remotion spring/interpolate + original CSS/SVG** | Matches the reference's cards, active-line highlights, counters, arrows, masks and restrained movement without another runtime. | Project source is original. No external asset/API requirement. |
| Transcription | **Existing Faster Whisper 1.2.1 + local Whisper Small CTranslate2 model** | Local multilingual transcription and word timestamps without a Torch installation or audio upload. | Faster Whisper and CTranslate2 metadata: MIT. Whisper code/weights: MIT. Initial model acquisition requires network unless the model folder is copied locally. |
| Media processing | **Current FFmpeg + FFprobe on PATH** | Source probing, full-quality audio muxing, 48 kHz AAC, BT.709 H.264, loudness/black-frame QC. | Use a current trusted build. Binary license depends on build; rendered output is not relicensed. No paid API. |
| Fonts | **Inter + Space Grotesk** | Readable Roman Hinglish subtitles, bold educational headings and deterministic code/state typography. | Fontsource npm metadata: SIL OFL 1.1. Bundle font files locally; no runtime Google Fonts request. |
| Audio finishing | **Original voice only by default; optional original locally produced sound pass** | Keeps dialogue primary and avoids unlicensed music. No copied reference audio. | No stock music licensing requirement if no external music is added. |
| QC | **Local project scripts + FFprobe/FFmpeg + decoded contact sheets** | Actual checks for duration, codecs, sync, safe areas, subtitle line counts, black frames and peaks. | Offline after installation. |

### Explicitly excluded

- HyperFrames and HyperFrames Studio
- MotionClone and its ChatGPT frame-upload workflow
- ghost-editor and claude-shorts
- GSAP and all Three.js packs (not needed for this 2D reference)
- yt-dlp
- Stock B-roll, AI-generated voice, external TTS and paid media APIs
- Background music without a verified license

## 6. Installation approval required

Approval is requested for the following **project dependencies only**, if they are not already available on the target Windows PC:

1. Pinned Remotion/React/TypeScript/font npm dependencies from the delivered lockfile.
2. Remotion's local headless browser download.
3. Current FFmpeg/FFmpeg-compatible FFprobe if not already installed.
4. Python 3.11 + Faster Whisper only if transcription must be reproduced instead of using the delivered timing files.
5. Whisper Small model weights, downloaded once or copied into a local model directory.

**No approval is requested for MotionClone, HyperFrames, Gemini, ChatGPT, ElevenLabs, stock media subscriptions or any paid video API.**

## 7. Exact PowerShell installation commands

These commands are presented for approval and **were not executed on the user's PC**. Run prerequisite installs only when the corresponding tool is missing.

```powershell
# 1. Open the source repository and verify the expected source commit.
Set-Location 'C:\Users\sudha\Downloads\voice'
git fetch origin main
git rev-parse origin/main
# Expected: 993b4bedbb078988a25a9213cede66718a9a1b28

# 2. Check existing prerequisites. Node 22+, FFmpeg and Python 3.11 are recommended.
node --version
npm --version
ffmpeg -version
ffprobe -version
py -3.11 --version

# 3. ONLY IF MISSING: install current mainstream prerequisites.
winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
winget install --id Gyan.FFmpeg --exact --accept-package-agreements --accept-source-agreements
winget install --id Python.Python.3.11 --exact --accept-package-agreements --accept-source-agreements

# Close and reopen PowerShell after prerequisite installation, then return here:
Set-Location 'C:\Users\sudha\Downloads\voice\AI-Video-Workflow\project'

# 4. After the editable project and package-lock.json are delivered:
# Install only pinned, reviewed project dependencies.
npm ci

# 5. Download Remotion's local browser once, without invoking an unpinned package.
npx --no-install remotion browser ensure

# 6. OPTIONAL: reproduce transcription. Not needed to render delivered timing files.
Set-Location 'C:\Users\sudha\Downloads\voice\AI-Video-Workflow'
py -3.11 -m venv .venv
& '.\.venv\Scripts\python.exe' -m pip install --upgrade pip
& '.\.venv\Scripts\python.exe' -m pip install faster-whisper==1.2.1
# The transcription script will use a local Whisper Small directory.
# If weights are not already cached, their first acquisition requires internet access.

# 7. Verify that the project audio still matches the committed source.
$expectedLine = git ls-tree origin/main -- '1104 (1)(2).MP3'
$expectedBlob = @($expectedLine -split '\s+')[2]
$actualBlob = git hash-object '.\assets\audio\1104 (1)(2).MP3'
if ($actualBlob -ne $expectedBlob) { throw 'Audio does not match the GitHub source.' }
Get-FileHash -Algorithm SHA256 '.\assets\audio\1104 (1)(2).MP3'
# Expected SHA-256: b3f32f124211e2df597f06553d09555ccc6d79a6df07f795f4444267f4aab5a7

# 8. Planned render and verification commands, available after project creation:
Set-Location '.\project'
npm run typecheck
npm run preview
npm run render:vertical
npm run render:horizontal
npm run qc
```

For reproduction, use the delivered `project/package-lock.json` with `npm ci`; do not reconstruct the project from an unpinned or partial empty-folder dependency list. The final lockfile includes the actual renderer, browser, media, and font dependencies used by the delivered scripts.

## 8. Paid APIs and license requirements

- **Required paid media APIs:** none.
- **Required AI voice/video generation accounts:** none.
- **Claude Code:** not required to play or render the delivered source; using an AI coding agent may have its own subscription cost.
- **Remotion:** free commercial video creation for eligible individuals, nonprofits and for-profit organizations with up to 3 employees. Other for-profit organizations must check/purchase the Company License at `remotion.pro`.
- **Whisper:** MIT; model download is not an API charge.
- **Fonts:** SIL OFL 1.1.
- **Music:** none supplied or selected. No unlicensed track will be added.
- **Reference footage:** style analysis only. Its logo, mascot, audio, code sequence and footage will not be reused as final content.
