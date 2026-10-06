import React, { useEffect, useRef } from 'react';
import './index.css';

// The animated page background, ported from the ric project: a smoke plume drifting in
// from the bottom-right corner, behind the page's blocks, with small grey shards flying
// across the page over them. Two canvases, one per layer.

const SMOKE_SPAWN_PER_FRAME = 2;
const DUST_COUNT = 50;
const SMOKE_SPREAD = -2;
const SMOKE_ANGLE = 1;
const SMOKE_OPACITY = 0.03;
// A neutral mid grey: darkens the light theme and lightens the dark one alike.
const SMOKE_GREY = 128;
const SMOKE_SPEED = 1;
const SMOKE_SIZE = 1.5;
const SMOKE_GROWTH = 1.001;
const SMOKE_FADE = 0.08;
const DUST_MIN_SPEED = 1;
const DUST_MAX_SPEED = 5;
const DUST_MIN_SIZE = 1;
const DUST_MAX_SIZE = 3;
// Speeds above are per frame at 60fps; `step` scales them to the real frame time so the
// animation runs at the same pace on a 120Hz display.
const FRAME_MS = 1000 / 60;
// The page's phone layout (see App.css), which shows none of this: busy enough.
const PHONE_QUERY = '(max-width: 600px)';

interface Smoke {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface Shard {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  vertices: { x: number; y: number }[];
}

function newSmoke(width: number, height: number): Smoke {
  const angle = Math.random() * SMOKE_ANGLE - SMOKE_ANGLE / 2;
  const speed = SMOKE_SPREAD * SMOKE_SPEED * (Math.random() * 0.5 + 0.75);
  return {
    x: width + 100,
    y: height - 50,
    size: (Math.random() * 20 + 10) * SMOKE_SIZE,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    opacity: (Math.random() * 0.5 + 0.5) * SMOKE_OPACITY,
  };
}

// A rectangle, pentagon or hexagon with slightly uneven sides.
function shardVertices(size: number): { x: number; y: number }[] {
  const sides = [4, 5, 6][Math.floor(Math.random() * 3)];
  if (sides === 4) {
    const w = (size * (Math.random() * 0.5 + 0.75)) / 2;
    const h = (size * (Math.random() * 0.5 + 0.75)) / 2;
    return [
      { x: -w, y: -h },
      { x: w, y: -h },
      { x: w, y: h },
      { x: -w, y: h },
    ];
  }
  const angle = (Math.PI * 2) / sides;
  return Array.from({ length: sides }, (_, i) => {
    const radius = size * (Math.random() * 0.5 + 0.75);
    return { x: radius * Math.cos(angle * i), y: radius * Math.sin(angle * i) };
  });
}

function newShard(width: number, height: number): Shard {
  const size = Math.random() * (DUST_MAX_SIZE - DUST_MIN_SIZE) + DUST_MIN_SIZE;
  const speed = () =>
    (Math.random() * (DUST_MAX_SPEED - DUST_MIN_SPEED) + DUST_MIN_SPEED) * (size / DUST_MAX_SIZE);
  const grey = Math.floor(Math.random() * 256);
  return {
    x: Math.random() * width + width,
    y: Math.random() * height,
    size,
    speedX: -speed(),
    // Most shards also drift upwards; the rest fly level.
    speedY: Math.random() < 0.8 ? -speed() : 0,
    color: `rgba(${grey}, ${grey}, ${grey}, 0.8)`,
    vertices: shardVertices(size),
  };
}

export function Dust() {
  const smokeRef = useRef<HTMLCanvasElement>(null);
  const shardsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // A moving background is exactly what reduced motion asks to leave out.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = smokeRef.current;
    const ctx = canvas?.getContext('2d');
    const shardsCanvas = shardsRef.current;
    const shardsCtx = shardsCanvas?.getContext('2d');
    if (!canvas || !ctx || !shardsCanvas || !shardsCtx) return;

    const resize = () => {
      for (const c of [canvas, shardsCanvas]) {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // No initial batch: it all started at the same spot as one dense puff, so the
    // plume builds up from the steady spawn instead.
    let smoke: Smoke[] = [];
    const shards = Array.from({ length: DUST_COUNT }, () => newShard(canvas.width, canvas.height));
    let toSpawn = 0;
    let last = performance.now();
    let frame = 0;
    const phone = window.matchMedia(PHONE_QUERY);

    const animate = (now: number) => {
      // Capped so a long pause (a background tab) doesn't jump everything at once.
      const step = Math.min((now - last) / FRAME_MS, 3);
      last = now;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      shardsCtx.clearRect(0, 0, width, height);
      // Checked every frame, so turning a tablet to a phone-width layout clears it.
      if (phone.matches) {
        frame = requestAnimationFrame(animate);
        return;
      }

      for (const p of smoke) {
        p.x += p.speedX * step;
        p.y += p.speedY * step;
        p.size *= SMOKE_GROWTH ** step;
        p.opacity -= 0.01 * SMOKE_OPACITY * SMOKE_FADE * step;
        ctx.fillStyle = `rgba(${SMOKE_GREY}, ${SMOKE_GREY}, ${SMOKE_GREY}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      // Faded out, or carried past the left or top edge.
      smoke = smoke.filter((p) => p.opacity > 0 && p.x + p.size > 0 && p.y + p.size > 0);
      toSpawn += SMOKE_SPAWN_PER_FRAME * step;
      for (; toSpawn >= 1; toSpawn--) smoke.push(newSmoke(width, height));

      for (const s of shards) {
        s.x += s.speedX * step;
        s.y += s.speedY * step;
        if (s.x + s.size < 0) {
          s.x = width + s.size;
          s.y = Math.random() * height;
        }
        shardsCtx.fillStyle = s.color;
        shardsCtx.beginPath();
        shardsCtx.moveTo(s.x + s.vertices[0].x, s.y + s.vertices[0].y);
        for (const v of s.vertices.slice(1)) shardsCtx.lineTo(s.x + v.x, s.y + v.y);
        shardsCtx.closePath();
        shardsCtx.fill();
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas ref={smokeRef} className="ak-dust ak-dust-smoke" aria-hidden="true" />
      <canvas ref={shardsRef} className="ak-dust ak-dust-shards" aria-hidden="true" />
    </>
  );
}
