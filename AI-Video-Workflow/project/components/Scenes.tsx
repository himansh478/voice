import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font, isVertical} from '../config/design';
import {clamp, enter, fade, sceneOpacity} from '../animations/motion';
import {CheckMark, Chip, ResultPanel, SceneShell, TypeCard, WindowCard} from './UI';

type SceneProps = {start: number; duration: number};

const entryAt = (frame: number, fps: number, delay: number, base = '') => {
  const animation = enter(frame, fps, delay, 12);
  return {...animation, transform: `${base} ${animation.transform ?? ''}`.trim()};
};

const Arrow: React.FC<{vertical?: boolean; color?: string}> = ({vertical = false, color = C.amber}) => (
  <svg width={vertical ? 52 : 76} height={vertical ? 76 : 52} viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <path d={vertical ? 'M40 12V64M40 64L27 51M40 64L53 51' : 'M12 40H64M64 40L51 27M64 40L51 53'} stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IntroScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const opacity = interpolate(frame, [duration - 8, duration - 1], [1, 0], clamp);
  const rotation = interpolate(frame, [0, duration - 1], [-8, 10], clamp);
  const diagram = (
    <div style={{position: 'relative', width: vertical ? 700 : 610, height: vertical ? 610 : 560}}>
      <svg viewBox="0 0 700 610" width="100%" height="100%" style={{position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`}}>
        <path d="M184 390C103 279 159 116 306 82C401 60 490 100 537 168" stroke={C.amber} strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M526 137L542 178L498 181" stroke={C.amber} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M516 224C595 337 535 494 390 527C296 549 207 508 163 440" stroke={C.amber} strokeWidth="18" strokeLinecap="round" fill="none" opacity=".72" />
        <path d="M174 471L157 430L202 427" stroke={C.amber} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".72" />
      </svg>
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: vertical ? 330 : 280, height: vertical ? 190 : 160, borderRadius: 34, background: C.paper, border: `3px solid ${C.ink}`, boxShadow: '0 20px 50px rgba(62,52,29,.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontFamily: font.heading, fontSize: vertical ? 42 : 34, fontWeight: 700, color: C.ink}}>VARIABLE</span>
        <span style={{marginTop: 14, width: 64, height: 4, background: C.amber, borderRadius: 4}} />
      </div>
      <Chip color={C.blue} style={{position: 'absolute', left: vertical ? 30 : 20, top: vertical ? 60 : 40}}>DATA</Chip>
      <Chip color={C.green} style={{position: 'absolute', right: vertical ? 20 : 10, bottom: vertical ? 54 : 42}}>TYPE</Chip>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', top: vertical ? 58 : 42, left: vertical ? 64 : 72, display: 'flex', alignItems: 'center', gap: 14, color: C.muted, fontSize: vertical ? 18 : 14, fontWeight: 600, letterSpacing: 3}}>
        <span style={{width: 30, height: 3, background: C.amber}} /> S01 / PYTHON
      </div>
      <div style={{position: 'absolute', top: vertical ? 190 : 190, left: vertical ? 50 : 90, right: vertical ? 50 : 'auto', width: vertical ? 'auto' : 650, textAlign: vertical ? 'center' : 'left', ...enter(frame, fps, -4, 12)}}>
        <div style={{fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 118 : 94, lineHeight: .92, letterSpacing: vertical ? -6 : -4, color: C.ink}}>DATA</div>
        <div style={{fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 118 : 94, lineHeight: .98, letterSpacing: vertical ? -6 : -4, color: C.amber}}>TYPES</div>
        <div style={{marginTop: vertical ? 34 : 26, color: C.muted, fontSize: vertical ? 22 : 17, fontWeight: 600, letterSpacing: vertical ? 4 : 3}}>VARIABLE / STORAGE / TYPE</div>
      </div>
      <div style={{position: 'absolute', top: vertical ? 610 : 170, left: vertical ? '50%' : 1030, ...entryAt(frame, fps, 5, vertical ? 'translateX(-50%)' : '')}}>{diagram}</div>
    </div>
  );
};

const RelationDiagram: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: vertical ? 20 : 12, ...enter(frame, fps, 13, 12)}}>
      <Chip color={C.blue}>DATA</Chip>
      <Arrow vertical={!vertical} />
      <Chip color={C.amber}>VARIABLE</Chip>
      <Arrow vertical={!vertical} />
      <Chip color={C.green}>TYPE</Chip>
    </div>
  );
};

export const VariableScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <SceneShell id="S02" title="DATA + VARIABLE" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 300 : 240, left: vertical ? '50%' : 90, ...entryAt(frame, fps, 3, vertical ? 'translateX(-50%)' : '')}}>
        <WindowCard />
      </div>
      <div style={{position: 'absolute', top: vertical ? 700 : 550, left: vertical ? '50%' : 90, ...entryAt(frame, fps, 10, vertical ? 'translateX(-50%)' : '')}}>
        <ResultPanel label="RELATION"><span>VARIABLE</span><Arrow /><span>DATA TYPE</span><CheckMark /></ResultPanel>
      </div>
      <div style={{position: 'absolute', top: vertical ? 1010 : 260, left: vertical ? 0 : 1120, right: vertical ? 0 : 'auto'}}>
        <RelationDiagram frame={frame} fps={fps} />
      </div>
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
    <SceneShell id="S03" title="INTEGER & FLOAT" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 340 : 285, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: vertical ? 32 : 38}}>
        <div style={enter(frame, fps, 3, 12)}><TypeCard name="INTEGER" active={!floatActive} muted={floatActive} style={{transform: `scale(${!floatActive ? 1.04 : .97})`}} /></div>
        <div style={enter(frame, fps, 12, 12)}><TypeCard name="FLOAT" active={floatActive} muted={!floatActive} style={{transform: `scale(${floatActive ? 1.04 : .97})`}} /></div>
      </div>
      <div style={{position: 'absolute', top: vertical ? 750 : 610, left: '50%', ...entryAt(frame, fps, 17, 'translateX(-50%)')}}>
        <ResultPanel label="TYPE 01 / TYPE 02" accent={floatActive ? C.blue : C.green}><span>INTEGER</span><span style={{color: '#77777D'}}>+</span><span>FLOAT</span><CheckMark color={C.blue} /></ResultPanel>
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
    <SceneShell id="S04" title="STRING & BOOLEAN" duration={duration}>
      <div style={{
        position: 'absolute', top: vertical ? 300 : 265, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: vertical ? 'repeat(2, 400px)' : 'repeat(4, 330px)',
        justifyContent: 'center', gap: vertical ? 26 : 24,
      }}>
        {cards.map((name, index) => {
          const current = name === 'STRING' ? !boolActive : name === 'BOOLEAN' ? boolActive : false;
          const prior = name === 'INTEGER' || name === 'FLOAT';
          return <div key={name} style={enter(frame, fps, 2 + index * 3, 11)}><TypeCard name={name} active={current} muted={prior} style={{transform: `scale(${current ? 1.035 : 1})`}} /></div>;
        })}
      </div>
      <div style={{position: 'absolute', top: vertical ? 940 : 610, left: '50%', ...entryAt(frame, fps, 14, 'translateX(-50%)')}}>
        <ResultPanel label="FOUR TYPES / ONE SYSTEM"><span>STRING</span><span style={{color: '#77777D'}}>+</span><span>BOOLEAN</span><CheckMark /></ResultPanel>
      </div>
    </SceneShell>
  );
};

const SymbolPlaceholder: React.FC<{remove: number}> = ({remove}) => {
  const {width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  return (
    <div style={{
      position: 'relative', width: vertical ? 390 : 340, height: vertical ? 230 : 210,
      borderRadius: 28, border: `3px dashed ${C.red}`, background: C.redSoft,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: 1 - remove * .8, transform: `scale(${1 - remove * .25}) rotate(${remove * -9}deg)`,
    }}>
      <svg width={vertical ? 150 : 125} height={vertical ? 100 : 85} viewBox="0 0 150 100" fill="none">
        <circle cx="38" cy="45" r="24" stroke={C.ink} strokeWidth="5" opacity=".65" />
        <rect x="76" y="21" width="48" height="48" rx="8" stroke={C.ink} strokeWidth="5" opacity=".65" />
        <path d="M18 90L132 6" stroke={C.red} strokeWidth="9" strokeLinecap="round" />
      </svg>
      <span style={{marginTop: 10, color: C.red, fontFamily: font.heading, fontWeight: 700, fontSize: vertical ? 26 : 21, letterSpacing: 2}}>SYMBOL</span>
    </div>
  );
};

export const SymbolScene: React.FC<SceneProps> = ({start, duration}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = isVertical(width, height);
  const t = start + frame / fps;
  const remove = interpolate(t, [11.68, 12.45], [0, 1], clamp);
  const resultIn = interpolate(t, [11.75, 12.25], [0, 1], clamp);
  return (
    <SceneShell id="S05" title="NO SEPARATE SYMBOL" duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 310 : 245, left: vertical ? '50%' : 90, ...entryAt(frame, fps, 2, vertical ? 'translateX(-50%)' : '')}}>
        <WindowCard />
      </div>
      <div style={{position: 'absolute', top: vertical ? 720 : 265, left: vertical ? '50%' : 1130, transform: vertical ? 'translateX(-50%)' : undefined}}>
        <SymbolPlaceholder remove={remove} />
      </div>
      <div style={{position: 'absolute', top: vertical ? 1070 : 570, left: vertical ? '50%' : 90, transform: vertical ? 'translateX(-50%)' : undefined, opacity: resultIn}}>
        <ResultPanel label="RESULT"><span>DATA TYPE</span><CheckMark /><span style={{color: C.outputText, fontSize: vertical ? 26 : 20, fontWeight: 500}}>NO EXTRA SYMBOL</span></ResultPanel>
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
  const resultIn = interpolate(t, [14.90, 15.35], [0, 1], clamp);
  const typeIn = interpolate(t, [15.40, 16.20], [0, 1], clamp);
  const chips = ['INTEGER', 'FLOAT', 'STRING', 'BOOLEAN'];
  return (
    <SceneShell id="S06" title="AUTOMATICALLY." duration={duration}>
      <div style={{position: 'absolute', top: vertical ? 310 : 235, left: vertical ? '50%' : 100, ...entryAt(frame, fps, 2, vertical ? 'translateX(-50%)' : '')}}>
        <WindowCard scan={scan} />
      </div>
      <div style={{position: 'absolute', top: vertical ? 720 : 555, left: vertical ? '50%' : 100, transform: vertical ? 'translateX(-50%)' : undefined, opacity: resultIn}}>
        <ResultPanel label="AUTOMATIC RESULT"><span>DATA TYPE</span><CheckMark /><Chip color={C.green} style={{minHeight: vertical ? 54 : 42, fontSize: vertical ? 23 : 18}}>RECOGNIZED</Chip></ResultPanel>
      </div>
      <div style={{
        position: 'absolute', top: vertical ? 1060 : 280, left: vertical ? 0 : 1100, right: vertical ? 0 : 'auto',
        width: vertical ? 'auto' : 580, display: 'grid',
        gridTemplateColumns: vertical ? 'repeat(4, auto)' : 'repeat(2, auto)',
        justifyContent: 'center', gap: vertical ? 14 : 24, opacity: typeIn,
      }}>
        {chips.map((name, index) => <Chip key={name} color={index < 2 ? C.blue : C.green} style={{fontSize: vertical ? 20 : 21, minHeight: vertical ? 52 : 62, padding: vertical ? '0 17px' : '0 24px'}}>{name}</Chip>)}
      </div>
      <div style={{position: 'absolute', top: vertical ? 1190 : 520, left: vertical ? 0 : 1100, right: vertical ? 0 : 'auto', width: vertical ? 'auto' : 580, textAlign: 'center', color: C.muted, fontSize: vertical ? 19 : 16, fontWeight: 600, letterSpacing: 3, opacity: typeIn}}>DATA / VARIABLE / TYPE</div>
    </SceneShell>
  );
};
