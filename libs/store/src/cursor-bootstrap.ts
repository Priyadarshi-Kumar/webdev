/** Runs in <head> before React hydrates so the shadow cursor is visible immediately. */
export const CURSOR_BOOTSTRAP = `(function(){
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (document.getElementById("site-cursor-root")) return;

  function start() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", start, { once: true });
      return;
    }

    var root = document.createElement("div");
    root.id = "site-cursor-root";

    var shadow = document.createElement("div");
    shadow.className = "site-cursor-shadow";

    var glow = document.createElement("div");
    glow.className = "site-cursor-glow";

    root.appendChild(shadow);
    root.appendChild(glow);
    document.body.appendChild(root);
    document.documentElement.classList.add("custom-cursor-active");

    var target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var glowPos = { x: target.x, y: target.y };
    var shadowPos = { x: target.x, y: target.y };
    var hovering = false;
    var pressing = false;
    var visible = true;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var interactive =
      'a,button,[role="button"],[role="link"],label,summary,.chip,.btn-primary,.btn-ghost,.btn-resume,a.card,input[type="checkbox"],input[type="radio"],select,[data-cursor="pointer"]';

    function isInteractive(node) {
      if (!(node instanceof Element)) return false;
      return Boolean(node.closest(interactive));
    }

    function applyState() {
      var state = pressing ? "press" : hovering ? "hover" : "default";
      shadow.dataset.state = state;
      glow.dataset.state = state;
      var opacity = visible ? "1" : "0";
      shadow.style.opacity = opacity;
      glow.style.opacity = opacity;
    }

    function tick() {
      var glowLerp = reduced ? 1 : hovering ? 0.42 : 0.32;
      var shadowLerp = reduced ? 1 : hovering ? 0.22 : 0.16;

      glowPos.x += (target.x - glowPos.x) * glowLerp;
      glowPos.y += (target.y - glowPos.y) * glowLerp;
      shadowPos.x += (target.x - shadowPos.x) * shadowLerp;
      shadowPos.y += (target.y - shadowPos.y) * shadowLerp;

      glow.style.transform = "translate3d(" + glowPos.x + "px," + glowPos.y + "px,0) translate(-50%,-50%)";
      shadow.style.transform = "translate3d(" + shadowPos.x + "px," + shadowPos.y + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(tick);
    }

    function onMove(event) {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;
      hovering = isInteractive(event.target);
      applyState();
    }

    function onDown(event) {
      if (event.pointerType !== "mouse") return;
      pressing = true;
      applyState();
    }

    function onUp() {
      pressing = false;
      applyState();
    }

    function onLeave() {
      visible = false;
      applyState();
    }

    function onEnter(event) {
      visible = true;
      target.x = event.clientX;
      target.y = event.clientY;
      applyState();
    }

    window.requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    glow.style.transform = "translate3d(" + glowPos.x + "px," + glowPos.y + "px,0) translate(-50%,-50%)";
    shadow.style.transform = "translate3d(" + shadowPos.x + "px," + shadowPos.y + "px,0) translate(-50%,-50%)";
    applyState();
  }

  start();
})();`;
