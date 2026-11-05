import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from './Layout';
import {linear, ramp, seeded} from '../motion';

export const PythonMark: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 240, style}) => (
  <svg width={size} height={size} viewBox="0 0 240 240" style={style} aria-label="Python-inspired two-colour mark">
    <defs>
      <linearGradient id="pyBlue" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#65d7ff"/><stop offset="1" stopColor="#3776ab"/></linearGradient>
      <linearGradient id="pyYellow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe873"/><stop offset="1" stopColor="#ffc857"/></linearGradient>
      <filter id="pyShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity=".3"/></filter>
    </defs>
    <g filter="url(#pyShadow)">
      <path fill="url(#pyBlue)" d="M118 18c-28 0-51 7-51 24v27h53v9H49c-19 0-31 15-31 42s12 43 31 43h20v-28c0-20 16-35 36-35h51c15 0 27-12 27-27V42c0-17-22-24-65-24z"/>
      <path fill="url(#pyYellow)" d="M122 222c28 0 51-7 51-24v-27h-53v-9h71c19 0 31-15 31-42s-12-43-31-43h-20v28c0 20-16 35-36 35H84c-15 0-27 12-27 27v31c0 17 22 24 65 24z"/>
      <circle cx="91" cy="45" r="8" fill="#f4f1e8"/><circle cx="149" cy="195" r="8" fill="#f4f1e8"/>
    </g>
  </svg>
);

export const SnakeMark: React.FC<{progress?: number; crossed?: boolean; style?: React.CSSProperties}> = ({progress = 1, crossed = false, style}) => {
  const length = 880;
  return (
    <svg width="520" height="520" viewBox="0 0 520 520" style={style}>
      <defs><linearGradient id="snakeG" x1="0" y1="0" x2="1" y2="1"><stop stopColor={C.lime}/><stop offset="1" stopColor={C.cyan}/></linearGradient></defs>
      <path d="M359 130c-34-57-154-66-196 6-47 81 85 80 142 83 87 5 126 55 100 124-31 81-162 103-241 52-50-32-52-89-8-112 42-22 103 9 90 48-10 31-59 29-69 7" fill="none" stroke="url(#snakeG)" strokeWidth="25" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - progress)}/>
      <path d="M352 125l45-22-12 49" fill="none" stroke={C.lime} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity={progress}/>
      <circle cx="366" cy="119" r="5" fill={C.ink} opacity={progress}/>
      {crossed && <g stroke={C.red} strokeWidth="18" strokeLinecap="round"><path d="M102 105L425 428"/><path d="M425 105L102 428" opacity=".35"/></g>}
    </svg>
  );
};

export const Network: React.FC<{count?: number; spread?: number; progress?: number; style?: React.CSSProperties}> = ({count = 30, spread = 1, progress = 1, style}) => {
  const frame = useCurrentFrame();
  const nodes = Array.from({length: count}, (_, i) => ({
    x: 500 + (seeded(i * 3 + 1) - 0.5) * 850 * spread,
    y: 590 + (seeded(i * 3 + 2) - 0.5) * 850 * spread,
    r: 4 + seeded(i * 3 + 3) * 11,
  }));
  return (
    <svg width="1080" height="1200" viewBox="0 0 1080 1200" style={style}>
      <g opacity={0.55}>
        {nodes.slice(1).map((n, i) => {
          const parent = nodes[Math.floor(i / 2)];
          const raw = Math.max(0, Math.min(1, (progress - i / count * 0.5) / 0.25));
          const local = raw * raw * (3 - 2 * raw);
          return <line key={`l${i}`} x1={parent.x} y1={parent.y} x2={parent.x + (n.x - parent.x) * local} y2={parent.y + (n.y - parent.y) * local} stroke={i % 3 === 0 ? C.lime : C.cyan} strokeWidth={i % 4 === 0 ? 3 : 1.5} opacity={0.25 + local * 0.5}/>;
        })}
      </g>
      {nodes.map((n, i) => {
        const raw = Math.max(0, Math.min(1, (progress - i / count * 0.5) / 0.2));
        const p = raw * raw * (3 - 2 * raw);
        const pulse = 1 + Math.sin(frame * 0.08 + i) * 0.12;
        return <g key={`n${i}`} opacity={p}><circle cx={n.x} cy={n.y} r={n.r * 3 * pulse} fill={i % 3 === 0 ? C.lime : C.cyan} opacity=".08"/><circle cx={n.x} cy={n.y} r={n.r * p} fill={i % 3 === 0 ? C.lime : C.cyan}/></g>;
      })}
    </svg>
  );
};

export const NeuralIcon: React.FC<{active?: number}> = ({active = 1}) => {
  const pts = [[45,50],[45,120],[45,190],[130,25],[130,95],[130,165],[130,235],[220,70],[220,170]];
  const edges = [[0,3],[0,4],[1,4],[1,5],[2,5],[2,6],[3,7],[4,7],[4,8],[5,8],[6,8]];
  return <svg width="250" height="260" viewBox="0 0 250 260"><g stroke={C.cyan} strokeWidth="3" opacity={0.25 + active * 0.5}>{edges.map(([a,b],i)=><line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[a][0]+(pts[b][0]-pts[a][0])*active} y2={pts[a][1]+(pts[b][1]-pts[a][1])*active}/>)}</g>{pts.map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r="16" fill={C.cyan} opacity=".12"/><circle cx={p[0]} cy={p[1]} r="6" fill={C.cyan}/></g>)}</svg>;
};

export const ChipIcon: React.FC<{active?: number}> = ({active = 1}) => (
  <svg width="250" height="260" viewBox="0 0 250 260">
    <g stroke={C.violet} strokeWidth="5" opacity={0.35 + active * 0.55}>{[45,85,125,165,205].map((x,i)=><g key={i}><path d={`M${x} 48V12M${x} 212v36`}/><path d={`M48 ${x}H12M212 ${x}h36`}/></g>)}</g>
    <rect x="48" y="48" width="164" height="164" rx="26" fill="#ae83ff16" stroke={C.violet} strokeWidth="4"/>
    <rect x="82" y="82" width="96" height="96" rx="18" fill={C.violet} opacity={0.12 + active * 0.15}/>
    <text x="130" y="149" textAnchor="middle" fill={C.ivory} fontFamily="Space Grotesk" fontWeight="700" fontSize="54">AI</text>
  </svg>
);

export const RobotIcon: React.FC<{active?: number}> = ({active = 1}) => {
  const frame = useCurrentFrame();
  const angle = -25 + Math.sin(frame * 0.07) * 15 * active;
  return <svg width="250" height="260" viewBox="0 0 250 260">
    <path d="M35 226h115" stroke={C.yellow} strokeWidth="12" strokeLinecap="round"/><rect x="60" y="184" width="65" height="42" rx="10" fill="#ffc85722" stroke={C.yellow} strokeWidth="4"/>
    <g transform={`rotate(${angle} 92 184)`}><path d="M92 184L122 96" stroke={C.yellow} strokeWidth="24" strokeLinecap="round"/><circle cx="92" cy="184" r="20" fill={C.panel} stroke={C.yellow} strokeWidth="5"/><g transform={`rotate(${55-angle} 122 96)`}><path d="M122 96l65 45" stroke={C.yellow} strokeWidth="20" strokeLinecap="round"/><circle cx="122" cy="96" r="18" fill={C.panel} stroke={C.yellow} strokeWidth="5"/><path d="M187 141l25-12m-25 12l12 25" stroke={C.ivory} strokeWidth="8" strokeLinecap="round"/></g></g>
    <circle cx="202" cy="57" r="26" fill="none" stroke={C.yellow} strokeWidth="7" strokeDasharray="9 7" opacity={active}/>
  </svg>;
};

export const Stars: React.FC<{count?: number; color?: string}> = ({count = 65, color = C.cyan}) => {
  const frame = useCurrentFrame();
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>{Array.from({length:count},(_,i)=>{const x=seeded(i*4)*1080;const y=seeded(i*4+1)*1500+120;const r=1+seeded(i*4+2)*3;return <circle key={i} cx={x} cy={y+Math.sin(frame*.015+i)*10} r={r} fill={color} opacity={.08+seeded(i*4+3)*.3}/>;})}</svg>;
};
