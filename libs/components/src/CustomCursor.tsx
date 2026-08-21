import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="link"], label, summary, .chip, .btn-primary, .btn-ghost, .btn-resume, a.card, input[type="checkbox"], input[type="radio"], select, [data-cursor="pointer"]';

const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [contenteditable="true"]';

const GRAB_SELECTOR = ".skill-sphere, [data-cursor='grab']";

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest(TEXT_INPUT_SELECTOR)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

function isGrabTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(GRAB_SELECTOR));
}

function shouldUseCustomCursor() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const glow = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldUseCustomCursor()) setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let disposed = false;
    let frame: number | null = null;
    const hovering = { current: false };
    const pressing = { current: false };
    const grabbing = { current: false };
    const visible = { current: true };

    const boot = () => {
      const glowEl = glowRef.current;
      const shadowEl = shadowRef.current;
      if (!glowEl || !shadowEl) {
        if (!disposed) requestAnimationFrame(boot);
        return;
      }

      const root = document.documentElement;
      root.classList.add("custom-cursor-active");

      const setCursorState = () => {
        const state = hovering.current ? "hover" : pressing.current ? "press" : grabbing.current ? "grab" : "default";
        glowEl.dataset.state = state;
        shadowEl.dataset.state = state;
        const opacity = visible.current ? "1" : "0";
        glowEl.style.opacity = opacity;
        shadowEl.style.opacity = opacity;
      };

      const moveTo = (x: number, y: number) => {
        target.current = { x, y };
        visible.current = true;
        setCursorState();
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        moveTo(event.clientX, event.clientY);
        hovering.current = isInteractiveTarget(event.target);
        grabbing.current = pressing.current && isGrabTarget(event.target);
        setCursorState();
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pressing.current = true;
        grabbing.current = isGrabTarget(event.target);
        setCursorState();
      };

      const onPointerUp = () => {
        pressing.current = false;
        grabbing.current = false;
        setCursorState();
      };

      const onWindowLeave = () => {
        visible.current = false;
        setCursorState();
      };

      const onWindowEnter = (event: MouseEvent) => {
        visible.current = true;
        moveTo(event.clientX, event.clientY);
      };

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tick = () => {
        const glowLerp = reducedMotion ? 1 : hovering.current ? 0.32 : 0.26;
        const trailLerp = reducedMotion ? 1 : hovering.current ? 0.14 : 0.1;
        const trailOffsetX = pressing.current ? 2 : 5;
        const trailOffsetY = pressing.current ? 3 : 9;

        glow.current.x += (target.current.x - glow.current.x) * glowLerp;
        glow.current.y += (target.current.y - glow.current.y) * glowLerp;
        trail.current.x += (target.current.x + trailOffsetX - trail.current.x) * trailLerp;
        trail.current.y += (target.current.y + trailOffsetY - trail.current.y) * trailLerp;

        glowEl.style.transform = `translate3d(${glow.current.x}px, ${glow.current.y}px, 0) translate(-50%, -50%)`;
        shadowEl.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0) translate(-50%, -50%)`;

        frame = window.requestAnimationFrame(tick);
      };

      frame = window.requestAnimationFrame(tick);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onWindowLeave);
      document.documentElement.addEventListener("mouseenter", onWindowEnter);

      setCursorState();

      cleanup = () => {
        root.classList.remove("custom-cursor-active");
        if (frame !== null) window.cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener("mouseleave", onWindowLeave);
        document.documentElement.removeEventListener("mouseenter", onWindowEnter);
      };
    };

    let cleanup: (() => void) | undefined;
    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div ref={shadowRef} className="site-cursor-shadow" aria-hidden />
      <div ref={glowRef} className="site-cursor-glow" aria-hidden />
    </>,
    document.body,
  );
}
