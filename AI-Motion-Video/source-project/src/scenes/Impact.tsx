import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Eyebrow, MaskLine, Reveal, SceneWrapper} from '../components/Layout';
import {ChipIcon, NeuralIcon, Network, PythonMark, RobotIcon, Stars} from '../components/Graphics';
import {ThreeCore} from '../components/ThreeCore';
import {linear, ramp, springIn} from '../motion';

export const InventionScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const expansion = ramp(frame,.15,2.5);
  return (
    <SceneWrapper index={8} id="S09" title="An Invention Expands" duration={duration} accent={C.cyan} background="radial-gradient(circle at 50% 45%,#102c40 0%,#091324 48%,#070914 85%)">
      <Stars count={75}/>
      <Reveal at={.05} style={{position:'absolute',left:70,top:210}}><Eyebrow color={C.cyan}>ONE IDEA / EXPANDING OUTWARD</Eyebrow></Reveal>
      <div style={{position:'absolute',top:230,left:0,width:1080,height:1200,transform:`scale(${1.14-expansion*.18})`,transformOrigin:'50% 48%'}}>
        <Network count={42} spread={.85+expansion*.25} progress={expansion} style={{position:'absolute',inset:0}}/>
        {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:540,top:590,width:160+i*170,height:160+i*170,marginLeft:-80-i*85,marginTop:-80-i*85,border:`2px solid ${i===1?C.lime:C.cyan}`,borderRadius:'50%',opacity:(.4-i*.08)*expansion,transform:`scale(${ramp(frame,i*.25,i*.25+1.3,.1,1.2)})`}}/>)}
        <div style={{position:'absolute',left:540,top:590,width:180,height:180,marginLeft:-90,marginTop:-90,borderRadius:'50%',background:'#0d1a2df2',border:`2px solid ${C.lime}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 80px ${C.cyan}30`,transform:`scale(${springIn(frame,.1,.6)})`}}><PythonMark size={112}/></div>
      </div>
      <MaskLine at={1.4} style={{position:'absolute',left:55,right:55,top:1160,textAlign:'center'}}>
        <div style={{fontSize:20,letterSpacing:7,color:C.cyan,fontWeight:700}}>NOT JUST A LANGUAGE</div><div style={{fontFamily:'Space Grotesk',fontSize:88,lineHeight:1,fontWeight:700,color:C.ivory,marginTop:18}}>AN <span style={{color:C.lime}}>INVENTION</span></div>
      </MaskLine>
      <div style={{position:'absolute',left:90,right:90,top:1360,height:2,background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`,transform:`scaleX(${expansion})`}}/>
    </SceneWrapper>
  );
};

const DomainPanel: React.FC<{x?: number; y: number; index: string; title: string; subtitle: string; color: string; active: number; children: React.ReactNode}> = ({y,index,title,subtitle,color,active,children}) => (
  <div style={{position:'absolute',left:58,right:58,top:y,height:285,borderRadius:28,background:'linear-gradient(110deg,#121b2eee,#0c1323e8)',border:`1px solid ${color}55`,boxShadow:'0 25px 65px #0007',overflow:'hidden',opacity:active,transform:`translateX(${(1-active)*(Number(index)%2?110:-110)}px) scale(${.96+active*.04})`}}>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:6,background:color}}/>
    <div style={{position:'absolute',left:30,top:12,width:250,height:260}}>{children}</div>
    <div style={{position:'absolute',left:315,right:28,top:44}}>
      <div style={{display:'flex',alignItems:'center',gap:18,fontSize:17,letterSpacing:4,color,fontWeight:700}}><span>{index}</span><span style={{width:45,height:2,background:color}}/><span>ACTIVE FIELD</span></div>
      <div style={{fontFamily:'Space Grotesk',fontSize:title.length>18?46:55,lineHeight:1.02,fontWeight:700,color:C.ivory,marginTop:22}}>{title}</div>
      <div style={{marginTop:17,fontFamily:'monospace',fontSize:18,color:C.muted}}>{subtitle}</div>
    </div>
    <div style={{position:'absolute',right:25,bottom:18,width:90,height:3,background:'#ffffff15'}}><div style={{height:'100%',width:`${active*100}%`,background:color}}/></div>
  </div>
);

export const DomainsScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const ml = springIn(frame,0,.55);
  const ai = springIn(frame,.68,.55);
  const automation = springIn(frame,2.12,.55);
  const role = springIn(frame,4.05,.6);
  return (
    <SceneWrapper index={9} id="S10" title="Three Fields, One Language" duration={duration} accent={C.violet} background="linear-gradient(150deg,#0b1020 0%,#101126 55%,#090b16 100%)">
      <Reveal at={0} style={{position:'absolute',left:68,top:190}}><Eyebrow color={C.violet}>THE SAME LANGUAGE / THREE REVOLUTIONS</Eyebrow></Reveal>
      <div style={{transform:`translateY(${Math.sin(frame*.025)*8}px)`}}>
        <DomainPanel y={270} index="01" title="MACHINE LEARNING" subtitle="patterns → predictions" color={C.cyan} active={ml}><NeuralIcon active={ml}/></DomainPanel>
        <DomainPanel y={585} index="02" title="ARTIFICIAL INTELLIGENCE" subtitle="compute → intelligence" color={C.violet} active={ai}><ChipIcon active={ai}/></DomainPanel>
        <DomainPanel y={900} index="03" title="AUTOMATION" subtitle="instructions → action" color={C.yellow} active={automation}><RobotIcon active={automation}/></DomainPanel>
      </div>
      <div style={{position:'absolute',left:60,right:60,top:1245,textAlign:'center',opacity:role,transform:`translateY(${(1-role)*45}px)`}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:56,fontWeight:700,color:C.ivory}}>AN <span style={{color:C.lime}}>IMPORTANT ROLE.</span></div>
        <div style={{marginTop:16,fontSize:18,letterSpacing:5,color:C.muted}}>CONNECTED BY PYTHON</div>
      </div>
    </SceneWrapper>
  );
};

export const EcosystemScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const eco = springIn(frame,4.35,.75);
  const smallOpacity = 1-ramp(frame,2.4,2.8);
  return (
    <SceneWrapper index={10} id="S11" title="From Side Project to Ecosystem" duration={duration} accent={C.lime} background="radial-gradient(ellipse at 50% 42%,#163653 0%,#0c1730 42%,#070914 78%,#121224 100%)">
      <Stars count={105} color={C.ivory}/>
      <Reveal at={.02} style={{position:'absolute',left:70,top:205,zIndex:4}}><Eyebrow>LOOK HOW FAR ONE IDEA TRAVELS</Eyebrow></Reveal>
      <div style={{position:'absolute',left:70,top:270,zIndex:4,opacity:smallOpacity}}>
        <MaskLine at={.05}><div style={{fontFamily:'Space Grotesk',fontSize:73,fontWeight:700,color:C.ivory}}>A SMALL <span style={{color:C.yellow}}>IDEA.</span></div></MaskLine>
        <Reveal at={.45} style={{fontSize:20,letterSpacing:4,color:C.muted,marginTop:12}}>A MOMENT FROM AN OLDER TIME</Reveal>
      </div>
      <ThreeCore variant="ecosystem" top={285} height={1030}/>
      <div style={{position:'absolute',left:465,top:655,width:150,height:150,zIndex:3,opacity:ramp(frame,3.8,4.5),transform:`scale(${eco})`}}><PythonMark size={150}/></div>
      <svg width="1080" height="1050" style={{position:'absolute',left:0,top:285,zIndex:2,pointerEvents:'none'}}>
        <path d="M155 700C240 200 830 160 945 620" fill="none" stroke={C.cyan} strokeWidth="2" strokeDasharray="8 13" opacity={ramp(frame,2.8,4.5)*.5}/>
        <circle cx="155" cy="700" r="9" fill={C.yellow} opacity={ramp(frame,.2,.6)}/><circle cx="945" cy="620" r="11" fill={C.lime} opacity={eco}/>
      </svg>
      {[
        {label:'MACHINE\nLEARNING',x:55,y:560,color:C.cyan,at:3.1},
        {label:'ARTIFICIAL\nINTELLIGENCE',x:695,y:490,color:C.violet,at:3.5},
        {label:'AUTOMATION',x:700,y:950,color:C.yellow,at:3.9},
      ].map((item,i)=>{const p=springIn(frame,item.at,.65);return <div key={item.label} style={{position:'absolute',left:item.x,top:item.y,width:i===1?325:260,minHeight:100,zIndex:5,padding:'20px 24px',borderRadius:18,background:'#0b1425e8',border:`1px solid ${item.color}66`,boxShadow:'0 20px 50px #0007',fontSize:19,lineHeight:1.35,letterSpacing:2,fontWeight:700,color:item.color,whiteSpace:'pre-line',opacity:p,transform:`translateY(${(1-p)*40}px)`}}>{item.label}</div>;})}
      <div style={{position:'absolute',left:45,right:45,top:1040,textAlign:'center',zIndex:6,opacity:eco,transform:`scale(${.75+eco*.25})`}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:89,lineHeight:1,fontWeight:700,color:C.ivory,textShadow:'0 15px 50px #0009'}}>ECOSYSTEM<span style={{color:C.lime}}>.</span></div>
      </div>
      <div style={{position:'absolute',left:90,right:90,top:1240,zIndex:6,display:'flex',alignItems:'center',justifyContent:'space-between',opacity:ramp(frame,3.7,4.4)}}>
        <div><div style={{fontSize:16,letterSpacing:4,color:C.muted}}>ORIGIN</div><div style={{fontFamily:'Space Grotesk',fontSize:35,fontWeight:700,color:C.yellow,marginTop:6}}>1989</div></div>
        <div style={{flex:1,margin:'20px 35px 0',height:2,background:'#ffffff20'}}><div style={{height:'100%',width:ramp(frame,3.8,5.4,0,100)+'%',background:`linear-gradient(90deg,${C.yellow},${C.lime})`}}/></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:16,letterSpacing:4,color:C.muted}}>TODAY</div><div style={{fontFamily:'Space Grotesk',fontSize:35,fontWeight:700,color:C.lime,marginTop:6}}>CONNECTED</div></div>
      </div>
      <div style={{position:'absolute',left:0,right:0,top:1405,textAlign:'center',fontSize:18,letterSpacing:6,color:C.muted,opacity:ramp(frame,5.25,5.6)}}>ONE NAME. COUNTLESS POSSIBILITIES.</div>
    </SceneWrapper>
  );
};
