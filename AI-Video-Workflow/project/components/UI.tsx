import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font, isVertical} from '../config/design';
import {enter, sceneOpacity} from '../animations/motion';

export const SceneShell: React.FC<{
  id: string;
  title: string;
  duration: number;
  children: React.ReactNode;
}> = ({id, title, duration, children}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const opacity = sceneOpacity(frame, duration);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', top: vertical ? 52 : 38, left: vertical ? 64 : 72, right: vertical ? 64 : 72, ...enter(frame, fps, 0, 10)}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: C.muted, fontFamily: font.body, fontSize: vertical ? 17 : 14, fontWeight: 600, letterSpacing: vertical ? 3 : 2.4}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <span style={{width: 30, height: 3, background: C.amber, borderRadius: 4}} />
            <span>{id} / PYTHON</span>
          </div>
          <span>DATA TYPES</span>
        </div>
        <div style={{marginTop: vertical ? 28 : 20, color: C.ink, fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 60 : 46, lineHeight: 1.02, letterSpacing: vertical ? -2.2 : -1.4}}>{title}</div>
      </div>
      {children}
    </div>
  );
};

export const WindowCard: React.FC<{
  active?: boolean;
  scan?: number;
  style?: React.CSSProperties;
  compact?: boolean;
}> = ({active = true, scan, style, compact = false}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{
      position: 'relative', width: vertical ? 860 : 760, maxWidth: '100%',
      height: compact ? (vertical ? 230 : 190) : (vertical ? 310 : 250),
      borderRadius: vertical ? 28 : 22, background: C.paper,
      border: `1px solid ${C.faint}`, boxShadow: '0 18px 50px rgba(62,52,29,.10), 0 2px 5px rgba(62,52,29,.07)',
      overflow: 'hidden', ...style,
    }}>
      <div style={{height: vertical ? 66 : 50, background: '#F4F2EB', borderBottom: `1px solid ${C.faint}`, display: 'flex', alignItems: 'center', padding: `0 ${vertical ? 28 : 22}px`}}>
        <div style={{display: 'flex', gap: vertical ? 10 : 8}}>
          {[C.red, C.amber, C.green].map((color) => <span key={color} style={{width: vertical ? 13 : 10, height: vertical ? 13 : 10, borderRadius: '50%', background: color, opacity: .85}} />)}
        </div>
        <span style={{margin: 'auto', transform: 'translateX(-24px)', color: C.muted, fontFamily: font.body, fontSize: vertical ? 21 : 16, fontWeight: 500}}>data_types.py</span>
      </div>
      <div style={{position: 'absolute', left: vertical ? 28 : 22, right: vertical ? 28 : 22, top: vertical ? 96 : 72, height: vertical ? 92 : 70, borderRadius: vertical ? 18 : 14, background: active ? C.amberSoft : '#F7F6F1', opacity: active ? 1 : .55}} />
      <div style={{position: 'absolute', left: vertical ? 56 : 42, top: vertical ? 112 : 84, display: 'flex', alignItems: 'center', gap: vertical ? 24 : 18, fontFamily: font.heading, fontSize: vertical ? 45 : 35, fontWeight: 600, letterSpacing: .2}}>
        <span style={{color: C.amberDark}}>variable</span>
        <span style={{color: C.muted}}>=</span>
        <span style={{color: C.green}}>data</span>
      </div>
      <div style={{position: 'absolute', left: vertical ? 56 : 42, bottom: vertical ? 36 : 26, display: 'flex', alignItems: 'center', gap: 12, color: C.muted, fontSize: vertical ? 18 : 14, letterSpacing: 2, fontWeight: 600}}>
        <span style={{width: vertical ? 38 : 28, height: 2, background: C.amber}} />
        <span>VALUE / STORAGE</span>
      </div>
      {scan === undefined ? null : (
        <div style={{position: 'absolute', top: vertical ? 80 : 62, bottom: vertical ? 24 : 18, left: `${28 + scan * 78}%`, width: vertical ? 5 : 4, borderRadius: 6, background: C.amber, boxShadow: `0 0 24px ${C.amber}`, opacity: scan > 0 && scan < 1 ? 1 : 0}} />
      )}
    </div>
  );
};

export const ResultPanel: React.FC<{
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({label, children, style, accent = C.green}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{
      width: vertical ? 860 : 760, maxWidth: '100%', minHeight: vertical ? 170 : 126,
      borderRadius: vertical ? 26 : 20, background: C.output, color: C.outputText,
      padding: vertical ? '26px 34px' : '20px 28px', boxShadow: '0 16px 38px rgba(45,45,49,.15)', ...style,
    }}>
      <div style={{color: '#A4A3A8', fontSize: vertical ? 18 : 14, fontWeight: 600, letterSpacing: vertical ? 3 : 2.4}}>{label}</div>
      <div style={{marginTop: vertical ? 20 : 14, display: 'flex', alignItems: 'center', gap: vertical ? 20 : 16, fontFamily: font.heading, fontSize: vertical ? 38 : 29, fontWeight: 600, color: accent}}>{children}</div>
    </div>
  );
};

export const CheckMark: React.FC<{size?: number; color?: string}> = ({size = 34, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="3" opacity=".45" />
    <path d="M11 20.5L17 26.5L29.5 13.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TypeIcon: React.FC<{type: string; size?: number}> = ({type, size = 70}) => {
  const common = {width: size, height: size, viewBox: '0 0 80 80', fill: 'none', 'aria-hidden': true} as const;
  if (type === 'INTEGER') return <svg {...common}><path d="M20 58V36M40 58V20M60 58V29" stroke={C.blue} strokeWidth="8" strokeLinecap="round" /><path d="M15 63H65" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity=".3" /></svg>;
  if (type === 'FLOAT') return <svg {...common}><circle cx="24" cy="31" r="12" stroke={C.blue} strokeWidth="6" /><circle cx="56" cy="49" r="12" stroke={C.blue} strokeWidth="6" /><circle cx="40" cy="40" r="4" fill={C.amber} /><path d="M14 66H66" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity=".3" /></svg>;
  if (type === 'STRING') return <svg {...common}><path d="M27 20C15 26 13 35 17 43C20 49 28 47 30 41C33 32 26 29 20 32M57 20C45 26 43 35 47 43C50 49 58 47 60 41C63 32 56 29 50 32" stroke={C.green} strokeWidth="6" strokeLinecap="round" /><path d="M22 61H58" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity=".3" /></svg>;
  return <svg {...common}><rect x="12" y="25" width="56" height="32" rx="16" stroke={C.green} strokeWidth="6" /><circle cx="50" cy="41" r="10" fill={C.amber} /><path d="M22 66H58" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity=".3" /></svg>;
};

export const TypeCard: React.FC<{
  name: string;
  active?: boolean;
  muted?: boolean;
  style?: React.CSSProperties;
}> = ({name, active = false, muted = false, style}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const tint = name === 'INTEGER' || name === 'FLOAT' ? C.blue : C.green;
  return (
    <div style={{
      position: 'relative', width: vertical ? 400 : 330, height: vertical ? 250 : 230,
      borderRadius: vertical ? 28 : 22, background: C.paper,
      border: `${active ? 4 : 2}px solid ${active ? C.amber : muted ? C.faint : tint}`,
      boxShadow: active ? '0 18px 45px rgba(242,158,18,.17)' : '0 10px 32px rgba(62,52,29,.07)',
      opacity: muted ? .58 : 1, padding: vertical ? 28 : 22, ...style,
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <TypeIcon type={name} size={vertical ? 76 : 62} />
        <span style={{width: 14, height: 14, borderRadius: '50%', background: active ? C.amber : C.faint, marginTop: 8}} />
      </div>
      <div style={{marginTop: vertical ? 26 : 18, color: C.ink, fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 34 : 27, letterSpacing: -.5}}>{name}</div>
      <div style={{marginTop: 8, height: 4, width: active ? '72%' : '28%', borderRadius: 4, background: active ? C.amber : tint, opacity: active ? 1 : .45, transition: 'width .2s linear'}} />
    </div>
  );
};

export const Chip: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.amber, style}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: vertical ? 62 : 48, padding: vertical ? '0 26px' : '0 20px', borderRadius: 14, background: color === C.amber ? C.amberSoft : color === C.green ? C.greenSoft : C.blueSoft, border: `2px solid ${color}`, color: C.ink, fontFamily: font.heading, fontSize: vertical ? 28 : 22, fontWeight: 600, letterSpacing: .5, ...style}}>{children}</span>;
};
