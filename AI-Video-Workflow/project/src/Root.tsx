import React from 'react';
import {Composition} from 'remotion';
import {VoiceVideo} from './Video';
import timing from './data/timing.json';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="VoiceVideo9x16"
      component={VoiceVideo}
      durationInFrames={timing.durationInFrames}
      fps={timing.fps}
      width={1080}
      height={1920}
    />
    <Composition
      id="VoiceVideo16x9"
      component={VoiceVideo}
      durationInFrames={timing.durationInFrames}
      fps={timing.fps}
      width={1920}
      height={1080}
    />
  </>
);
