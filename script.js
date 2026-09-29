const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];


/* =========================================================
   COSMIC STARFIELD
   ========================================================= */

const starCanvas = $("#stars");
const ctx = starCanvas?.getContext("2d");

let stars = [];

function resizeStars() {
  if (!starCanvas) return;

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  starCanvas.width = innerWidth * dpr;
  starCanvas.height = innerHeight * dpr;

  starCanvas.style.width =
    innerWidth + "px";

  starCanvas.style.height =
    innerHeight + "px";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  stars = Array.from(
    {
      length: Math.min(
        220,
        Math.max(
          120,
          Math.floor(
            (innerWidth * innerHeight) / 7000
          )
        )
      )
    },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.7 + 0.15,
      s: Math.random() * 0.25 + 0.03,
      drift: (Math.random() - 0.5) * 0.06,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed:
        Math.random() * 0.025 + 0.008
    })
  );
}

function drawStars() {
  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );

  for (const star of stars) {

    star.y += star.s;
    star.x += star.drift;

    star.twinkle += star.twinkleSpeed;

    const alpha =
      star.a +
      Math.sin(star.twinkle) * 0.20;

    if (star.y > innerHeight + 4) {
      star.y = -4;
      star.x = Math.random() * innerWidth;
    }

    if (star.x < -4) {
      star.x = innerWidth + 4;
    }

    if (star.x > innerWidth + 4) {
      star.x = -4;
    }

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.r,
      0,
      Math.PI * 2
    );

    ctx.globalAlpha =
      Math.max(0.08, alpha);

    ctx.fillStyle =
      "#ffffff";

    ctx.fill();

    if (star.r > 1.05) {

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.r * 3.5,
        0,
        Math.PI * 2
      );

      ctx.globalAlpha =
        Math.max(
          0.01,
          alpha * 0.06
        );

      ctx.fillStyle =
        "#54a9ff";

      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;

  requestAnimationFrame(
    drawStars
  );
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

const glow =
  $(".cursor-glow");

addEventListener(
  "pointermove",
  (e) => {

    if (!glow) return;

    glow.style.left =
      e.clientX + "px";

    glow.style.top =
      e.clientY + "px";

  }
);


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menu =
  $(".menu-toggle");

const nav =
  $(".nav");

menu?.addEventListener(
  "click",
  () => {

    const open =
      nav.classList.toggle(
        "open"
      );

    menu.setAttribute(
      "aria-expanded",
      open
    );

  }
);


$$(".nav a").forEach(
  (link) => {

    link.addEventListener(
      "click",
      () => {

        nav?.classList.remove(
          "open"
        );

        menu?.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  }
);


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


$$(".reveal").forEach(
  (element) => {

    observer.observe(
      element
    );

  }
);


/* =========================================================
   3D TILT
   ========================================================= */

$$(".tilt").forEach(
  (element) => {

    element.addEventListener(
      "pointermove",
      (e) => {

        if (
          innerWidth < 800
        ) return;

        const rect =
          element.getBoundingClientRect();

        const x =
          (e.clientX -
            rect.left) /
            rect.width -
          0.5;

        const y =
          (e.clientY -
            rect.top) /
            rect.height -
          0.5;

        element.style.transform =
          `perspective(900px)
           rotateX(${y * -5}deg)
           rotateY(${x * 6}deg)
           translateY(-3px)`;

      }
    );


    element.addEventListener(
      "pointerleave",
      () => {

        element.style.transform =
          "";

      }
    );

  }
);


/* =========================================================
   LIGHTBOX
   ========================================================= */

const lb =
  $("#lightbox");

const lbImg =
  lb?.querySelector(
    "img"
  );

const lbCap =
  lb?.querySelector(
    "figcaption"
  );

let current = 0;

let items = [];


function openLB(element) {

  items =
    $$(".image-trigger")
      .filter(
        (item) =>
          item.querySelector(
            "img"
          )
      );

  current =
    items.indexOf(
      element
    );

  if (current < 0) {
    current = 0;
  }

  showLB();

  lb?.classList.add(
    "open"
  );

  lb?.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";
}


function showLB() {

  const element =
    items[current];

  const image =
    element?.querySelector(
      "img"
    );

  if (
    !image ||
    !lbImg
  ) return;

  lbImg.src =
    image.src;

  lbImg.alt =
    image.alt;

  if (lbCap) {

    lbCap.textContent =
      element.dataset.caption ||
      image.alt;

  }
}


$$(".image-trigger").forEach(
  (element) => {

    element.addEventListener(
      "click",
      (e) => {

        e.preventDefault();

        element.classList.remove(
          "clicked"
        );

        void element.offsetWidth;

        element.classList.add(
          "clicked"
        );

        setTimeout(
          () => {
            openLB(element);
          },
          260
        );

      }
    );

  }
);


$(".lightbox-close")
  ?.addEventListener(
    "click",
    () => {

      lb?.classList.remove(
        "open"
      );

      lb?.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.style.overflow =
        "";

    }
  );


$(".lightbox-prev")
  ?.addEventListener(
    "click",
    () => {

      if (!items.length)
        return;

      current =
        (current - 1 +
          items.length) %
        items.length;

      showLB();

    }
  );


$(".lightbox-next")
  ?.addEventListener(
    "click",
    () => {

      if (!items.length)
        return;

      current =
        (current + 1) %
        items.length;

      showLB();

    }
  );


lb?.addEventListener(
  "click",
  (e) => {

    if (
      e.target === lb
    ) {

      $(".lightbox-close")
        ?.click();

    }

  }
);


addEventListener(
  "keydown",
  (e) => {

    if (
      !lb?.classList.contains(
        "open"
      )
    ) {
      return;
    }

    if (
      e.key === "Escape"
    ) {

      $(".lightbox-close")
        ?.click();

    }

    if (
      e.key === "ArrowLeft"
    ) {

      $(".lightbox-prev")
        ?.click();

    }

    if (
      e.key === "ArrowRight"
    ) {

      $(".lightbox-next")
        ?.click();

    }

  }
);


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

$$("img").forEach(
  (img) => {

    img.addEventListener(
      "error",
      () => {

        img
          .closest(
            ".gallery-card, .idol-card, .feature-image"
          )
          ?.classList.add(
            "asset-missing"
          );

      }
    );

  }
);


/* =========================================================
   ABOUT PORTRAIT
   COSMIC INTERACTION
   ========================================================= */

const aboutPortrait =
  document.querySelector(
    ".about-photo-frame"
  );


if (aboutPortrait) {


  /* -------------------------------------------------------
     3D MOUSE MOVEMENT
  ------------------------------------------------------- */

  aboutPortrait.addEventListener(
    "pointermove",
    (e) => {

      if (
        innerWidth < 800
      ) return;

      const rect =
        aboutPortrait.getBoundingClientRect();

      const x =
        (e.clientX -
          rect.left) /
          rect.width -
        0.5;

      const y =
        (e.clientY -
          rect.top) /
          rect.height -
        0.5;

      aboutPortrait.style.transform =
        `perspective(1000px)
         rotateX(${y * -4}deg)
         rotateY(${x * 5}deg)
         translateY(-3px)`;

    }
  );


  /* -------------------------------------------------------
     RESET 3D EFFECT
  ------------------------------------------------------- */

  aboutPortrait.addEventListener(
    "pointerleave",
    () => {

      aboutPortrait.style.transform =
        "";

    }
  );


  /* -------------------------------------------------------
     BLUE + RED ENERGY BURST
  ------------------------------------------------------- */

  aboutPortrait.addEventListener(
    "click",
    () => {

      aboutPortrait.classList.remove(
        "energy-burst"
      );

      /*
       * Force browser to restart
       * the CSS animation.
       */

      void aboutPortrait.offsetWidth;

      aboutPortrait.classList.add(
        "energy-burst"
      );


      setTimeout(
        () => {

          aboutPortrait.classList.remove(
            "energy-burst"
          );

        },
        800
      );

    }
  );


  /* -------------------------------------------------------
     CLICK RIPPLE
  ------------------------------------------------------- */

  aboutPortrait.addEventListener(
    "pointerdown",
    (e) => {

      const rect =
        aboutPortrait.getBoundingClientRect();

      const ripple =
        document.createElement(
          "span"
        );

      ripple.className =
        "about-click-ripple";

      ripple.style.left =
        `${e.clientX - rect.left}px`;

      ripple.style.top =
        `${e.clientY - rect.top}px`;

      aboutPortrait.appendChild(
        ripple
      );


      setTimeout(
        () => {

          ripple.remove();

        },
        900
      );

    }
  );

}


/* =========================================================
   ABOUT PORTRAIT IMAGE LOAD
   ========================================================= */

const aboutImage =
  document.querySelector(
    ".about-photo-frame > img"
  );


if (aboutImage) {

  if (
    aboutImage.complete
  ) {

    aboutImage.classList.add(
      "image-loaded"
    );

  } else {

    aboutImage.addEventListener(
      "load",
      () => {

        aboutImage.classList.add(
          "image-loaded"
        );

      }
    );

  }

}


/* =========================================================
   ABOUT PORTRAIT PARALLAX
   IMPORTANT:
   Uses UNIQUE ABOUT classes.
   Does NOT touch .orbit-a / .orbit-b.
   ========================================================= */

const aboutPhoto =
  document.querySelector(
    ".about-photo"
  );


if (aboutPhoto) {

  addEventListener(
    "pointermove",
    (e) => {

      if (
        innerWidth < 800
      ) return;

      const x =
        e.clientX /
          innerWidth -
        0.5;

      const y =
        e.clientY /
          innerHeight -
        0.5;

      const blueOrbit =
        aboutPhoto.querySelector(
          ".about-orbit-blue"
        );

      const redOrbit =
        aboutPhoto.querySelector(
          ".about-orbit-red"
        );


      if (blueOrbit) {

        blueOrbit.style.marginLeft =
          `${x * 8}px`;

        blueOrbit.style.marginTop =
          `${y * 5}px`;

      }


      if (redOrbit) {

        redOrbit.style.marginLeft =
          `${x * -6}px`;

        redOrbit.style.marginTop =
          `${y * -4}px`;

      }

    }
  );

}


/* =========================================================
   REDUCE MOTION
   ========================================================= */

const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


if (
  reduceMotion.matches
) {

  document.documentElement.classList.add(
    "reduced-motion"
  );

}