const $=(s,p=document)=>p.querySelector(s),
$$=(s,p=document)=>[...p.querySelectorAll(s)];


/* =========================================================
   COSMIC STARFIELD
========================================================= */

const starCanvas=$("#stars"),
ctx=starCanvas?.getContext("2d");

let stars=[];

function resizeStars(){

  if(!starCanvas)return;

  starCanvas.width=innerWidth*devicePixelRatio;
  starCanvas.height=innerHeight*devicePixelRatio;

  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );

  stars=Array.from(
    {
      length:Math.min(
        180,
        Math.floor(innerWidth/8)
      )
    },
    ()=>({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      r:Math.random()*1.4+.2,
      a:Math.random()*.7+.15,
      s:Math.random()*.25+.03
    })
  );

}


function drawStars(){

  if(!ctx)return;

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );

  for(const s of stars){

    s.y+=s.s;

    if(s.y>innerHeight){
      s.y=0;
    }

    ctx.globalAlpha=s.a;

    ctx.fillStyle="#fff";

    ctx.beginPath();

    ctx.arc(
      s.x,
      s.y,
      s.r,
      0,
      Math.PI*2
    );

    ctx.fill();

  }

  requestAnimationFrame(drawStars);

}


resizeStars();

drawStars();

addEventListener(
  "resize",
  resizeStars
);


/* =========================================================
   CURSOR GLOW
========================================================= */

const glow=$(".cursor-glow");

addEventListener(
  "pointermove",
  e=>{

    if(glow){

      glow.style.left=
        e.clientX+"px";

      glow.style.top=
        e.clientY+"px";

    }

  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const menu=$(".menu-toggle"),
nav=$(".nav");


menu?.addEventListener(
  "click",
  ()=>{

    const open=
      nav.classList.toggle("open");

    menu.setAttribute(
      "aria-expanded",
      open
    );

  }
);


$$(".nav a").forEach(
  a=>
    a.addEventListener(
      "click",
      ()=>nav.classList.remove("open")
    )
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer=
new IntersectionObserver(
  entries=>
    entries.forEach(
      e=>{

        if(e.isIntersecting){

          e.target.classList.add(
            "visible"
          );

          observer.unobserve(
            e.target
          );

        }

      }
    ),
  {
    threshold:.12
  }
);


$$(".reveal").forEach(
  e=>observer.observe(e)
);


/* =========================================================
   EXISTING TILT EFFECT
========================================================= */

$$(".tilt").forEach(
  el=>{

    el.addEventListener(
      "pointermove",
      e=>{

        if(innerWidth<800)return;

        const r=
          el.getBoundingClientRect();

        const x=
          (e.clientX-r.left)/
          r.width-
          .5;

        const y=
          (e.clientY-r.top)/
          r.height-
          .5;

        el.style.transform=
          `
          perspective(900px)
          rotateX(${y*-5}deg)
          rotateY(${x*6}deg)
          translateY(-3px)
          `;

      }
    );


    el.addEventListener(
      "pointerleave",
      ()=>el.style.transform=""
    );

  }
);


/* =========================================================
   ABOUT — COSMIC PORTRAIT
========================================================= */

const aboutPortrait=
  $(".about-photo-frame");

const aboutBlueOrbit=
  $(".about-orbit-blue");

const aboutRedOrbit=
  $(".about-orbit-red");


if(aboutPortrait){

  aboutPortrait.addEventListener(
    "pointermove",
    e=>{

      /*
       * Disable the stronger mouse effect
       * on small/mobile screens.
       */

      if(innerWidth<700)return;


      const rect=
        aboutPortrait.getBoundingClientRect();


      const x=
        (e.clientX-rect.left)/
        rect.width-
        .5;


      const y=
        (e.clientY-rect.top)/
        rect.height-
        .5;


      const rotateX=
        y*-7;


      const rotateY=
        x*7;


      /*
       * Main portrait floating
       * 3D movement
       */

      aboutPortrait.style.transform=
        `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        `;


      /*
       * Blue orbit reacts
       * in the opposite direction.
       */

      if(aboutBlueOrbit){

        aboutBlueOrbit.style.marginLeft=
          `${x*14}px`;

        aboutBlueOrbit.style.marginTop=
          `${y*9}px`;

      }


      /*
       * Red orbit reacts
       * in the opposite direction.
       */

      if(aboutRedOrbit){

        aboutRedOrbit.style.marginLeft=
          `${x*-12}px`;

        aboutRedOrbit.style.marginTop=
          `${y*-8}px`;

      }

    }
  );


  aboutPortrait.addEventListener(
    "pointerleave",
    ()=>{

      aboutPortrait.style.transform="";


      if(aboutBlueOrbit){

        aboutBlueOrbit.style.marginLeft="";

        aboutBlueOrbit.style.marginTop="";

      }


      if(aboutRedOrbit){

        aboutRedOrbit.style.marginLeft="";

        aboutRedOrbit.style.marginTop="";

      }

    }
  );

}


/* =========================================================
   ABOUT — PORTRAIT HOVER DEPTH
========================================================= */

const aboutImage=
  aboutPortrait?.querySelector("img");


if(aboutImage){

  aboutImage.addEventListener(
    "pointerenter",
    ()=>{

      aboutImage.style.filter=
        `
        brightness(1.07)
        contrast(1.04)
        saturate(1.08)
        `;

    }
  );


  aboutImage.addEventListener(
    "pointerleave",
    ()=>{

      aboutImage.style.filter="";

    }
  );

}


/* =========================================================
   LIGHTBOX
========================================================= */

const lb=$("#lightbox"),
lbImg=lb?.querySelector("img"),
lbCap=lb?.querySelector("figcaption");

let current=0,
items=[];


function openLB(el){

  items=
    $$(".image-trigger")
    .filter(
      x=>x.querySelector("img")
    );


  current=
    items.indexOf(el);


  if(current<0){
    current=0;
  }


  showLB();


  lb.classList.add(
    "open"
  );


  lb.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow=
    "hidden";

}


function showLB(){

  const el=
    items[current];

  const img=
    el?.querySelector("img");


  if(!img)return;


  lbImg.src=
    img.src;


  lbImg.alt=
    img.alt;


  lbCap.textContent=
    el.dataset.caption||
    img.alt;

}


/* =========================================================
   IMAGE CLICK EFFECT + LIGHTBOX
========================================================= */

$$(".image-trigger").forEach(
  el=>{

    el.addEventListener(
      "click",
      e=>{

        e.preventDefault();


        /*
         * Existing click animation.
         */

        el.classList.remove(
          "clicked"
        );


        void el.offsetWidth;


        el.classList.add(
          "clicked"
        );


        /*
         * Small delay gives the
         * click effect time to appear.
         */

        setTimeout(
          ()=>openLB(el),
          260
        );

      }
    );

  }
);


/* =========================================================
   LIGHTBOX CLOSE
========================================================= */

$(".lightbox-close")?.addEventListener(
  "click",
  ()=>{

    lb.classList.remove(
      "open"
    );


    lb.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow="";

  }
);


/* =========================================================
   LIGHTBOX PREVIOUS
========================================================= */

$(".lightbox-prev")?.addEventListener(
  "click",
  ()=>{

    if(!items.length)return;

    current=
      (
        current-
        1+
        items.length
      )%
      items.length;

    showLB();

  }
);


/* =========================================================
   LIGHTBOX NEXT
========================================================= */

$(".lightbox-next")?.addEventListener(
  "click",
  ()=>{

    if(!items.length)return;

    current=
      (
        current+
        1
      )%
      items.length;

    showLB();

  }
);


/* =========================================================
   CLOSE LIGHTBOX BY CLICKING OUTSIDE
========================================================= */

lb?.addEventListener(
  "click",
  e=>{

    if(e.target===lb){

      $(".lightbox-close").click();

    }

  }
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

addEventListener(
  "keydown",
  e=>{

    if(!lb?.classList.contains("open")){
      return;
    }


    if(e.key==="Escape"){

      $(".lightbox-close").click();

    }


    if(e.key==="ArrowLeft"){

      $(".lightbox-prev").click();

    }


    if(e.key==="ArrowRight"){

      $(".lightbox-next").click();

    }

  }
);


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

$$("img").forEach(
  img=>
    img.addEventListener(
      "error",
      ()=>{

        img
          .closest(
            ".gallery-card,.idol-card,.feature-image"
          )
          ?.classList.add(
            "asset-missing"
          );

      }
    )
);


/* =========================================================
   ABOUT — COSMIC CLICK RIPPLE
========================================================= */

if(aboutPortrait){

  aboutPortrait.addEventListener(
    "click",
    e=>{

      /*
       * Don't create another effect if
       * the existing .clicked animation
       * is already handling it.
       */

      const ripple=
        document.createElement("span");


      ripple.className=
        "about-cosmic-ripple";


      const rect=
        aboutPortrait.getBoundingClientRect();


      ripple.style.left=
        `${e.clientX-rect.left}px`;


      ripple.style.top=
        `${e.clientY-rect.top}px`;


      aboutPortrait.appendChild(
        ripple
      );


      setTimeout(
        ()=>{
          ripple.remove();
        },
        800
      );

    }
  );

}
