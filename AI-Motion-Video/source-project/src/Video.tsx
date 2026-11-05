import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import scenePlan from './data/scene-plan.json';
import transcript from './data/transcript.json';
import {C} from './components/Layout';
import {HookScene, MythScene, YearScene} from './scenes/Origins';
import {ChristmasScene, ResearcherScene} from './scenes/Designer';
import {CoreScene} from './scenes/CoreScene';
import {ComedyScene, NamingScene} from './scenes/Theatre';
import {DomainsScene, EcosystemScene, InventionScene} from './scenes/Impact';
import {ramp} from './motion';

const SCENE_COMPONENTS = [HookScene, MythScene, YearScene, ResearcherScene, ChristmasScene, CoreScene, ComedyScene, NamingScene, InventionScene, DomainsScene, EcosystemScene];

type CaptionWord = {id: number; text: string; start: number; end: number; keyword: boolean};
type Caption = {id: number; start: number; end: number; text: string; words: CaptionWord[]};

const splitLines = (words: CaptionWord[]): CaptionWord[][] => {
  const length = (items: CaptionWord[]) => items.reduce((sum, w) => sum + w.text.length + 1, 0);
  if (length(words) <= 30 || words.length <= 3) return [words];
  let best = 1;
  let score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = length(words.slice(0, i));
    const b = length(words.slice(i));
    const candidate = Math.max(a, b) + Math.abs(a - b) * 0.18;
    if (candidate < score) {score = candidate; best = i;}
  }
  return [words.slice(0, best), words.slice(best)];
};

const CaptionCard: React.FC<{caption: Caption}> = ({caption}) => {
  const frame = useCurrentFrame();
  const time = frame / 30;
  const enter = ramp(frame, caption.start - .08, caption.start + .12);
  const exit = ramp(frame, caption.end - .02, caption.end + .13, 1, 0);
  const opacity = Math.min(enter, exit);
  let active = caption.words.findIndex((w) => time >= w.start - .025 && time <= w.end + .045);
  if (active < 0) {
    for (let i = caption.words.length - 1; i >= 0; i--) if (time >= caption.words[i].start) {active = i; break;}
  }
  const lines = splitLines(caption.words);
  let wordIndex = 0;
  return (
    <div style={{position:'absolute',left:50,right:50,bottom:132,zIndex:100,display:'flex',justifyContent:'center',opacity,pointerEvents:'none'}}>
      <div style={{
        width:'100%',maxWidth:950,padding:'22px 28px 24px',borderRadius:24,
        background:'linear-gradient(110deg,#070b17ee,#10182ae8)',border:'1px solid #ffffff24',borderLeft:`5px solid ${C.lime}`,
        boxShadow:'0 18px 60px #0008',backdropFilter:'blur(16px)',
        transform:`translateY(${(1-enter)*24-(1-exit)*10}px)`,
      }}>
        <div style={{fontFamily:'Inter, Noto Sans Devanagari, sans-serif',fontSize:43,fontWeight:600,lineHeight:1.42,textAlign:'center',letterSpacing:.1}}>
          {lines.map((line,lineIndex)=><div key={lineIndex} style={{display:'flex',justifyContent:'center',alignItems:'baseline',flexWrap:'nowrap',whiteSpace:'nowrap'}}>
            {line.map((word) => {
              const index = wordIndex++;
              const current = index === active;
              const spoken = index < active;
              return <span key={word.id} style={{
                display:'inline-block',margin:'0 6px',padding:current?'0 7px':'0 1px',borderRadius:8,
                color:current?C.ink:word.keyword?C.yellow:spoken?C.ivory:'#d4d9e5',
                background:current?C.lime:'transparent',
                fontWeight:current||word.keyword?700:600,
                transform:current?'translateY(-2px) scale(1.035)':'none',
                textShadow:current?'none':'0 2px 10px #0005',
                transition:'none',
              }}>{word.text}</span>;
            })}
          </div>)}
        </div>
      </div>
    </div>
  );
};

const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30;
  return <>{(transcript.captions as Caption[]).filter((c)=>time>=c.start-.08&&time<=c.end+.13).map((caption)=><CaptionCard key={caption.id} caption={caption}/>)}</>;
};

const TransitionSweeps: React.FC = () => {
  const frame = useCurrentFrame();
  return <>{scenePlan.scenes.slice(1).map((scene,i)=>{
    const boundary = Math.round(scene.start*30);
    const local = frame-boundary;
    if (local < -7 || local > 7) return null;
    const p = (local+7)/14;
    const x = -1350+p*2600;
    return <div key={scene.id} style={{position:'absolute',inset:0,zIndex:60,pointerEvents:'none',overflow:'hidden'}}>
      <div style={{position:'absolute',left:x,top:-100,width:170,height:2200,background:i%3===0?C.lime:i%3===1?C.cyan:C.yellow,transform:'skewX(-13deg)',boxShadow:'0 0 50px #0004'}}/>
      <div style={{position:'absolute',left:x+185,top:-100,width:5,height:2200,background:C.ivory,transform:'skewX(-13deg)',opacity:.65}}/>
    </div>;
  })}</>;
};

const GlobalFinish: React.FC = () => (
  <>
    <AbsoluteFill style={{zIndex:180,pointerEvents:'none',background:'radial-gradient(ellipse at center,transparent 52%,#02030a55 100%)'}}/>
    <AbsoluteFill style={{zIndex:190,pointerEvents:'none',opacity:.055,mixBlendMode:'soft-light',backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")`,backgroundSize:'190px 190px'}}/>
    <div style={{position:'absolute',top:32,left:34,right:34,bottom:32,border:'1px solid #ffffff09',borderRadius:8,zIndex:181,pointerEvents:'none'}}/>
  </>
);

export const PythonStory: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor:C.ink,fontFamily:'Inter, Noto Sans Devanagari, sans-serif',overflow:'hidden'}}>
      <Audio src={staticFile('audio/master-mix.mp3')} />
      {scenePlan.scenes.map((scene,index)=>{
        const Component = SCENE_COMPONENTS[index];
        const from = Math.round(scene.start*30);
        const end = Math.round(scene.end*30);
        const duration = end-from;
        return <Sequence key={scene.id} from={from} durationInFrames={duration} premountFor={15}>
          <Component duration={duration}/>
        </Sequence>;
      })}
      <TransitionSweeps/>
      <SubtitleTrack/>
      <GlobalFinish/>
    </AbsoluteFill>
  );
};
