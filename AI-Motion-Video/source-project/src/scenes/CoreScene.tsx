import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Eyebrow, MaskLine, Reveal, SceneWrapper} from '../components/Layout';
import {ThreeCore} from '../components/ThreeCore';
import {Stars} from '../components/Graphics';
import {ramp, springIn} from '../motion';

export const CoreScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const fast = springIn(frame,4.45,.55);
  const efficient = springIn(frame,5.25,.55);
  return (
    <SceneWrapper index={5} id="S06" title="The Language Core" duration={duration} accent={C.lime} background="radial-gradient(ellipse at 50% 40%,#122e42 0%,#090f20 42%,#050711 80%)">
      <Stars count={90} color={C.cyan}/>
      <div style={{position:'absolute',left:180,right:180,top:1450,height:280,background:'radial-gradient(ellipse,#55dfff18,transparent 68%)',transform:'perspective(600px) rotateX(68deg)',filter:'blur(8px)'}}/>
      <Reveal at={.1} style={{position:'absolute',left:70,top:205,zIndex:4}}><Eyebrow>THE DECISION / BUILD THE LANGUAGE</Eyebrow></Reveal>
      <MaskLine at={1.05} style={{position:'absolute',left:70,top:265,zIndex:4}}><div style={{fontFamily:'Space Grotesk',fontSize:58,fontWeight:700,color:C.ivory}}>ONE CLEAR <span style={{color:C.cyan}}>VISION.</span></div></MaskLine>
      <div style={{position:'absolute',left:65,top:375,zIndex:4,padding:'13px 20px',border:`1px solid ${C.cyan}55`,background:'#07101cbb',borderRadius:10,fontFamily:'monospace',fontSize:19,color:C.cyan,opacity:ramp(frame,.4,1)}}>core.init(language)</div>
      <ThreeCore variant="core" top={290} height={1050}/>
      <div style={{position:'absolute',left:75,top:770,zIndex:5,width:115,height:115,borderRadius:'50%',background:'#101a2ddd',border:`2px solid ${C.cyan}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Space Grotesk',fontWeight:700,fontSize:66,color:C.ivory,boxShadow:'0 0 50px #55dfff25',opacity:ramp(frame,3.2,3.6),transform:`rotate(${-frame*.4}deg)`}}>C</div>
      <div style={{position:'absolute',left:58,right:58,top:1180,zIndex:5,display:'flex',gap:24}}>
        <div style={{flex:1,height:190,padding:'27px 28px',borderRadius:24,background:'#0e1729ed',border:`1px solid ${C.cyan}55`,opacity:fast,transform:`translateX(${(1-fast)*-110}px)`,boxShadow:'0 25px 60px #0007'}}>
          <div style={{fontSize:16,letterSpacing:4,color:C.cyan,fontWeight:700}}>01 / SPEED</div><div style={{fontFamily:'Space Grotesk',fontSize:62,fontWeight:700,color:C.ivory,marginTop:8}}>FAST<span style={{color:C.cyan}}>.</span></div>
          <div style={{marginTop:13,height:4,width:ramp(frame,4.4,5.1,0,330),background:C.cyan}}/>
        </div>
        <div style={{flex:1,height:190,padding:'27px 28px',borderRadius:24,background:'#0e1729ed',border:`1px solid ${C.lime}55`,opacity:efficient,transform:`translateX(${(1-efficient)*110}px)`,boxShadow:'0 25px 60px #0007'}}>
          <div style={{fontSize:16,letterSpacing:4,color:C.lime,fontWeight:700}}>02 / DESIGN</div><div style={{fontFamily:'Space Grotesk',fontSize:48,fontWeight:700,color:C.ivory,marginTop:15}}>EFFICIENT<span style={{color:C.lime}}>.</span></div>
          <div style={{marginTop:18,height:4,width:ramp(frame,5.25,5.9,0,330),background:C.lime}}/>
        </div>
      </div>
      <div style={{position:'absolute',left:0,right:0,top:1420,textAlign:'center',fontFamily:'monospace',fontSize:18,letterSpacing:4,color:C.muted,opacity:ramp(frame,1.5,2.2)}}>STRUCTURE / CLARITY / POSSIBILITY</div>
    </SceneWrapper>
  );
};
