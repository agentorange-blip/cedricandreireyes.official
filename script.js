(() => {
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d'); let stars=[];
    const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;stars=Array.from({length:Math.min(180,Math.floor(innerWidth/8))},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.4+.2,a:Math.random()*.7+.15,s:Math.random()*.25+.05}));};
    const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);for(const p of stars){p.y+=p.s;if(p.y>canvas.height)p.y=0;ctx.globalAlpha=p.a;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='#bfe8ff';ctx.fill();}ctx.globalAlpha=1;requestAnimationFrame(draw)};
    addEventListener('resize',resize); resize(); draw();
  }
  const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<800)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-4}deg) rotateY(${x*5}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
  const lb=document.getElementById('lightbox'); if(lb){const img=lb.querySelector('img'),cap=lb.querySelector('.lightbox-caption');document.querySelectorAll('img[data-lightbox]').forEach(x=>x.addEventListener('click',()=>{img.src=x.src;cap.textContent=x.alt||'';lb.classList.add('open')}));lb.querySelector('.lightbox-close')?.addEventListener('click',()=>lb.classList.remove('open'));lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')})}
})();
