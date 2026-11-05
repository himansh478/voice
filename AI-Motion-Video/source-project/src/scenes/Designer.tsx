import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Eyebrow, MaskLine, Reveal, SceneWrapper} from '../components/Layout';
import {ramp, seeded, springIn} from '../motion';

export const ResearcherScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const fast = springIn(frame,4.25,.6);
  const simple = springIn(frame,4.9,.6);
  return (
    <SceneWrapper index={3} id="S04" title="The Designer’s Brief" duration={duration} accent={C.cyan} background="radial-gradient(circle at 15% 25%,#11334a 0%,#0a1526 38%,#070914 80%)">
      <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${C.cyan}10 1px,transparent 1px),linear-gradient(90deg,${C.cyan}10 1px,transparent 1px)`,backgroundSize:'34px 34px',transform:`translateY(${-frame*.2}px)`}}/>
      <Reveal at={.05} style={{position:'absolute',left:70,top:215}}><Eyebrow color={C.cyan}>MEET THE RESEARCHER</Eyebrow></Reveal>
      <Reveal at={.25} style={{position:'absolute',left:66,right:66,top:295,height:390}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#15253bea,#0c1425e8)',border:'1px solid #55dfff44',borderRadius:30,boxShadow:'0 30px 70px #0007',overflow:'hidden'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:290,background:`linear-gradient(150deg,${C.cyan}25,transparent)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:190,height:190,border:`2px solid ${C.cyan}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              <div style={{position:'absolute',inset:14,border:`1px dashed ${C.cyan}88`,borderRadius:'50%',transform:`rotate(${frame*.5}deg)`}}/>
              <span style={{fontFamily:'Space Grotesk',fontSize:62,fontWeight:700,color:C.ivory}}>GVR</span>
            </div>
          </div>
          <div style={{position:'absolute',left:330,top:68,right:35}}>
            <div style={{fontSize:18,letterSpacing:4,color:C.cyan,fontWeight:700}}>RESEARCHER / LANGUAGE DESIGNER</div>
            <div style={{fontFamily:'Space Grotesk',fontSize:61,lineHeight:1.02,fontWeight:700,color:C.ivory,marginTop:22}}>GUIDO VAN<br/>ROSSUM</div>
            <div style={{marginTop:25,fontFamily:'monospace',fontSize:21,color:C.muted}}>status: looking for a better way_</div>
          </div>
        </div>
      </Reveal>
      <Reveal at={1.7} style={{position:'absolute',left:92,right:92,top:745,height:280}}>
        <div style={{height:'100%',background:'#070c17ee',border:'1px solid #55dfff33',borderRadius:22,boxShadow:'0 25px 60px #0008',overflow:'hidden'}}>
          <div style={{height:55,display:'flex',alignItems:'center',gap:10,padding:'0 22px',borderBottom:'1px solid #ffffff12'}}><i style={{width:11,height:11,borderRadius:9,background:C.red}}/><i style={{width:11,height:11,borderRadius:9,background:C.yellow}}/><i style={{width:11,height:11,borderRadius:9,background:C.lime}}/><span style={{marginLeft:15,fontFamily:'monospace',fontSize:17,color:C.muted}}>language_brief.py</span></div>
          <div style={{padding:'25px 28px',fontFamily:'monospace',fontSize:23,lineHeight:1.75,color:'#b5c2da'}}>
            <div><span style={{color:C.violet}}>class</span> <span style={{color:C.cyan}}>NewLanguage</span>:</div>
            <div style={{opacity:ramp(frame,2,2.5)}}>&nbsp;&nbsp;vision = <span style={{color:C.yellow}}>"clear + powerful"</span></div>
            <div style={{opacity:ramp(frame,2.4,3)}}>&nbsp;&nbsp;requirements = [<span style={{color:C.lime}}>FAST</span>, <span style={{color:C.lime}}>SIMPLE</span>]</div>
          </div>
        </div>
      </Reveal>
      {[{label:'FAST',sub:'PERFORMANCE',p:fast,x:66,color:C.cyan},{label:'SIMPLE',sub:'READABILITY',p:simple,x:552,color:C.lime}].map((item)=><div key={item.label} style={{position:'absolute',left:item.x,top:1110,width:462,height:210,padding:'32px 36px',borderRadius:26,background:'#111a2bed',border:`2px solid ${item.color}${item.p>.5?'99':'33'}`,transform:`translateY(${(1-item.p)*80}px) scale(${.9+item.p*.1})`,opacity:item.p}}>
        <div style={{fontSize:17,letterSpacing:4,color:item.color,fontWeight:700}}>{item.sub}</div><div style={{fontFamily:'Space Grotesk',fontSize:67,fontWeight:700,color:C.ivory,marginTop:10}}>{item.label}</div><div style={{position:'absolute',right:28,top:28,width:50,height:50,borderRadius:'50%',border:`3px solid ${item.color}`,display:'flex',alignItems:'center',justifyContent:'center',color:item.color,fontSize:28}}>✓</div>
      </div>)}
    </SceneWrapper>
  );
};

export const ChristmasScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const start = springIn(frame,2.75,.65);
  const snow = Array.from({length:75},(_,i)=>i);
  return (
    <SceneWrapper index={4} id="S05" title="A Christmas Side Project" duration={duration} accent={C.yellow} background="linear-gradient(155deg,#0c1830 0%,#10182a 48%,#221b1b 100%)">
      <div style={{position:'absolute',left:55,right:55,top:190,height:710,borderRadius:30,overflow:'hidden',background:'radial-gradient(circle at 60% 20%,#254a6a,#0a1730 70%)',border:'16px solid #1d2432',boxShadow:'0 35px 80px #0009,inset 0 0 90px #55dfff15'}}>
        <div style={{position:'absolute',inset:0,opacity:.8}}>{snow.map((i)=>{const x=seeded(i*4)*950;const speed=12+seeded(i*4+1)*30;const y=((seeded(i*4+2)*720+frame*speed/30)%760)-30;return <div key={i} style={{position:'absolute',left:x,top:y,width:2+seeded(i*4+3)*7,height:2+seeded(i*4+3)*7,borderRadius:'50%',background:C.ivory,opacity:.25+seeded(i)*.55,filter:i%4===0?'blur(2px)':'none'}}/>;})}</div>
        <div style={{position:'absolute',left:'48%',top:0,bottom:0,width:18,background:'#1d2432'}}/><div style={{position:'absolute',left:0,right:0,top:'47%',height:18,background:'#1d2432'}}/>
        <div style={{position:'absolute',left:45,top:40,fontSize:18,letterSpacing:5,color:'#b8dcff'}}>WINTER / HOLIDAY NIGHT</div>
      </div>
      <Reveal at={.15} style={{position:'absolute',top:245,left:85,right:85,textAlign:'center'}}>
        <div style={{fontFamily:'Space Grotesk',fontSize:53,fontWeight:700,color:C.ivory,textShadow:'0 4px 20px #000'}}>CHRISTMAS <span style={{color:C.yellow}}>BREAK</span></div>
      </Reveal>
      <div style={{position:'absolute',left:0,right:0,top:835,height:480,background:'linear-gradient(165deg,#5b3c2c 0%,#2b2324 45%,#171925 100%)',clipPath:'polygon(0 15%,100% 0,100% 100%,0 100%)',boxShadow:'0 -20px 60px #0006'}}/>
      <div style={{position:'absolute',left:170,top:680,width:740,height:450,transform:`perspective(1100px) rotateX(${-3+frame*.01}deg) translateY(${(1-springIn(frame,.6))*70}px)`,filter:'drop-shadow(0 35px 35px #0009)'}}>
        <div style={{height:390,background:'#111725',border:'18px solid #34394a',borderBottomWidth:25,borderRadius:'24px 24px 10px 10px',overflow:'hidden'}}>
          <div style={{height:48,background:'#1d2434',padding:'13px 20px',fontFamily:'monospace',fontSize:16,color:C.muted}}>● ● ● &nbsp; hobby_project.py</div>
          <div style={{padding:28,fontFamily:'monospace',fontSize:23,lineHeight:1.7,color:'#a8b6ce'}}>
            <div><span style={{color:C.violet}}>def</span> <span style={{color:C.cyan}}>begin</span>(idea):</div>
            <div>&nbsp;&nbsp;project = <span style={{color:C.yellow}}>"something new"</span></div>
            <div style={{opacity:ramp(frame,2.6,3.1)}}>&nbsp;&nbsp;<span style={{color:C.violet}}>return</span> project.<span style={{color:C.lime}}>start</span>()</div>
            <div style={{marginTop:25,padding:'14px 18px',background:'#d7ff4f12',borderLeft:`4px solid ${C.lime}`,color:C.lime,opacity:start}}>&gt; PROJECT STARTED<span style={{opacity:Math.sin(frame*.4)>.1?1:0}}>_</span></div>
          </div>
        </div>
        <div style={{marginLeft:-65,width:870,height:45,background:'linear-gradient(#545b6c,#252b39)',clipPath:'polygon(5% 0,95% 0,100% 100%,0 100%)',borderRadius:'0 0 25px 25px'}}/>
      </div>
      <div style={{position:'absolute',left:65,top:1170,width:300,height:135,border:`3px solid ${C.yellow}`,borderRadius:14,transform:`rotate(-7deg) scale(${start})`,opacity:start,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:C.yellow}}>
        <span style={{fontSize:18,letterSpacing:5}}>NOT WORK. JUST CURIOSITY.</span><span style={{fontFamily:'Space Grotesk',fontSize:34,fontWeight:700,marginTop:9}}>HOBBY PROJECT</span>
      </div>
      <div style={{position:'absolute',right:75,top:1160,width:190,height:190,borderRadius:'0 0 30px 30px',background:'linear-gradient(120deg,#cf8f55,#6c3d29)',boxShadow:'0 20px 30px #0006'}}>
        <div style={{position:'absolute',right:-55,top:40,width:85,height:90,border:'20px solid #8e5a3b',borderLeft:0,borderRadius:'0 50px 50px 0'}}/>
        {[0,1,2].map(i=><div key={i} style={{position:'absolute',top:-80-i*15,left:45+i*38,width:8,height:90,borderRadius:'50%',background:'#f4f1e844',filter:'blur(4px)',transform:`translateX(${Math.sin(frame*.05+i)*15}px)`}}/>)}
      </div>
    </SceneWrapper>
  );
};
