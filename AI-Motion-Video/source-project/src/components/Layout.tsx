import React, {createContext, useContext} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, springIn} from '../motion';

export const C = {
  ink: '#070914', navy: '#0b1022', panel: '#11182b', ivory: '#f4f1e8',
  lime: '#d7ff4f', cyan: '#55dfff', blue: '#4b7bec', yellow: '#ffc857',
  red: '#e45766', violet: '#ae83ff', muted: '#8b94ac', brass: '#c89b5a',
};

type SceneContextValue = {index: number; id: string; duration: number; accent: string};
const SceneContext = createContext<SceneContextValue>({index: 0, id: 'S01', duration: 90, accent: C.lime});
export const useScene = () => useContext(SceneContext);

export const SceneWrapper: React.FC<{
  index: number; id: string; title: string; duration: number; accent?: string;
  background?: string; children: React.ReactNode;
}> = ({index, id, title, duration, accent = C.lime, background = C.ink, children}) => {
  const frame = useCurrentFrame();
  const enter = index === 0 ? 1 : springIn(frame, 0, 0.45);
  const exit = ramp(frame, duration / 30 - 0.18, duration / 30, 1, 0.94);
  const push = 1 + ramp(frame, 0, duration / 30, 0, 0.018);
  return (
    <SceneContext.Provider value={{index, id, duration, accent}}>
      <AbsoluteFill style={{background, overflow: 'hidden'}}>
        <AbsoluteFill style={{
          opacity: 0.32,
          backgroundImage: `linear-gradient(${accent}12 1px, transparent 1px), linear-gradient(90deg, ${accent}12 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          transform: `perspective(900px) rotateX(62deg) translateY(${520 - frame * 0.18}px) scale(1.65)`,
          transformOrigin: '50% 100%',
        }} />
        <AbsoluteFill style={{
          clipPath: index === 0 ? undefined : `inset(${(1 - enter) * 100}% 0 0 0)`,
          opacity: exit,
          transform: `scale(${push * (0.985 + enter * 0.015)})`,
        }}>
          {children}
        </AbsoluteFill>
        <div style={{position: 'absolute', top: 64, left: 68, right: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <span style={{width: 34, height: 5, background: accent, borderRadius: 4}} />
            <span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: C.ivory}}>{id} / {title.toUpperCase()}</span>
          </div>
          <span style={{fontSize: 18, fontWeight: 600, letterSpacing: 3, color: C.muted}}>PY / ORIGIN</span>
        </div>
        <div style={{position: 'absolute', left: 68, bottom: 82, fontSize: 16, letterSpacing: 4, color: '#6f7891', zIndex: 20}}>THE NAME BEHIND THE LANGUAGE</div>
      </AbsoluteFill>
    </SceneContext.Provider>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.lime, style}) => (
  <div style={{fontSize: 22, lineHeight: 1.2, letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, color, ...style}}>{children}</div>
);

export const Reveal: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties; distance?: number}> = ({at = 0, children, style, distance = 60}) => {
  const frame = useCurrentFrame();
  const p = springIn(frame, at, 0.72);
  return <div style={{opacity: ramp(frame, at, at + 0.3), transform: `translateY(${(1 - p) * distance}px)`, ...style}}>{children}</div>;
};

export const MaskLine: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at = 0, children, style}) => {
  const frame = useCurrentFrame();
  const p = springIn(frame, at, 0.72);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 10, ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 112}%)`, opacity: ramp(frame, at, at + 0.2)}}>{children}</div>
    </div>
  );
};
