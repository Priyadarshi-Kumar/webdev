import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number; z: number };

function uniqueSkills(skills: string[]) {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const skill of skills) {
    const label = skill.replace(" CSS", "").replace(" (Cache, IndexedDB)", "");
    if (label.length > 16 || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels.slice(0, 24);
}

function fibonacciSphere(count: number): Point[] {
  if (count === 0) return [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (2 * (index + 0.5)) / count;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    return {
      x: Math.cos(theta) * ring,
      y,
      z: Math.sin(theta) * ring,
    };
  });
}

function relaxOnSphere(points: Point[], iterations = 80): Point[] {
  const out = points.map((point) => ({ ...point }));
  const count = out.length;
  for (let step = 0; step < iterations; step += 1) {
    const force = out.map(() => ({ x: 0, y: 0, z: 0 }));
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        const dx = out[i].x - out[j].x;
        const dy = out[i].y - out[j].y;
        const dz = out[i].z - out[j].z;
        const inv = 0.018 / (dx * dx + dy * dy + dz * dz + 0.0008);
        force[i].x += dx * inv;
        force[i].y += dy * inv;
        force[i].z += dz * inv;
        force[j].x -= dx * inv;
        force[j].y -= dy * inv;
        force[j].z -= dz * inv;
      }
    }
    for (let i = 0; i < count; i += 1) {
      const x = out[i].x + force[i].x;
      const y = out[i].y + force[i].y;
      const z = out[i].z + force[i].z;
      const length = Math.hypot(x, y, z) || 1;
      out[i] = { x: x / length, y: y / length, z: z / length };
    }
  }
  return out;
}

function layoutSphere(labels: string[]) {
  const units = relaxOnSphere(fibonacciSphere(labels.length));
  const equatorFirst = units
    .map((_, index) => index)
    .sort((a, b) => Math.abs(units[a].y) - Math.abs(units[b].y));
  const byLength = [...labels].sort((a, b) => b.length - a.length);
  const placed = Array<string>(labels.length);
  equatorFirst.forEach((pointIndex, index) => {
    placed[pointIndex] = byLength[index] ?? "";
  });
  return { labels: placed, units };
}

function rotatePoint(point: Point, ax: number, ay: number): Point {
  const cosX = Math.cos(ax);
  const sinX = Math.sin(ax);
  const y = point.y * cosX - point.z * sinX;
  const z = point.y * sinX + point.z * cosX;
  const cosY = Math.cos(ay);
  const sinY = Math.sin(ay);
  return {
    x: point.x * cosY + z * sinY,
    y,
    z: -point.x * sinY + z * cosY,
  };
}

function scalePoint(point: Point, radius: number): Point {
  return { x: point.x * radius, y: point.y * radius, z: point.z * radius };
}

function placeTag(el: HTMLElement, point: Point, radius: number, glow: number) {
  const depth = (point.z + radius) / (2 * radius);
  const scale = 0.7 + depth * 0.5;
  el.style.transform = `translate(-50%, -50%) translate(${point.x}px, ${point.y}px) scale(${scale})`;
  el.style.opacity = String(Math.min(1, 0.18 + depth * 0.82 + glow));
  el.style.zIndex = String(Math.round(point.z + radius + 10));
  el.classList.toggle("is-front", depth > 0.58);
}

function radiusFromBox(width: number, height: number) {
  return Math.max(72, Math.min(width, height) / 2 - 36);
}

export function SkillSphere({ skills }: { skills: string[] }) {
  const packed = useMemo(() => layoutSphere(uniqueSkills(skills)), [skills]);
  const labels = packed.labels;
  const units = packed.units;
  const rootRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [radius, setRadius] = useState(160);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => setRadius(radiusFromBox(root.clientWidth, root.clientHeight));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || units.length === 0) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ax = -0.35;
    let ay = 0.55;
    let vx = 0;
    let vy = 0.0048;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;
    let visible = true;
    let liveRadius = radius;
    let glow = 0;

    const paint = () => {
      units.forEach((unit, index) => {
        const el = tagRefs.current[index];
        if (el) placeTag(el, scalePoint(rotatePoint(unit, ax, ay), liveRadius), liveRadius, glow);
      });
    };

    paint();
    if (motion.matches) return;

    const tick = () => {
      if (visible) {
        ay += vy;
        ax += vx;
        ax += (-0.35 - ax) * 0.03;
        vx *= 0.94;
        vy += (0.0048 - vy) * 0.04;
        glow += ((root.matches(":hover") ? 0.2 : 0) - glow) * 0.12;
        paint();
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      root.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      vy = dx * 0.005;
      vx = -dy * 0.005;
      ay += vy;
      ax += vx;
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    visibility.observe(root);

    const size = new ResizeObserver(() => {
      liveRadius = radiusFromBox(root.clientWidth, root.clientHeight);
    });
    size.observe(root);

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.cancelAnimationFrame(frame);
      visibility.disconnect();
      size.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, [units, radius]);

  if (labels.length === 0) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="skill-sphere group relative mx-auto ml-0 h-[min(16rem,62vw)] min-h-[14rem] w-full max-w-[34rem] overflow-hidden cursor-grab touch-none select-none self-stretch active:cursor-grabbing sm:h-[min(22rem,70vw)] sm:min-h-[18rem] lg:ml-auto lg:h-full lg:min-h-full lg:max-w-none lg:translate-x-4"
    >
      <div className="skill-core pointer-events-none absolute inset-[12%] rounded-full blur-2xl transition-transform duration-500 group-hover:scale-105" />
      <div className="skill-orbit pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] rounded-full" />
      <div className="skill-orbit skill-orbit-slow pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] rounded-full" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--theme-accent)] shadow-[0_0_18px_rgb(var(--theme-accent-rgb))]" />
      {labels.map((label, index) => {
        const point = scalePoint(rotatePoint(units[index] ?? { x: 0, y: 0, z: 0 }, -0.35, 0.55), radius);
        const depth = (point.z + radius) / (2 * radius);
        const scale = 0.7 + depth * 0.5;
        return (
          <span
            key={label}
            ref={(node) => {
              tagRefs.current[index] = node;
            }}
            className={`skill-tag absolute left-1/2 top-1/2 whitespace-nowrap px-2 py-0.5 font-display text-[11px] font-medium tracking-tight text-zinc-600 transition-[color,border-color,background-color,box-shadow] duration-300 group-hover:text-zinc-950 sm:px-2.5 sm:text-xs dark:text-zinc-300 dark:group-hover:text-white ${
              depth > 0.58 ? "is-front" : ""
            }`}
            style={{
              transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px) scale(${scale})`,
              opacity: 0.18 + depth * 0.82,
              zIndex: Math.round(point.z + radius + 10),
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
