gsap.registerPlugin(ScrollTrigger);


/* =========================
   MAIN STORY ANIMATION
========================= */

let timeline = gsap.timeline({

    scrollTrigger: {

        trigger: ".story",

        start: "top top",

        end: "+=3000",

        scrub: true,

        pin: ".story-content",

    }

});


/* IMAGE ZOOMS */

timeline.to(".story-image", {

    scale: 1,

    duration: 1

});


/* IMAGE MOVES */

timeline.to(".image-container", {

    x: 150,

    duration: 1

});


/* TEXT MOVES */

timeline.to(".story-text", {

    x: -100,

    duration: 1

});


/* TEXT FADES */

timeline.to(".story-text", {

    opacity: 0,

    duration: 1

});


/* IMAGE GETS BIGGER */

timeline.to(".image-container", {

    width: "100vw",

    height: "100vh",

    left: 0,

    duration: 1

});


/* IMAGE ZOOMS AGAIN */

timeline.to(".story-image", {

    scale: 1.3,

    duration: 1

});