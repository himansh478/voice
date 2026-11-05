import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font, isVertical} from '../config/design';
import {sceneOpacity} from '../animations/motion';

export const SceneShell: React.FC<{id: string; title: string; duration: number; children: React.ReactNode}> = ({id, title, duration, children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(frame, duration)}}>
      <div style={{position: 'absolute', top: vertical ? 54 : 38, left: vertical ? 58 : 64, right: vertical ? 58 : 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: C.muted, fontSize: vertical ? 17 : 14, fontWeight: 600, letterSpacing: 3}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 14}}><span style={{width: 30, height: 3, background: C.green, boxShadow: `0 0 16px ${C.green}`}} />{id} // PYTHON</span>
        <span style={{color: C.blue}}>DATA TYPES</span>
      </div>
      <div style={{position: 'absolute', top: vertical ? 112 : 86, left: vertical ? 58 : 64, color: C.ink, fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 54 : 43, letterSpacing: -2}}>{title}</div>
      <div style={{position: 'absolute', top: vertical ? 116 : 91, left: vertical ? 54 : 60, width: 3, height: vertical ? 48 : 38, background: C.amber}} />
      {children}
      <div style={{position: 'absolute', left: vertical ? 58 : 64, right: vertical ? 58 : 64, bottom: vertical ? 36 : 24, height: 2, background: C.faint}}>
        <div style={{width: `${Math.min(100, (frame / Math.max(1, duration - 1)) * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
      </div>
    </div>
  );
};

export const Pill: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.blue, style}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, padding: '0 20px', border: `1px solid ${color}`, borderRadius: 8, color, background: `${color}12`, fontFamily: font.heading, fontSize: 20, fontWeight: 600, letterSpacing: 1.5, ...style}}>{children}</span>
);

export const DataCore: React.FC<{scan?: number}> = ({scan = 0}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const w = vertical ? 880 : 790;
  const h = vertical ? 320 : 280;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 22, border: `1px solid ${C.faint}`, background: 'linear-gradient(145deg, #17243B 0%, #111A2C 70%)', boxShadow: '0 24px 80px rgba(0,0,0,.28)', overflow: 'hidden'}}>
      <div style={{height: vertical ? 68 : 58, padding: `0 ${vertical ? 30 : 26}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.faint}`, color: C.muted, fontSize: vertical ? 17 : 14, letterSpacing: 2.5}}>
        <span>MEMORY // VARIABLE</span><span style={{color: C.green}}>● READY</span>
      </div>
      <div style={{position: 'absolute', left: vertical ? 42 : 36, top: vertical ? 116 : 100, display: 'flex', alignItems: 'center', gap: vertical ? 28 : 24}}>
        <span style={{fontFamily: font.heading, fontWeight: 600, fontSize: vertical ? 58 : 48, color: C.ink, letterSpacing: -2}}>variable</span>
        <span style={{fontSize: vertical ? 46 : 38, color: C.muted}}>←</span>
        <span style={{padding: vertical ? '16px 25px' : '12px 21px', background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: 10, color: C.blue, fontFamily: font.heading, fontWeight: 600, fontSize: vertical ? 42 : 35}}>data</span>
      </div>
      <div style={{position: 'absolute', left: vertical ? 42 : 36, bottom: vertical ? 34 : 28, display: 'flex', alignItems: 'center', gap: 14, color: C.muted, fontSize: vertical ? 16 : 13, letterSpacing: 2}}><span style={{width: 48, height: 2, background: C.amber}} /> STORAGE / VALUE / TYPE</div>
      {scan > 0 && scan < 1 ? <div style={{position: 'absolute', top: 0, bottom: 0, left: `${scan * 100}%`, width: 3, background: C.green, boxShadow: `0 0 26px 5px ${C.green}`, opacity: .85}} /> : null}
      <div style={{position: 'absolute', right: 0, top: vertical ? 68 : 58, width: 5, height: `calc(100% - ${vertical ? 68 : 58}px)`, background: `linear-gradient(${C.blue}, ${C.green})`, opacity: .65}} />
    </div>
  );
};

const TypeIcon: React.FC<{name: string; color: string; size: number}> = ({name, color, size}) => {
  if (name === 'STRING') return <svg width={size} height={size} viewBox="0 0 64 64"><path d="M18 12L10 52M54 12L46 52M8 25H56M4 41H52" stroke={color} strokeWidth="4" strokeLinecap="round" /><path d="M23 20L39 44" stroke={color} strokeWidth="4" /></svg>;
  if (name === 'BOOLEAN') return <svg width={size} height={size} viewBox="0 0 64 64"><rect x="5" y="20" width="54" height="24" rx="12" stroke={color} strokeWidth="4" /><circle cx="45" cy="32" r="8" fill={color} /></svg>;
  if (name === 'FLOAT') return <svg width={size} height={size} viewBox="0 0 64 64"><path d="M6 38C15 16 25 16 33 38C41 58 50 54 58 28" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" /><circle cx="33" cy="38" r="5" fill={color} /></svg>;
  return <svg width={size} height={size} viewBox="0 0 64 64"><path d="M14 48V30M32 48V12M50 48V22" stroke={color} strokeWidth="5" strokeLinecap="round" /><path d="M8 54H56" stroke={color} strokeWidth="3" strokeLinecap="round" /></svg>;
};

export const TypeTile: React.FC<{name: string; index: number; active?: boolean; muted?: boolean; wide?: boolean}> = ({name, index, active = false, muted = false, wide = false}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const color = active ? C.amber : name === 'FLOAT' ? C.blue : C.green;
  return (
    <div style={{position: 'relative', width: wide ? 880 : vertical ? 400 : 330, height: wide ? 210 : vertical ? 230 : 250, padding: vertical ? 26 : 25, borderRadius: 18, border: `1px solid ${active ? C.amber : C.faint}`, background: active ? 'linear-gradient(145deg, #263047, #17243B)' : C.paper, boxShadow: active ? '0 18px 60px rgba(255,187,85,.12)' : '0 14px 40px rgba(0,0,0,.16)', opacity: muted ? .43 : 1, overflow: 'hidden'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <TypeIcon name={name} color={color} size={vertical ? 62 : 58} />
        <span style={{fontFamily: font.heading, fontSize: vertical ? 46 : 42, lineHeight: 1, fontWeight: 600, color: active ? C.amber : C.faint}}>{String(index).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'absolute', left: wide ? 140 : vertical ? 26 : 25, bottom: wide ? 66 : vertical ? 32 : 34}}>
        <div style={{fontFamily: font.heading, fontSize: vertical ? 25 : 22, fontWeight: 600, letterSpacing: 1, color: active ? C.ink : C.muted}}>{name}</div>
        <div style={{marginTop: 12, width: active ? 140 : 64, height: 3, background: color, transition: 'width 100ms linear'}} />
      </div>
      <div style={{position: 'absolute', right: 0, top: 0, width: 6, height: '100%', background: active ? C.amber : 'transparent'}} />
    </div>
  );
};

export const StatusPanel: React.FC<{label: string; children: React.ReactNode; accent?: string}> = ({label, children, accent = C.green}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{position: 'relative', width: vertical ? 880 : 790, minHeight: vertical ? 170 : 140, padding: vertical ? '30px 34px' : '24px 30px', border: `1px solid ${C.faint}`, borderLeft: `5px solid ${accent}`, borderRadius: 16, background: C.output, boxShadow: '0 18px 60px rgba(0,0,0,.24)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{color: C.muted, fontSize: vertical ? 15 : 12, letterSpacing: 2.5, marginBottom: vertical ? 18 : 14}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: vertical ? 20 : 17, flexWrap: 'wrap', color: C.ink, fontFamily: font.heading, fontSize: vertical ? 32 : 27, fontWeight: 600}}>{children}</div>
    </div>
  );
};

export const Check: React.FC<{color?: string}> = ({color = C.green}) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="15" stroke={color} strokeWidth="2" /><path d="M10 17L15 22L24 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
