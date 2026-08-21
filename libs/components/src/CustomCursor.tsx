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
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);
  const hovering = useRef(false);
  const pressing = useRef(false);
  const grabbing = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    if (shouldUseCustomCursor()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!ringEl || !dotEl) return;

    const setCursorState = () => {
      ringEl.dataset.hover = hovering.current ? "true" : "false";
      ringEl.dataset.press = pressing.current ? "true" : "false";
      ringEl.dataset.grab = grabbing.current ? "true" : "false";
      ringEl.style.opacity = visible.current ? "1" : "0";
      dotEl.style.opacity = visible.current ? "1" : "0";
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

    const onDocumentOut = (event: MouseEvent) => {
      const next = event.relatedTarget;
      if (next && next instanceof Node && document.documentElement.contains(next)) return;
      visible.current = false;
      setCursorState();
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      visible.current = true;
      moveTo(event.clientX, event.clientY);
      setCursorState();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const ringLerp = reducedMotion ? 1 : hovering.current ? 0.24 : 0.18;
      const dotLerp = reducedMotion ? 1 : 0.42;
      const dotScale = pressing.current ? 0.75 : 1;

      ring.current.x += (target.current.x - ring.current.x) * ringLerp;
      ring.current.y += (target.current.y - ring.current.y) * ringLerp;
      dot.current.x += (target.current.x - dot.current.x) * dotLerp;
      dot.current.y += (target.current.y - dot.current.y) * dotLerp;

      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      dotEl.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseout", onDocumentOut);
    document.documentElement.addEventListener("pointerenter", onPointerEnter, { passive: true });

    visible.current = true;
    setCursorState();

    return () => {
      root.classList.remove("custom-cursor-active");
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseout", onDocumentOut);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return createPortal(
    <>
      <div ref={ringRef} className="site-cursor-ring" aria-hidden />
      <div ref={dotRef} className="site-cursor-dot" aria-hidden />
    </>,
    document.body,
  );
}
