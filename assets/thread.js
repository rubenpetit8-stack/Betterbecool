/* Plays the demo conversation instead of dumping it on screen.
 *
 * Reading a finished transcript is not the same as watching the thing work —
 * the pause between "missed call" and the reply is the entire pitch, and you
 * only feel it if it happens in front of you.
 *
 * Starts when the thread scrolls into view, runs once, and does nothing at all
 * if the visitor has asked for reduced motion (they get the whole thread
 * immediately, which is the honest fallback, not a degraded one).
 */
(function () {
  "use strict";

  var threads = document.querySelectorAll("[data-thread-play]");
  if (!threads.length) return;

  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !("IntersectionObserver" in window)) {
    threads.forEach(function (t) { t.classList.add("is-done"); });
    return;
  }

  threads.forEach(function (t) {
    t.classList.add("is-armed");
    t.querySelectorAll(".msg, .thread-meta").forEach(function (el, i) {
      el.style.setProperty("--i", i);
    });
  });

  /* Dropping is-armed first is what makes this safe: once it is gone the
     messages are visible by default, and the animation is decoration layered on
     top. If the animation never runs, the thread still reads. */
  function play(t) {
    if (t.classList.contains("is-playing")) return;
    t.classList.remove("is-armed");
    t.classList.add("is-playing");
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      play(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  threads.forEach(function (t) { io.observe(t); });

  /* Safety net. The thread is hidden the moment we arm it, so anything that
     stops the observer firing — an odd viewport, an embedded context, a browser
     quirk — would leave the whole demo invisible. Never risk that for an
     animation: if it has not played shortly after load, play it regardless. */
  setTimeout(function () { threads.forEach(play); }, 2500);
})();
