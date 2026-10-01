(()=>{'use strict';
const base=document.querySelector('#simCanvas'),wrap=base?.closest('.viewer-wrap');if(!base||!wrap||document.querySelector('#legacyMotionV9'))return;
const c=document.createElement('canvas');c.id='legacyMotionV9';c.setAttribute('aria-hidden','true');Object.assign(c.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'2'});wrap.appendChild(c);const x=c.getContext('2d');let W=1,H=1,dpr=1,visible=false,t=0,last=performance.now();
function resize(){const r=base.getBoundingClientRect();if(r.width<10||r.height<10)return;dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);x.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(base);window.addEventListener('resize',resize);new IntersectionObserver(e=>visible=!!e[0]?.isIntersecting,{threshold:.02}).observe(wrap);
const dot=(px,py,r=4,col='rgba(120,230,161,.9)')=>{x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill()};
const arrow=(x1,y1,x2,y2,col='rgba(110,212,255,.65)')=>{x.strokeStyle=col;x.lineWidth=2;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();const a=Math.atan2(y2-y1,x2-x1);x.fillStyle=col;x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-8*Math.cos(a-.5),y2-8*Math.sin(a-.5));x.lineTo(x2-8*Math.cos(a+.5),y2-8*Math.sin(a+.5));x.closePath();x.fill()};
function draw(){x.clearRect(0,0,W,H);const title=(document.querySelector('#simTitle')?.textContent||'').toLowerCase(),u=(t*.18)%1,pulse=.65+.35*Math.sin(t*4);
 if(title.includes('orbit')){const cx=W*.48,cy=H*.5,R=Math.min(W,H)*.28,a=t*.7;dot(cx+R*Math.cos(a),cy+R*.62*Math.sin(a),5,'rgba(242,200,107,.95)');arrow(cx+R*Math.cos(a),cy+R*.62*Math.sin(a),cx,cy,'rgba(120,230,161,.65)')}
 else if(title.includes('electric')||title.includes('field')){for(let i=0;i<7;i++){const yy=H*(.25+i*.08),xx=W*(.18+((u+i*.11)%1)*.64);dot(xx,yy,3,'rgba(110,212,255,.75)')}}
 else if(title.includes('capacitor')||title.includes('discharge')){for(let i=0;i<10;i++){const q=(u+i/10)%1;dot(W*(.2+.6*q),H*(.27+.46*(i%2)),3.5,`rgba(110,212,255,${.35+.5*pulse})`)}}
 else if(title.includes('magnetic')||title.includes('particle')||title.includes('wire')){for(let i=0;i<9;i++){const q=(u+i/9)%1;dot(W*(.18+.64*q),H*.48,3.5,'rgba(242,200,107,.8)')}const a=t*1.2,R=Math.min(W,H)*.16;dot(W*.7+R*Math.cos(a),H*.58+R*Math.sin(a),4,'rgba(199,168,255,.9)')}
 else if(title.includes('flux')||title.includes('induction')||title.includes('generator')){const px=W*(.2+.26*(.5+.5*Math.sin(t*1.3)));dot(px,H*.5,6,'rgba(255,120,120,.9)');x.strokeStyle='rgba(110,212,255,.6)';x.lineWidth=2;x.beginPath();for(let i=0;i<90;i++){const xx=W*(.55+i/90*.35),yy=H*.55-Math.sin(i/10+t*2)*22;if(i===0)x.moveTo(xx,yy);else x.lineTo(xx,yy)}x.stroke()}
 else if(title.includes('transformer')||title.includes('alternating')||title.includes('ac')){for(let i=0;i<16;i++){const a=((u+i/16)%1)*Math.PI*2,px=W*.5+Math.cos(a)*W*.18,py=H*.5+Math.sin(a)*H*.22;dot(px,py,3,'rgba(110,212,255,.75)')}}
 else{for(let i=0;i<6;i++)dot(W*(.22+((u+i/6)%1)*.56),H*.5,3,'rgba(120,230,161,.7)')}
}
function loop(now){requestAnimationFrame(loop);if(!visible||document.hidden){last=now;return}const dt=Math.min(.033,(now-last)/1000);last=now;t+=dt;draw()}resize();requestAnimationFrame(loop);
})();
