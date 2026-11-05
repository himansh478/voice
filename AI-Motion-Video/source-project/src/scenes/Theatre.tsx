import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Eyebrow, MaskLine, Reveal, SceneWrapper} from '../components/Layout';
import {PythonMark, Stars} from '../components/Graphics';
import {ramp, springIn} from '../motion';

const Bulbs: React.FC = () => {
  const frame = useCurrentFrame();
  return <>{Array.from({length:22},(_,i)=><div key={i} style={{width:14,height:14,borderRadius:'50%',background:i%2?C.yellow:'#fff0b0',boxShadow:`0 0 ${12+Math.sin(frame*.2+i)*5}px ${C.yellow}`,opacity:.65+Math.sin(frame*.12+i)*.25}}/>)}</>;
};

export const ComedyScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const open = springIn(frame,.05,1.2);
  const title = ramp(frame,4.45,4.75);
  const words = [{text:'MONTY',at:4.55,size:105,color:C.ivory},{text:"PYTHON'S",at:4.85,size:122,color:C.yellow},{text:'FLYING CIRCUS',at:5.25,size:74,color:C.ivory}];
  return (
    <SceneWrapper index={6} id="S07" title="The Real Namesake" duration={duration} accent={C.yellow} background="radial-gradient(ellipse at 50% 30%,#5c2337 0%,#241423 45%,#0b0c17 90%)">
      <div style={{position:'absolute',left:135,right:135,top:185,height:1140,background:'linear-gradient(#121222,#090b14)',border:'12px solid #9d7545',borderRadius:'240px 240px 20px 20px',boxShadow:'inset 0 0 0 8px #3c281f,0 35px 100px #000b',overflow:'hidden'}}>
        <div style={{position:'absolute',left:'14%',top:-100,width:300,height:1050,background:'linear-gradient(160deg,#ffe8a122,transparent 65%)',clipPath:'polygon(42% 0,58% 0,100% 100%,0 100%)',filter:'blur(7px)'}}/>
        <div style={{position:'absolute',right:'14%',top:-100,width:300,height:1050,background:'linear-gradient(200deg,#ffe8a11c,transparent 65%)',clipPath:'polygon(42% 0,58% 0,100% 100%,0 100%)',filter:'blur(7px)'}}/>
        <div style={{position:'absolute',left:45,right:45,top:65,height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}><Bulbs/></div>
        <div style={{position:'absolute',left:45,right:45,bottom:45,height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}><Bulbs/></div>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:240,background:'linear-gradient(165deg,#58362c,#17121b 70%)',clipPath:'polygon(0 32%,100% 0,100% 100%,0 100%)'}}/>
        <div style={{position:'absolute',left:60,right:60,top:230,textAlign:'center',opacity:1-title}}>
          <Reveal at={1.85}><Eyebrow color={C.yellow}>A BRITISH</Eyebrow><div style={{fontFamily:'Space Grotesk',fontSize:78,lineHeight:1.03,fontWeight:700,color:C.ivory,marginTop:22}}>COMEDY<br/>SHOW</div><div style={{marginTop:30,fontSize:21,letterSpacing:5,color:'#d7bfa4'}}>THE UNEXPECTED SOURCE</div></Reveal>
        </div>
        <div style={{position:'absolute',left:40,right:40,top:235,textAlign:'center',opacity:title}}>
          {words.map((word,i)=><MaskLine key={word.text} at={word.at} style={{marginTop:i===1?10:0}}><div style={{fontFamily:i===2?'Inter':'Space Grotesk',fontSize:word.size,lineHeight:1,fontWeight:800,letterSpacing:i===2?3:-4,color:word.color,textShadow:'0 5px 0 #5d3b27,0 16px 30px #000b'}}>{word.text}</div></MaskLine>)}
          <Reveal at={5.6} style={{margin:'38px auto 0',width:460,borderTop:`2px solid ${C.yellow}`,paddingTop:20,fontSize:20,letterSpacing:6,color:C.yellow}}>THE NAME HIDES IN PLAIN SIGHT</Reveal>
        </div>
        <div style={{position:'absolute',left:70,right:70,top:925,height:120,opacity:title}}>
          {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:70+i*135,top:35+Math.sin(frame*.08+i)*24,width:35,height:35,border:i%2?`5px solid ${C.yellow}`:`5px solid ${C.red}`,borderRadius:i%2?'50%':4,transform:`rotate(${frame*(i%2?1:-1)}deg)`}}/>)}
        </div>
      </div>
      <div style={{position:'absolute',left:0,top:145,width:390+open*0,bottom:180,background:'repeating-linear-gradient(90deg,#5e142d 0%,#a22d4b 18%,#4d1026 36%,#c04159 52%,#5e142d 70%)',clipPath:'polygon(0 0,100% 5%,82% 52%,100% 100%,0 100%)',transform:`translateX(${-open*330}px)`,boxShadow:'20px 0 40px #0008'}}/>
      <div style={{position:'absolute',right:0,top:145,width:390,bottom:180,background:'repeating-linear-gradient(90deg,#5e142d 0%,#a22d4b 18%,#4d1026 36%,#c04159 52%,#5e142d 70%)',clipPath:'polygon(0 5%,100% 0,100% 100%,0 100%,18% 52%)',transform:`translateX(${open*330}px)`,boxShadow:'-20px 0 40px #0008'}}/>
      <div style={{position:'absolute',top:155,left:0,right:0,height:105,background:'repeating-linear-gradient(90deg,#6e1731,#a72e4a 20%,#571027 40%)',clipPath:'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)',filter:'drop-shadow(0 15px 18px #0008)'}}/>
      <div style={{position:'absolute',top:1370,left:72,fontSize:19,letterSpacing:4,color:'#bd9b82'}}>FROM COMEDY STAGE → PROGRAMMING LANGUAGE</div>
    </SceneWrapper>
  );
};

export const NamingScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const name = springIn(frame,2.55,.65);
  return (
    <SceneWrapper index={7} id="S08" title="Python Gets Its Name" duration={duration} accent={C.yellow} background="radial-gradient(circle at 50% 45%,#162c46 0%,#0b1121 48%,#070914 85%)">
      <Stars count={42} color={C.yellow}/>
      <Reveal at={.05} style={{position:'absolute',left:70,top:210}}><Eyebrow color={C.yellow}>THE MOMENT OF NAMING</Eyebrow></Reveal>
      <Reveal at={.35} style={{position:'absolute',left:0,right:0,top:330,textAlign:'center'}}>
        <div style={{fontSize:21,letterSpacing:6,color:C.muted}}>INSPIRED BY</div><div style={{fontFamily:'Space Grotesk',fontSize:55,fontWeight:700,color:C.ivory,marginTop:12}}>MONTY PYTHON</div>
      </Reveal>
      <div style={{position:'absolute',left:0,right:0,top:455,display:'flex',justifyContent:'center',opacity:ramp(frame,.5,1)}}>
        <PythonMark size={310} style={{filter:'drop-shadow(0 30px 40px #0008)',transform:`rotate(${Math.sin(frame*.04)*3}deg)`}}/>
      </div>
      <svg width="1080" height="300" style={{position:'absolute',top:705,left:0}}><path d="M540 0V145" stroke={C.yellow} strokeWidth="3" strokeDasharray="8 10"/><path d="M510 115l30 35 30-35" fill="none" stroke={C.yellow} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="540" cy="150" r={ramp(frame,1,2,0,13)} fill={C.yellow}/></svg>
      <div style={{position:'absolute',left:45,right:45,top:910,textAlign:'center',opacity:name,transform:`scale(${.5+name*.5})`}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:166,lineHeight:1,fontWeight:700,letterSpacing:-9,color:C.ivory,textShadow:'0 4px 0 #7991ac,0 9px 0 #344a6a,0 15px 0 #1a2a44,0 30px 60px #000b'}}>PYTHON</div>
        <div style={{marginTop:35,fontSize:22,letterSpacing:8,color:C.yellow,fontWeight:700}}>THE LANGUAGE GETS ITS NAME</div>
      </div>
      <Reveal at={2.7} style={{position:'absolute',left:210,right:210,top:1260,borderTop:`1px solid ${C.yellow}66`,paddingTop:25,display:'flex',justifyContent:'space-between',fontSize:18,letterSpacing:3,color:C.muted}}><span>COMEDY</span><span style={{color:C.yellow}}>→</span><span>CODE</span></Reveal>
    </SceneWrapper>
  );
};
