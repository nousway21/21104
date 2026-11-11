const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
const TAU=Math.PI*2,ease=t=>1-Math.pow(1-t,3),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let W,H,DPR,bg,gy,time=0,last=0,state='intro',stage=0,count=0,lock=false,ft=0,daisy=null;
let fl=[],ps=[],flies=[];
const ST=[['rose1','Qizil atirgul'],['rose2','Pushti atirgul'],['tulip','Lola'],['lily','Zambak']];
const TY={
 rose1:{R:34,pal:['#3d030f','#c3153a','#ff6b86'],glow:'255,60,90'},
 rose2:{R:34,pal:['#6e0f3c','#e8438a','#ffc3dc'],glow:'255,130,185'},
 tulip:{R:30,pal:['#b3123b','#ff5d7f','#ffc0cf'],glow:'255,110,150'},
 lily:{R:36,pal:['#f4d35e','#ffb3cf','#fff1f6'],glow:'255,190,220'},
 daisy:{R:40,pal:['#dfe9f0','#ffffff','#ffffff'],glow:'255,255,255'}
};
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);buildBg();}
function buildBg(){
 bg=document.createElement('canvas');bg.width=W*DPR;bg.height=H*DPR;const b=bg.getContext('2d');b.scale(DPR,DPR);gy=H*.64;
 let g=b.createLinearGradient(0,0,0,gy);g.addColorStop(0,'#070b24');g.addColorStop(.55,'#2a1a4f');g.addColorStop(1,'#8a4a78');b.fillStyle=g;b.fillRect(0,0,W,H);
 for(let i=0;i<140;i++){b.fillStyle='rgba(255,255,255,'+(.2+Math.random()*.7)+')';b.beginPath();b.arc(Math.random()*W,Math.random()*gy*.8,Math.random()*1.3+.2,0,TAU);b.fill();}
 const mx=W*.8,my=H*.15;g=b.createRadialGradient(mx,my,0,mx,my,H*.25);g.addColorStop(0,'rgba(255,240,220,.55)');g.addColorStop(1,'rgba(255,240,220,0)');b.fillStyle=g;b.fillRect(0,0,W,gy);
 b.fillStyle='#fff6e6';b.beginPath();b.arc(mx,my,Math.min(W,H)*.04,0,TAU);b.fill();
 [['#2b1d4a',.06,.012],['#1c2a3d',.035,.02]].forEach(([c,a,f],k)=>{b.fillStyle=c;b.beginPath();b.moveTo(0,gy);for(let x=0;x<=W;x+=8)b.lineTo(x,gy-H*a-Math.sin(x*f+k*2)*H*a*.7);b.lineTo(W,gy);b.fill();});
 g=b.createLinearGradient(0,gy,0,H);g.addColorStop(0,'#17392a');g.addColorStop(1,'#07140d');b.fillStyle=g;b.fillRect(0,gy,W,H-gy);
 for(let i=0;i<1100;i++){const x=Math.random()*W,y=gy+Math.random()*(H-gy),d=(y-gy)/(H-gy),l=8+d*34,l2=Math.random()*10-5;
  b.strokeStyle='hsl('+(110+Math.random()*30)+','+(40+Math.random()*20)+'%,'+(10+d*22+Math.random()*8)+'%)';b.lineWidth=.8+d*1.6;
  b.beginPath();b.moveTo(x,y);b.quadraticCurveTo(x+l2*.4,y-l*.6,x+l2,y-l);b.stroke();}
}
function addFlower(x,y,type,big){
 const s=big||(.6+((y-gy)/(H-gy))*.55);
 return{x,y,type,t:0,s,L:big?H*.42:(110+Math.random()*70)*s*clamp(H/800,.7,1.2),ph:Math.random()*6.28,lean:big?0:(Math.random()-.5)*40,r:Array.from({length:8},Math.random),rot:Math.random()*TAU,dur:big?5:2.4,done:0};
}
function burst(x,y,col,n,pal){
 for(let i=0;i<n;i++){const a=Math.random()*TAU,sp=30+Math.random()*110;ps.push({k:'s',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-40,l:0,m:.9+Math.random()*1.2,sz:1+Math.random()*2.4,col});}
 for(let i=0;i<(pal?10:0);i++)ps.push({k:'p',x:x+(Math.random()-.5)*30,y:y+Math.random()*10,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,l:0,m:4+Math.random()*3,sz:5+Math.random()*4,col:pal,rot:Math.random()*TAU,ph:Math.random()*6});
}
function petal(len,wid,c0,c1,a){
 const g=ctx.createLinearGradient(0,0,0,-len);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.globalAlpha=a==null?1:a;ctx.fillStyle=g;
 ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(wid,-len*.25,wid*1.15,-len*.98,0,-len);ctx.bezierCurveTo(-wid*1.15,-len*.98,-wid,-len*.25,0,0);ctx.fill();
 ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=.8;ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.07)';ctx.beginPath();ctx.moveTo(0,-len*.1);ctx.lineTo(0,-len*.85);ctx.stroke();ctx.globalAlpha=1;
}
function dew(R,f,n){for(let i=0;i<n;i++){const a=f.r[i]*TAU,d=R*(.25+f.r[i+3]*.55),x=Math.cos(a)*d,y=Math.sin(a)*d,r=R*.055;
 const g=ctx.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.5,'rgba(200,230,255,.35)');g.addColorStop(1,'rgba(255,255,255,.1)');
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}}
function headRose(R,f,P){
 const tip=[P[2],P[1],P[1],P[0]];
 for(let l=0;l<4;l++){for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*TAU/5+l*.63+f.rot);ctx.translate(0,-R*.04*l);petal(R*(1-l*.2),R*(.62-l*.06),P[0],tip[l]);ctx.restore();}}
 ctx.strokeStyle='rgba(30,0,8,.55)';ctx.lineWidth=1.1;ctx.beginPath();
 for(let a=0;a<13;a+=.2){const r=a*R*.024,x=Math.cos(a+f.rot)*r,y=Math.sin(a+f.rot)*r;a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
 const g=ctx.createRadialGradient(-R*.2,-R*.3,0,0,0,R);g.addColorStop(0,'rgba(255,255,255,.28)');g.addColorStop(.6,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
 dew(R,f,3);
}
function headTulip(R,f,P){
 const L=R*1.55;
 [-.5,.5].forEach(a=>{ctx.save();ctx.translate(0,R*.3);ctx.rotate(a);petal(L,R*.55,P[0],P[1]);ctx.restore();});
 ctx.save();ctx.translate(0,R*.3);petal(L*1.05,R*.58,P[0],P[1]);ctx.restore();
 [-.2,.2].forEach(a=>{ctx.save();ctx.translate(0,R*.3);ctx.rotate(a);petal(L*.95,R*.5,P[1],P[2],.96);ctx.restore();});
 const g=ctx.createLinearGradient(-R,0,R,0);g.addColorStop(0,'rgba(0,0,0,.12)');g.addColorStop(.5,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(0,0,0,.12)');ctx.fillStyle=g;ctx.fillRect(-R*.6,-R*1.1,R*1.2,R*1.3);
}
function headLily(R,f,P){
 for(let l=0;l<2;l++)for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*TAU/3+l*TAU/6+f.rot);petal(R*(1.3-l*.12),R*(.4-l*.03),P[0],P[1+l*0]===undefined?P[1]:(l?P[2]:P[1]));ctx.restore();}
 ctx.fillStyle='rgba(150,30,80,.55)';for(let i=0;i<22;i++){const a=f.rot+i*2.4,d=R*(.12+(i%7)*.08);ctx.beginPath();ctx.arc(Math.cos(a)*d,Math.sin(a)*d,R*.018,0,TAU);ctx.fill();}
 for(let i=0;i<6;i++){const a=i*TAU/6+f.rot*.5,x=Math.cos(a)*R*.62,y=Math.sin(a)*R*.62;ctx.strokeStyle='#e9e2a6';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#d9731a';ctx.beginPath();ctx.ellipse(x,y,R*.07,R*.035,a,0,TAU);ctx.fill();}
}
function headDaisy(R,f){
 [[26,1],[22,.88],[18,.74]].forEach(([n,k],ring)=>{for(let i=0;i<n;i++){ctx.save();ctx.rotate(i*TAU/n+ring*.13+f.rot);petal(R*k,R*.1,'#cfdde8','#ffffff');ctx.restore();}});
 const g=ctx.createRadialGradient(-R*.05,-R*.06,0,0,0,R*.28);g.addColorStop(0,'#fff7a8');g.addColorStop(.55,'#ffd21f');g.addColorStop(1,'#b97800');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*.28,0,TAU);ctx.fill();
 ctx.fillStyle='rgba(120,70,0,.5)';for(let i=0;i<40;i++){const a=i*2.4,d=Math.sqrt(i/40)*R*.25;ctx.beginPath();ctx.arc(Math.cos(a)*d,Math.sin(a)*d,R*.014,0,TAU);ctx.fill();}
 dew(R,f,3);
}
function leaf(x,y,ang,len,g){
 ctx.save();ctx.translate(x,y);ctx.rotate(ang);const L=len*g,w=L*.28;const gr=ctx.createLinearGradient(0,0,L,0);gr.addColorStop(0,'#1a5a2c');gr.addColorStop(1,'#56b25a');ctx.fillStyle=gr;
 ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(L*.3,-w,L*.7,-w,L,0);ctx.bezierCurveTo(L*.7,w,L*.3,w,0,0);ctx.fill();ctx.strokeStyle='rgba(220,255,220,.25)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(L*.9,0);ctx.stroke();ctx.restore();
}
function headPos(f,sw){const g=ease(Math.min(1,f.t/.55));return{g,hx:f.x+f.lean*g+sw*5*f.s*g,hy:f.y-f.L*g};}
function drawFlower(f){
 const sw=Math.sin(time*1.2+f.ph),{g,hx,hy}=headPos(f,sw),b=ease(clamp((f.t-.45)/.55,0,1)),cfg=TY[f.type];
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(f.x,f.y+2,16*f.s,4*f.s,0,0,TAU);ctx.fill();
 const cx=f.x+f.lean*.2+sw*2,cy=f.y-f.L*g*.5;
 const sg=ctx.createLinearGradient(f.x,f.y,hx,hy);sg.addColorStop(0,'#14451f');sg.addColorStop(1,'#5db55e');
 ctx.strokeStyle=sg;ctx.lineWidth=Math.max(2,3.4*f.s);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.quadraticCurveTo(cx,cy,hx,hy);ctx.stroke();
 [[.3,-1],[.55,1]].forEach(([u,sd])=>{const px=(1-u)*(1-u)*f.x+2*(1-u)*u*cx+u*u*hx,py=(1-u)*(1-u)*f.y+2*(1-u)*u*cy+u*u*hy;leaf(px,py,sd>0?-.55+sw*.05:Math.PI+.55-sw*.05,42*f.s,clamp((g-u)*2.2,0,1));});
 if(b<.2){ctx.fillStyle='#2f8a3f';ctx.beginPath();ctx.ellipse(hx,hy,6*f.s*(.4+b*3),9*f.s*(.4+b*3),0,0,TAU);ctx.fill();}
 if(b>0){
  const R=cfg.R*f.s*b;
  if(f.t>.8){const h=ctx.createRadialGradient(hx,hy,0,hx,hy,R*2.4);h.addColorStop(0,'rgba('+cfg.glow+',.22)');h.addColorStop(1,'rgba('+cfg.glow+',0)');ctx.fillStyle=h;ctx.beginPath();ctx.arc(hx,hy,R*2.4,0,TAU);ctx.fill();}
  ctx.save();ctx.translate(hx,hy);ctx.rotate(sw*.05);ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=8*f.s;
  if(f.type[0]==='r')headRose(R,f,cfg.pal);else if(f.type==='tulip')headTulip(R,f,cfg.pal);else if(f.type==='lily')headLily(R,f,cfg.pal);else headDaisy(R,f);
  ctx.restore();
 }
 if(!f.done&&f.t>=1){f.done=1;const h=headPos(f,0);burst(h.hx,h.hy,'rgba('+cfg.glow+',',f.type==='daisy'?90:36,f.type==='daisy'?'#ffffff':cfg.pal[1]);}
}
function sortedDraw(){fl.sort((a,b)=>a.y-b.y).forEach(f=>{f.t=Math.min(1,f.t+dt/f.dur);drawFlower(f);});}
let dt=0;
function drawParticles(){
 for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.l+=dt;if(p.l>p.m){ps.splice(i,1);continue;}
  const k=p.l/p.m;
  if(p.k==='s'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt;p.vx*=.99;ctx.globalCompositeOperation='lighter';ctx.fillStyle=p.col+(1-k)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,TAU);ctx.fill();ctx.fillStyle=p.col+(.15*(1-k))+')';ctx.beginPath();ctx.arc(p.x,p.y,p.sz*4,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(p.k==='p'){p.vy=Math.min(p.vy+25*dt,28);p.x+=(p.vx*.3+Math.sin(time*2+p.ph)*18)*dt;p.y+=p.vy*dt;p.rot+=dt;ctx.globalAlpha=k>.8?(1-k)*5:1;ctx.fillStyle=p.col;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1,.55+.45*Math.sin(time*3+p.ph));ctx.beginPath();ctx.ellipse(0,0,p.sz,p.sz*.55,0,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;}
  else{p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,236,170,'+(Math.sin(k*Math.PI))*.9+')';ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
 }
}
function drawFlies(){
 ctx.globalCompositeOperation='lighter';
 flies.forEach(f=>{const x=f.x+Math.sin(time*f.sp+f.a)*40,y=f.y+Math.cos(time*f.sp*.8+f.a)*26,al=.35+.65*Math.abs(Math.sin(time*f.sp*1.7+f.a));
  const g=ctx.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,'rgba(255,240,150,'+al+')');g.addColorStop(1,'rgba(255,240,150,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();});
 ctx.globalCompositeOperation='source-over';
}
function drawHalo(){
 if(!daisy)return;const sw=Math.sin(time*1.2+daisy.ph),{g,hx,hy}=headPos(daisy,sw),R=TY.daisy.R*daisy.s;
 const rad=R*(2+4*ease(clamp(ft/6,0,1)))*(g);ctx.globalCompositeOperation='lighter';
 const h=ctx.createRadialGradient(hx,hy,0,hx,hy,rad);h.addColorStop(0,'rgba(255,255,255,.4)');h.addColorStop(.4,'rgba(255,225,240,.14)');h.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=h;ctx.beginPath();ctx.arc(hx,hy,rad,0,TAU);ctx.fill();
 ctx.save();ctx.translate(hx,hy);ctx.rotate(time*.05);ctx.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<14;i++){ctx.rotate(TAU/14);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(rad*1.5,-rad*.07);ctx.lineTo(rad*1.5,rad*.07);ctx.fill();}ctx.restore();
 ctx.globalCompositeOperation='source-over';
 if(ft>1&&Math.random()<.6&&g>.8){const a=Math.random()*TAU,d=R*(1+Math.random()*2.2);ps.push({k:'u',x:hx+Math.cos(a)*d,y:hy+Math.sin(a)*d,vx:(Math.random()-.5)*10,vy:-15-Math.random()*40,l:0,m:2+Math.random()*2,sz:1+Math.random()*2});}
 if(ft>2&&Math.random()<.05)ps.push({k:'p',x:hx+(Math.random()-.5)*R*3,y:hy-R,vx:(Math.random()-.5)*40,vy:0,l:0,m:6,sz:6,col:'#ffffff',rot:0,ph:Math.random()*6});
}
function frame(ts){
 dt=Math.min(.05,(ts-last)/1000||0);last=ts;time+=dt;
 ctx.drawImage(bg,0,0,W,H);
 if(state==='final')ft+=dt;
 drawHalo();drawFlies();sortedDraw();drawParticles();
 requestAnimationFrame(frame);
}
const $=id=>document.getElementById(id);
function hud(){const s=ST[Math.min(stage,3)];$('sn').textContent=s[1]+' — '+count+'/3';[...$('dots').children].forEach((d,i)=>d.classList.toggle('on',i<stage));}
function init(){fl=[];ps=[];daisy=null;stage=0;count=0;lock=false;ft=0;state='play';flies=Array.from({length:44},()=>({x:Math.random()*W,y:gy*.6+Math.random()*(H-gy*.6),sp:.4+Math.random()*.8,a:Math.random()*6}));
 $('fin').classList.remove('show');$('hud').style.opacity=1;hud();}
cv.addEventListener('pointerdown',e=>{
 if(state==='final'){burst(e.clientX,e.clientY,'rgba(255,240,250,',24);return;}
 if(state!=='play'||lock)return;
 if(e.clientY<gy+8){burst(e.clientX,e.clientY,'rgba(255,255,255,',8);return;}
 const t=ST[stage][0];fl.push(addFlower(e.clientX,clamp(e.clientY,gy+24,H-12),t));count++;
 if(count>=3){stage++;count=0;if(stage>=4){lock=true;$('sn').textContent='Hammasi ochildi…';$('dots').children[3].classList.add('on');$('sh').textContent='Biroz sabr…';setTimeout(final,3200);return;}}
 hud();
});
function final(){
 state='final';ft=0;$('hud').style.opacity=0;const s=Math.min(2.1,W/240);
 daisy=addFlower(W/2,H*.94,'daisy',s);fl.push(daisy);
 for(let i=0;i<fl.length-1;i++)burst(fl[i].x,fl[i].y-fl[i].L,'rgba(255,255,255,',6);
 setTimeout(()=>$('fin').classList.add('show'),6500);
}
$('go').onclick=()=>{$('intro').style.opacity=0;$('intro').style.pointerEvents='none';init();};
$('again').onclick=()=>{$('fin').classList.remove('show');init();};
addEventListener('resize',resize);resize();flies=[];requestAnimationFrame(frame);

/* ===== Parol ===== */
const PASS='2104',gate=$('gate'),pw=$('pw');
function tryPass(){
 if(pw.value===PASS){gate.classList.add('off');setTimeout(()=>gate.remove(),1300);}
 else{$('err').textContent='Notoʻgʻri raqam, yana urinib koʻring';gate.classList.remove('bad');void gate.offsetWidth;gate.classList.add('bad');pw.value='';pw.focus();}
}
$('enter').onclick=tryPass;
pw.addEventListener('keydown',e=>{if(e.key==='Enter')tryPass();});
pw.addEventListener('input',()=>{$('err').textContent='';if(pw.value.length===4)tryPass();});
pw.focus();
