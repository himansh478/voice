import React from 'react';
import {useVideoConfig} from 'remotion';
import {C, font, isVertical} from '../config/design';
import {clamp} from '../animations/motion';
import type {Caption} from '../src/types';
import {interpolate} from 'remotion';

export const Subtitles: React.FC<{time: number; captions: Caption[]}> = ({time, captions}) => {
  const {width, height, fps} = useVideoConfig();
  const vertical = isVertical(width, height);
  const caption = captions.find((item) => time >= item.start && time < item.end);
  if (!caption) return null;
  const opacity = caption.id === 1 ? 1 : Math.min(
    interpolate(time, [caption.start, caption.start + 3 / fps], [0, 1], clamp),
    interpolate(time, [caption.end - 3 / fps, caption.end], [1, 0], clamp),
  );
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: vertical ? 220 : 58,
      transform: `translateX(-50%) translateY(${(1 - opacity) * 10}px)`,
      width: 'max-content', maxWidth: vertical ? 930 : 1250, opacity,
      background: 'rgba(45,45,49,.97)', color: C.outputText,
      border: `1px solid rgba(255,255,255,.12)`, borderRadius: vertical ? 26 : 18,
      padding: vertical ? '22px 32px' : '14px 26px',
      boxShadow: '0 14px 36px rgba(45,45,49,.16)',
      fontFamily: font.body, fontSize: vertical ? 44 : 34, fontWeight: 600,
      lineHeight: vertical ? 1.34 : 1.28, textAlign: 'center', letterSpacing: -.6,
      zIndex: 20,
    }}>
      <div style={{display: 'inline-block', textAlign: 'center'}}>
        {caption.words.map((word, index) => {
          const active = time >= word.start && time < word.end;
          const spokenKeyword = word.keyword && time >= word.end;
          return (
            <React.Fragment key={word.id}>
              <span style={{
                display: 'inline-block', margin: vertical ? '0 4px' : '0 3px',
                padding: vertical ? '0 5px' : '0 4px',
                borderRadius: vertical ? 9 : 6,
                background: active ? C.amber : 'transparent',
                color: active ? C.ink : spokenKeyword ? '#F6B73E' : C.outputText,
                fontWeight: active || spokenKeyword ? 700 : 600,
                transform: active ? 'scale(1.035)' : 'scale(1)',
              }}>{word.text}</span>
              {caption.breakAfter.includes(index) ? <br /> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, top: vertical ? 24 : 16, bottom: vertical ? 24 : 16, width: vertical ? 4 : 3, borderRadius: 4, background: C.amber}} />
    </div>
  );
};
