gsap.registerPlugin(ScrollTrigger);


/* =========================
   STORY TIMELINE
========================= */

const timeline = gsap.timeline({

    scrollTrigger: {

        trigger: ".story",

        start: "top top",

        end: "+=5000",

        scrub: 1,

        pin: ".story-content",

        anticipatePin: 1

    }

});


/* =========================
   START
========================= */

/* Image starts zoomed in */

timeline.fromTo(
    ".story-image",
    {
        scale: 1.4
    },
    {
        scale: 1,
        duration: 2
    }
);


/* Text enters */

timeline.fromTo(
    ".story-text",
    {
        opacity: 0,
        y: 100
    },
    {
        opacity: 1,
        y: 0,
        duration: 1
    }
);


/* =========================
   CHAPTER 01
========================= */

/* Move image dramatically */

timeline.to(
    ".image-container",
    {
        x: "-25vw",
        scale: 0.85,
        duration: 2
    }
);


/* Move text */

timeline.to(
    ".story-text",
    {
        x: "10vw",
        duration: 2
    },
    "<"
);


/* Fade everything */

timeline.to(
    ".story-text",
    {
        opacity: 0,
        y: -100,
        duration: 1
    }
);


/* =========================
   IMAGE TRANSITION
========================= */

/* Change image */

timeline.call(() => {

    document.querySelector(".story-image").src =
        "images/image2.jpg";

});


/* Bring image back */

timeline.fromTo(
    ".image-container",
    {
        x: "30vw",
        scale: 0.6,
        opacity: 0
    },
    {
        x: "0",
        scale: 1,
        opacity: 1,
        duration: 2
    }
);


/* =========================
   CHAPTER 02
========================= */

timeline.to(
    ".chapter",
    {
        textContent: "02 — THE CHANGE",
        duration: 0
    }
);

timeline.to(
    ".story-title",
    {
        textContent: "Everything begins to change.",
        duration: 0
    }
);

timeline.to(
    ".description",
    {
        textContent:
            "Nothing stays the same forever. The world begins to shift around us.",
        duration: 0
    }
);


/* Text enters again */

timeline.fromTo(
    ".story-text",
    {
        opacity: 0,
        x: -100
    },
    {
        opacity: 1,
        x: 0,
        duration: 1
    }
);


/* Image zoom */

timeline.to(
    ".story-image",
    {
        scale: 1.3,
        duration: 2
    }
);


/* =========================
   CHAPTER 03
========================= */

/* Move everything away */

timeline.to(
    ".story-text",
    {
        opacity: 0,
        x: 200,
        duration: 1
    }
);

timeline.to(
    ".image-container",
    {
        scale: 0.7,
        x: "-30vw",
        duration: 2
    }
);


/* Change image */

timeline.call(() => {

    document.querySelector(".story-image").src =
        "images/image3.jpg";

});


/* New image */

timeline.fromTo(
    ".image-container",
    {
        scale: 1.8,
        x: "30vw",
        opacity: 0
    },
    {
        scale: 1,
        x: "0",
        opacity: 1,
        duration: 2
    }
);


/* =========================
   FINAL TEXT
========================= */

timeline.to(
    ".chapter",
    {
        textContent: "03 — THE END",
        duration: 0
    }
);

timeline.to(
    ".story-title",
    {
        textContent: "And then, everything changed.",
        duration: 0
    }
);

timeline.to(
    ".description",
    {
        textContent:
            "Every ending leaves something behind. And sometimes, that is where another story begins.",
        duration: 0
    }
);


timeline.fromTo(
    ".story-text",
    {
        opacity: 0,
        y: 100
    },
    {
        opacity: 1,
        y: 0,
        duration: 1
    }
);


/* Final dramatic zoom */

timeline.to(
    ".story-image",
    {
        scale: 1.5,
        duration: 2
    }
);