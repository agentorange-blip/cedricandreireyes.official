
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const starCanvas=$("#stars"), ctx=starCanvas?.getContext("2d");
let stars=[];
function resizeStars(){if(!starCanvas)return;starCanvas.width=innerWidth*devicePixelRatio;starCanvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(180,Math.floor(innerWidth/8))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,a:Math.random()*.7+.15,s:Math.random()*.25+.03}))}
function drawStars(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.y+=s.s;if(s.y>innerHeight)s.y=0;ctx.globalAlpha=s.a;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(drawStars)}
resizeStars();drawStars();addEventListener("resize",resizeStars);

const glow=$(".cursor-glow");addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}});

const menu=$(".menu-toggle"),nav=$(".nav");menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});$$(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});$$(".reveal").forEach(e=>observer.observe(e));

$$(".tilt").forEach(el=>{el.addEventListener("pointermove",e=>{if(innerWidth<800)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*6}deg) translateY(-3px)`});el.addEventListener("pointerleave",()=>el.style.transform="")});

const lb=$("#lightbox"),lbImg=lb?.querySelector("img"),lbCap=lb?.querySelector("figcaption");let current=0,items=[];
function openLB(el){items=$$(".image-trigger").filter(x=>x.querySelector("img"));current=items.indexOf(el);if(current<0)current=0;showLB();lb.classList.add("open");lb.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function showLB(){const el=items[current],img=el?.querySelector("img");if(!img)return;lbImg.src=img.src;lbImg.alt=img.alt;lbCap.textContent=el.dataset.caption||img.alt}
$$(".image-trigger").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();el.classList.remove("clicked");void el.offsetWidth;el.classList.add("clicked");setTimeout(()=>openLB(el),260)}));
$(".lightbox-close")?.addEventListener("click",()=>{lb.classList.remove("open");lb.setAttribute("aria-hidden","true");document.body.style.overflow=""});
$(".lightbox-prev")?.addEventListener("click",()=>{current=(current-1+items.length)%items.length;showLB()});
$(".lightbox-next")?.addEventListener("click",()=>{current=(current+1)%items.length;showLB()});
lb?.addEventListener("click",e=>{if(e.target===lb) $(".lightbox-close").click()});
addEventListener("keydown",e=>{if(!lb?.classList.contains("open"))return;if(e.key==="Escape")$(".lightbox-close").click();if(e.key==="ArrowLeft")$(".lightbox-prev").click();if(e.key==="ArrowRight")$(".lightbox-next").click()});

$$("img").forEach(img=>img.addEventListener("error",()=>img.closest(".gallery-card,.idol-card,.feature-image")?.classList.add("asset-missing")));
