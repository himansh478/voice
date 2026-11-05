import {interpolate, spring} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const enter = (frame: number, fps: number, delay = 0, duration = 12) => {
  const value = spring({frame: frame - delay, fps, durationInFrames: duration, config: {damping: 180, stiffness: 120, mass: 0.8}});
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * 28}px) scale(${0.985 + value * 0.015})`,
  };
};

export const fade = (frame: number, start: number, end: number) => interpolate(frame, [start, end], [0, 1], clamp);

export const sceneOpacity = (frame: number, duration: number) => interpolate(frame, [0, 7, duration - 8, duration - 1], [0, 1, 1, 0], clamp);

export const drawLine = (frame: number, start: number, length = 16) => interpolate(frame, [start, start + length], [0, 1], clamp);
