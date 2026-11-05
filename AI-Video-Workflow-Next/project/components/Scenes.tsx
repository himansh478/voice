import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font, isVertical} from '../config/design';
import {clamp, enter} from '../animations/motion';
import {Check, DataCore, Pill, SceneShell, StatusPanel, TypeTile} from './UI';

type SceneProps = {start: number; duration: number};

const entryAt = (frame: number, fps: number, delay: number, base = '') => {
  const animation = enter(frame, fps, delay, 12);
  return {...animation, transform: `${base} ${animation.transform ?? ''}`.trim()};
};

const Orbit: React.FC<{frame: number; duration: number}> = ({frame, duration}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const rotation = interpolate(frame, [0, duration - 1], [-18, 24], clamp);
  const pulse = 1 + Math.sin(frame / 5) * .012;
  return (
    <div style={{position: 'relative', width: vertical ? 700 : 620, height: vertical ? 600 : 540, transform: `scale(${pulse})`}}>
      <svg viewBox="0 0 700 600" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <g transform={`rotate(${rotation} 350 300)`}>
          <circle cx="350" cy="300" r="224" stroke={C.faint} strokeWidth="2" strokeDasharray="5 12" fill="none" />
          <path d="M153 156A224 224 0 0 1 516 143" stroke={C.blue} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M547 444A224 224 0 0 1 184 457" stroke={C.green} strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="153" cy="156" r="13" fill={C.blue} /><circle cx="516" cy="143" r="8" fill={C.amber} />
          <circle cx="547" cy="444" r="13" fill={C.green} /><circle cx="184" cy="457" r="8" fill={C.amber} />
        </g>
        <circle cx="350" cy="300" r="154" stroke={C.faint} strokeWidth="2" fill="#111A2C" />
        <path d="M220 300H480" stroke={C.faint} strokeWidth="2" strokeDasharray="4 8" />
      </svg>
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
        <div style={{color: C.muted, fontSize: vertical ? 17 : 14, letterSpacing: 4, marginBottom: 18}}>STORE / UNDERSTAND</div>
        <div style={{fontFamily: font.heading, fontSize: vertical ? 53 : 45, color: C.ink, fontWeight: 600}}>variable</div>
        <div style={{margin: '22px auto 0', width: 80, height: 3, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
      </div>
      <Pill color={C.blue} style={{position: 'absolute', left: vertical ? 48 : 38, top: vertical ? 82 : 70}}>DATA</Pill>
      <Pill color={C.green} style={{position: 'absolute', right: vertical ? 36 : 30, bottom: vertical ? 76 : 64}}>TYPE</Pill>
    </div>
  );
};

export const IntroScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const opacity = interpolate(frame, [duration - 5, duration - 1], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', top: vertical ? 58 : 42, left: vertical ? 58 : 64, color: C.muted, fontSize: vertical ? 17 : 14, letterSpacing: 3}}><span style={{color: C.green}}>S01</span> // PYTHON / DATA MODEL</div>
      <div style={{position: 'absolute', top: vertical ? 180 : 185, left: vertical ? 50 : 82, right: vertical ? 50 : 'auto', width: vertical ? 'auto' : 720, textAlign: vertical ? 'center' : 'left', ...enter(frame, fps, -4, 12)}}>
        <div style={{fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 142 : 112, lineHeight: .9, letterSpacing: vertical ? -7 : -5, color: C.ink}}>DATA</div>
        <div style={{fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 142 : 112, lineHeight: .95, letterSpacing: vertical ? -7 : -5, color: C.blue, textShadow: '0 0 44px rgba(104,200,255,.16)'}}>TYPES</div>
        <div style={{marginTop: vertical ? 30 : 24, color: C.muted, fontSize: vertical ? 19 : 16, letterSpacing: vertical ? 4 : 3}}>VARIABLE → DATA → TYPE</div>
      </div>
      <div style={{position: 'absolute', top: vertical ? 590 : 170, left: vertical ? '50%' : 1080, ...entryAt(frame, fps, 3, vertical ? 'translateX(-50%)' : '')}}><Orbit frame={frame} duration={duration} /></div>
    </div>
  );
};

const FlowRail: React.FC<{frame: number}> = ({frame}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const nodes = [['01', 'DATA', C.blue], ['02', 'VARIABLE', C.amber], ['03', 'TYPE', C.green]] as const;
  return (
    <div style={{display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: vertical ? 18 : 12}}>
      {nodes.map(([number, label, color], index) => (
        <React.Fragment key={label}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(frame, [5 + index * 4, 11 + index * 4], [0, 1], clamp)}}>
            <span style={{color: C.faint, fontFamily: font.heading, fontSize: 30}}>{number}</span>
            <Pill color={color} style={{minWidth: vertical ? undefined : 230}}>{label}</Pill>
          </div>
          {index < 2 ? <span style={{color: C.muted, fontSize: 30, transform: vertical ? undefined : 'rotate(90deg)'}}>→</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export const VariableScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <SceneShell id="S02" title="WHAT CAN IT STORE?" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 290 : 235, left: vertical ? '50%' : 80, ...entryAt(frame, fps, 2, vertical ? 'translateX(-50%)' : '')}}><DataCore /></div>
      <div style={{position: 'absolute', top: vertical ? 710 : 615, left: vertical ? '50%' : 80, ...entryAt(frame, fps, 9, vertical ? 'translateX(-50%)' : '')}}>
        <StatusPanel label="RELATION // DATA STORAGE"><span style={{color: C.amber}}>VARIABLE</span><span style={{color: C.muted}}>stores</span><span style={{color: C.blue}}>DATA</span><Check /></StatusPanel>
      </div>
      <div style={{position: 'absolute', top: vertical ? 1040 : 250, left: vertical ? 0 : 1150, right: vertical ? 0 : 'auto'}}><FlowRail frame={frame} /></div>
    </SceneShell>
  );
};

export const NumericTypesScene: React.FC<SceneProps> = ({start, duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const t = start + frame / fps;
  const floatActive = t >= 5.34;
  return (
    <SceneShell id="S03" title="NUMERIC TYPES" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 290 : 280, left: 0, right: 0, display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: vertical ? 28 : 70}}>
        <div style={enter(frame, fps, 2, 12)}><TypeTile name="INTEGER" index={1} active={!floatActive} muted={floatActive} wide={vertical} /></div>
        <div style={enter(frame, fps, 10, 12)}><TypeTile name="FLOAT" index={2} active={floatActive} muted={!floatActive} wide={vertical} /></div>
      </div>
      <div style={{position: 'absolute', top: vertical ? 890 : 650, left: vertical ? '50%' : '50%', ...entryAt(frame, fps, 16, 'translateX(-50%)')}}>
        <StatusPanel label="TYPE SEQUENCE // 01 → 02" accent={floatActive ? C.blue : C.green}><span style={{color: floatActive ? C.muted : C.green}}>INTEGER</span><span style={{color: C.muted}}>/</span><span style={{color: floatActive ? C.blue : C.muted}}>FLOAT</span><Check color={C.blue} /></StatusPanel>
      </div>
    </SceneShell>
  );
};

export const TextLogicTypesScene: React.FC<SceneProps> = ({start, duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const t = start + frame / fps;
  const boolActive = t >= 7.92;
  const cards = ['INTEGER', 'FLOAT', 'STRING', 'BOOLEAN'];
  return (
    <SceneShell id="S04" title="TEXT + LOGIC" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 275 : 255, left: 0, right: 0, display: 'grid', gridTemplateColumns: vertical ? 'repeat(2, 400px)' : 'repeat(4, 330px)', justifyContent: 'center', gap: vertical ? 26 : 32}}>
        {cards.map((name, index) => {
          const current = name === 'STRING' ? !boolActive : name === 'BOOLEAN' ? boolActive : false;
          const prior = name === 'INTEGER' || name === 'FLOAT';
          return <div key={name} style={enter(frame, fps, 2 + index * 3, 11)}><TypeTile name={name} index={index + 1} active={current} muted={prior} /></div>;
        })}
      </div>
      <div style={{position: 'absolute', top: vertical ? 900 : 630, left: '50%', ...entryAt(frame, fps, 14, 'translateX(-50%)')}}>
        <StatusPanel label="TYPE STACK // 03 + 04"><span style={{color: boolActive ? C.muted : C.green}}>STRING</span><span style={{color: C.muted}}>+</span><span style={{color: boolActive ? C.amber : C.muted}}>BOOLEAN</span><Check /></StatusPanel>
      </div>
    </SceneShell>
  );
};

const SymbolModule: React.FC<{remove: number; result: number}> = ({remove, result}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const oldContent = interpolate(remove, [0, .28], [1, 0], clamp);
  const newContent = interpolate(result, [.35, .85], [0, 1], clamp);
  return (
    <div style={{position: 'relative', width: vertical ? 470 : 430, height: vertical ? 250 : 230}}>
      <div style={{position: 'absolute', inset: 0, border: `2px dashed ${C.red}`, borderRadius: 20, background: C.redSoft, opacity: 1 - remove, transform: `translateX(${remove * 150}px) rotate(${remove * 14}deg) scale(${1 - remove * .18})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontFamily: font.heading, color: C.ink, fontWeight: 600, fontSize: vertical ? 36 : 31, letterSpacing: 3, opacity: oldContent}}>SYMBOL</span>
        <svg width="190" height="90" viewBox="0 0 190 90" style={{opacity: oldContent}}><circle cx="55" cy="45" r="24" stroke={C.muted} strokeWidth="4" /><rect x="112" y="21" width="48" height="48" rx="7" stroke={C.muted} strokeWidth="4" /><path d="M20 80L170 8" stroke={C.red} strokeWidth="8" strokeLinecap="round" /></svg>
      </div>
      <div style={{position: 'absolute', inset: 0, border: `2px solid ${C.green}`, borderRadius: 20, background: C.greenSoft, opacity: result, transform: `scale(${.92 + result * .08})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 70px rgba(102,227,180,.12)'}}>
        <div style={{opacity: newContent, display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Check /><span style={{marginTop: 18, fontFamily: font.heading, color: C.green, fontWeight: 600, fontSize: vertical ? 32 : 27, letterSpacing: 2}}>NOT REQUIRED</span>
        <span style={{marginTop: 12, color: C.muted, fontSize: 14, letterSpacing: 3}}>SEPARATE SYMBOL</span></div>
      </div>
    </div>
  );
};

export const SymbolScene: React.FC<SceneProps> = ({start, duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const t = start + frame / fps;
  const remove = interpolate(t, [11.68, 12.45], [0, 1], clamp);
  const result = interpolate(t, [11.85, 12.35], [0, 1], clamp);
  return (
    <SceneShell id="S05" title="NO EXTRA SYMBOL" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 290 : 225, left: vertical ? '50%' : 80, ...entryAt(frame, fps, 2, vertical ? 'translateX(-50%)' : '')}}><DataCore /></div>
      <div style={{position: 'absolute', top: vertical ? 730 : 265, left: vertical ? '50%' : 1190, transform: vertical ? 'translateX(-50%)' : undefined}}><SymbolModule remove={remove} result={result} /></div>
      <div style={{position: 'absolute', top: vertical ? 1100 : 640, left: vertical ? '50%' : 80, opacity: result, transform: vertical ? 'translateX(-50%)' : undefined}}>
        <StatusPanel label="PYTHON // RESULT"><span style={{color: C.blue}}>DATA TYPE</span><span style={{color: C.muted}}>remains</span><Check /></StatusPanel>
      </div>
    </SceneShell>
  );
};

export const AutomaticScene: React.FC<SceneProps> = ({start, duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const t = start + frame / fps;
  const scan = interpolate(t, [13.85, 15.10], [0, 1], clamp);
  const result = interpolate(t, [14.90, 15.35], [0, 1], clamp);
  const types = interpolate(t, [15.40, 16.20], [0, 1], clamp);
  const chips = ['INTEGER', 'FLOAT', 'STRING', 'BOOLEAN'];
  return (
    <SceneShell id="S06" title="AUTOMATIC RECOGNITION" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 290 : 220, left: vertical ? '50%' : 80, ...entryAt(frame, fps, 2, vertical ? 'translateX(-50%)' : '')}}><DataCore scan={scan} /></div>
      <div style={{position: 'absolute', top: vertical ? 710 : 610, left: vertical ? '50%' : 80, opacity: result, transform: `${vertical ? 'translateX(-50%) ' : ''}translateY(${(1 - result) * 24}px)`}}>
        <StatusPanel label="ANALYSIS // COMPLETE"><span style={{color: C.blue}}>DATA TYPE</span><Check /><Pill color={C.green} style={{fontSize: vertical ? 20 : 17, minHeight: vertical ? 52 : 44}}>RECOGNIZED</Pill></StatusPanel>
      </div>
      <div style={{position: 'absolute', top: vertical ? 1050 : 260, left: vertical ? 0 : 1160, right: vertical ? 0 : 'auto', width: vertical ? 'auto' : 540, display: 'grid', gridTemplateColumns: vertical ? 'repeat(2, auto)' : 'repeat(2, auto)', justifyContent: 'center', gap: vertical ? 24 : 26, opacity: types, transform: `translateY(${(1 - types) * 24}px)`}}>
        {chips.map((name, index) => <Pill key={name} color={index < 2 ? C.blue : C.green} style={{minWidth: vertical ? 330 : 220, minHeight: vertical ? 76 : 64, fontSize: vertical ? 23 : 20}}>{name}</Pill>)}
      </div>
      <div style={{position: 'absolute', top: vertical ? 1280 : 500, left: vertical ? 0 : 1160, right: vertical ? 0 : 'auto', width: vertical ? 'auto' : 540, textAlign: 'center', color: C.muted, fontSize: vertical ? 17 : 14, letterSpacing: 3, opacity: types}}>AUTOMATIC / NO EXTRA SYMBOL</div>
    </SceneShell>
  );
};
