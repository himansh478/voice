import React from 'react';
import {Composition} from 'remotion';
import {PythonStory} from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PythonStory"
        component={PythonStory}
        durationInFrames={1567}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
