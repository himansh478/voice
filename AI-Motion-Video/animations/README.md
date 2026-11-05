# Animation System

The animation source is in `source-project/src/`.

- `motion.ts`: shared easing, spring, reveal and deterministic-random functions.
- `components/Layout.tsx`: scene camera, masking, labels and shared art direction.
- `components/Graphics.tsx`: animated SVG serpent, Python mark, network and infographics.
- `components/ThreeCore.tsx`: deterministic Three.js geometry, lights, particles and cameras.
- `scenes/`: all eleven scene-level choreography files.
- `Video.tsx`: master timeline, subtitles, transition sweeps, grain and vignette.

Every animated value is a pure function of the Remotion frame. There are no wall-clock animations, random per-render values, external GIFs or template presets. This makes frames reproducible and seeking reliable.
