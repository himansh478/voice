import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font} from '../config/design';
import {Subtitles} from '../components/Subtitles';
import {AutomaticScene, IntroScene, NumericTypesScene, SymbolScene, TextLogicTypesScene, VariableScene} from '../components/Scenes';
import rawTiming from './data/timing.json';
import type {SceneDefinition, TimingData} from './types';

const timing = rawTiming as TimingData;

const SceneComponent: React.FC<{scene: SceneDefinition; start: number; duration: number}> = ({scene, start, duration}) => {
  switch (scene.id) {
    case 'S01': return <IntroScene start={start} duration={duration} />;
    case 'S02': return <VariableScene start={start} duration={duration} />;
    case 'S03': return <NumericTypesScene start={start} duration={duration} />;
    case 'S04': return <TextLogicTypesScene start={start} duration={duration} />;
    case 'S05': return <SymbolScene start={start} duration={duration} />;
    default: return <AutomaticScene start={start} duration={duration} />;
  }
};

export const VoiceVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  return (
    <AbsoluteFill style={{background: C.canvas, fontFamily: font.body, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 18% 12%, #172B45 0%, #0B1020 48%, #080D18 100%)'}} />
      <AbsoluteFill style={{opacity: .34, backgroundImage: 'linear-gradient(#28375138 1px, transparent 1px), linear-gradient(90deg, #28375138 1px, transparent 1px)', backgroundSize: '56px 56px'}} />
      <div style={{position: 'absolute', width: 560, height: 560, right: -240, top: -220, borderRadius: '50%', border: `1px solid ${C.blue}22`, boxShadow: `0 0 120px ${C.blue}0C`}} />
      {timing.scenes.map((scene, index) => {
        const startFrame = Math.round(scene.start * fps);
        const endFrame = index === timing.scenes.length - 1 ? timing.durationInFrames : Math.round(timing.scenes[index + 1].start * fps);
        const duration = endFrame - startFrame;
        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={duration}>
            <SceneComponent scene={scene} start={scene.start} duration={duration} />
          </Sequence>
        );
      })}
      <Subtitles time={time} captions={timing.captions} />
      <Audio src={staticFile('1104 (1)(2).MP3')} />
    </AbsoluteFill>
  );
};
