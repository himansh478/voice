import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Eyebrow, MaskLine, Reveal, SceneWrapper} from '../components/Layout';
import {SnakeMark} from '../components/Graphics';
import {f, linear, ramp, springIn} from '../motion';

export const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const titleP = springIn(frame, 1.38, 0.65);
  const letters = 'PYTHON'.split('');
  return (
    <SceneWrapper index={0} id="S01" title="The Assumption" duration={duration} background="radial-gradient(circle at 65% 35%, #18264a 0%, #090d1c 44%, #070914 78%)">
      <div style={{position:'absolute',right:-80,top:120,fontFamily:'Space Grotesk',fontSize:760,fontWeight:700,lineHeight:1,color:'#d7ff4f08',transform:`rotate(${8+frame*.03}deg)`}}>?</div>
      <Reveal at={0.28} style={{position:'absolute',top:245,left:72,right:72}}>
        <Eyebrow>A QUESTION ABOUT A NAME</Eyebrow>
        <div style={{marginTop:24,fontFamily:'Space Grotesk',fontSize:43,fontWeight:600,color:C.ivory}}>Kya tumhe bhi yahi lagta hai?</div>
      </Reveal>
      <div style={{position:'absolute',top:490,left:62,right:62,display:'flex',justifyContent:'center',perspective:900}}>
        {letters.map((letter,i) => {
          const p = springIn(frame, 1.38 + i * 0.055, 0.55);
          return <div key={i} style={{overflow:'hidden',paddingBottom:22}}><span style={{
            display:'block',fontFamily:'Space Grotesk',fontSize:174,fontWeight:700,letterSpacing:-9,lineHeight:.95,
            color:C.ivory,transform:`translateY(${(1-p)*160}px) rotateX(${(1-p)*-70}deg)`,
            textShadow:'0 3px 0 #8a93a8, 0 7px 0 #424d69, 0 13px 0 #202a43, 0 24px 35px #0009',
          }}>{letter}</span></div>;
        })}
      </div>
      <SnakeMark progress={ramp(frame,.6,2.5)} style={{position:'absolute',width:450,height:450,right:-22,top:730,opacity:.75,transform:`rotate(${-12+frame*.08}deg) scale(${.85+titleP*.15})`}}/>
      <Reveal at={1.52} style={{position:'absolute',left:74,top:820,width:440}}>
        <div style={{fontSize:21,letterSpacing:4,color:C.cyan,fontWeight:700}}>LANGUAGE / ORIGIN</div>
        <div style={{width:ramp(frame,1.55,2.3,0,340),height:3,background:C.cyan,marginTop:20}}/>
      </Reveal>
      <MaskLine at={1.7} style={{position:'absolute',left:70,right:70,top:1215}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:50,lineHeight:1.08,fontWeight:700,letterSpacing:-1,color:C.ivory}}>NAMED AFTER<br/><span style={{color:C.lime}}>A SNAKE?</span></div>
      </MaskLine>
      <div style={{position:'absolute',left:0,right:0,top:1450,height:2,background:`linear-gradient(90deg,transparent,${C.lime},transparent)`,transform:`scaleX(${ramp(frame,.2,2.7)})`}}/>
    </SceneWrapper>
  );
};

export const MythScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const corrected = springIn(frame, 3.35, .55);
  const correctionOpacity = ramp(frame,3.28,3.55);
  return (
    <SceneWrapper index={1} id="S02" title="Myth, Corrected" duration={duration} accent={C.red} background="radial-gradient(circle at 50% 44%, #17213a 0%, #090e1c 55%, #070914 100%)">
      <Reveal at={.12} style={{position:'absolute',top:225,left:70,right:70,textAlign:'center'}}>
        <Eyebrow color={C.cyan}>THE COMMON ASSUMPTION</Eyebrow>
        <div style={{marginTop:25,fontFamily:'Space Grotesk',fontWeight:700,fontSize:68,color:C.ivory}}>PYTHON <span style={{color:C.muted}}>↔</span> <span style={{color:C.lime}}>SNAKE</span></div>
      </Reveal>
      <div style={{position:'absolute',top:425,left:280,width:520,height:520,transform:`scale(${1-corrected*.14}) rotate(${frame*.035}deg)`,opacity:1-correctionOpacity*.55}}>
        <SnakeMark progress={ramp(frame,.1,1.3)} crossed={frame>f(3.35)}/>
      </div>
      <svg width="1080" height="1250" style={{position:'absolute',top:150,left:0,pointerEvents:'none'}}>
        <path d="M165 370H915" stroke={C.cyan} strokeWidth="2" strokeDasharray="8 14" opacity={.35*(1-correctionOpacity)}/>
        <circle cx="540" cy="640" r={230+corrected*30} fill="none" stroke={C.red} strokeWidth={3+corrected*5} strokeDasharray="16 14" opacity={correctionOpacity*.45} transform={`rotate(${frame*.8} 540 640)`}/>
      </svg>
      <div style={{position:'absolute',left:60,right:60,top:1005,textAlign:'center',opacity:correctionOpacity,transform:`scale(${.65+corrected*.35})`}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:170,lineHeight:1,fontWeight:700,letterSpacing:-7,color:C.red,textShadow:'0 18px 50px #0008'}}>NAHIN.</div>
        <div style={{marginTop:35,fontFamily:'Space Grotesk',fontSize:48,fontWeight:700,letterSpacing:7,color:C.ivory}}>NOT THE SNAKE</div>
        <div style={{margin:'30px auto 0',width:90,height:6,background:C.red}}/>
      </div>
      <div style={{position:'absolute',top:1395,left:72,fontSize:19,letterSpacing:4,color:C.muted,opacity:ramp(frame,3.6,4)}}>THE REAL STORY STARTS WITH COMEDY.</div>
    </SceneWrapper>
  );
};

export const YearScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const p = springIn(frame,.24,.75);
  const ticks = Array.from({length:43},(_,i)=>i);
  return (
    <SceneWrapper index={2} id="S03" title="1989" duration={duration} accent={C.yellow} background="linear-gradient(145deg,#17171c 0%,#101522 55%,#09101e 100%)">
      <div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'repeating-linear-gradient(0deg,transparent 0 7px,#f4f1e812 8px 9px)'}}/>
      <Reveal at={.1} style={{position:'absolute',top:245,left:72}}><Eyebrow color={C.yellow}>REWIND / THE ORIGIN POINT</Eyebrow></Reveal>
      <div style={{position:'absolute',top:410,left:56,right:56,textAlign:'center',transform:`perspective(800px) rotateX(${(1-p)*65}deg) scale(${.72+p*.28})`,opacity:ramp(frame,.22,.55)}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:238,lineHeight:1,fontWeight:700,letterSpacing:-15,color:C.ivory,textShadow:'0 5px 0 #8f7958,0 11px 0 #534831,0 24px 60px #000c'}}>1989</div>
      </div>
      <Reveal at={.55} style={{position:'absolute',top:725,left:0,right:0,textAlign:'center'}}>
        <div style={{fontSize:23,letterSpacing:8,color:C.yellow,fontWeight:700}}>A SMALL SIDE STORY BEGINS</div>
      </Reveal>
      <div style={{position:'absolute',top:930,left:70,right:70,height:220}}>
        <div style={{position:'absolute',top:100,left:0,right:0,height:2,background:'#f4f1e833'}}/>
        <div style={{position:'absolute',left:0,top:100,height:2,width:ramp(frame,.15,1.6,0,940),background:`linear-gradient(90deg,${C.yellow},${C.cyan})`}}/>
        {ticks.map((tick)=><div key={tick} style={{position:'absolute',left:tick*22,top:tick%5===0?82:92,width:1,height:tick%5===0?38:20,background:tick===21?C.yellow:'#f4f1e844'}}/>)}
        <div style={{position:'absolute',left:'50%',top:73,width:30,height:58,border:`3px solid ${C.yellow}`,borderRadius:20,transform:`translateX(-50%) scale(${p})`}}/>
        <div style={{position:'absolute',left:'50%',top:148,transform:'translateX(-50%)',fontFamily:'Space Grotesk',fontSize:25,fontWeight:700,color:C.yellow}}>1989</div>
      </div>
      <Reveal at={1.1} style={{position:'absolute',top:1250,left:70,right:70,display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #f4f1e822',paddingTop:28}}>
        <span style={{fontSize:20,letterSpacing:3,color:C.muted}}>BEFORE THE ECOSYSTEM</span><span style={{fontSize:24,color:C.ivory}}>ONE RESEARCHER →</span>
      </Reveal>
    </SceneWrapper>
  );
};
