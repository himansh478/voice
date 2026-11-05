import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;
export const f = (seconds: number) => seconds * FPS;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ramp = (frame: number, start: number, end: number, from = 0, to = 1) =>
  interpolate(frame, [f(start), f(end)], [from, to], {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)});

export const linear = (frame: number, start: number, end: number, from = 0, to = 1) =>
  interpolate(frame, [f(start), f(end)], [from, to], clamp);

export const springIn = (frame: number, start = 0, duration = 0.8) =>
  spring({frame: frame - f(start), fps: FPS, durationInFrames: Math.round(f(duration)), config: {damping: 18, stiffness: 150, mass: 0.75}});

export const revealY = (frame: number, start = 0, distance = 70) => ({
  opacity: ramp(frame, start, start + 0.45),
  transform: `translateY(${(1 - springIn(frame, start)) * distance}px)`,
});

export const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
