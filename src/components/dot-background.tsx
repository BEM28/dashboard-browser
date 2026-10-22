"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DOT_GRID = "[background-size:20px_20px]";

// How far (px) the grid drifts when the pointer is at the edge of the screen.
// The dot layers are oversized by `inset-16` (4rem = 64px) so they never show a gap.
const DRIFT = 48;

export function DotBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // The grid and the spotlight follow the pointer by writing CSS variables
  // directly, so moving the mouse never re-renders React.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // pointer (spotlight) and grid offset (drift): current value + target
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let driftX = 0;
    let driftY = 0;
    let targetDriftX = 0;
    let targetDriftY = 0;
    let seen = false;
    let frame = 0;

    const paint = () => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--ox", `${driftX}px`);
      el.style.setProperty("--oy", `${driftY}px`);
    };

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      driftX += (targetDriftX - driftX) * 0.07;
      driftY += (targetDriftY - driftY) * 0.07;
      paint();
      const settled =
        Math.abs(targetX - x) < 0.1 &&
        Math.abs(targetY - y) < 0.1 &&
        Math.abs(targetDriftX - driftX) < 0.05 &&
        Math.abs(targetDriftY - driftY) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.setProperty("--active", "1");

      if (!seen) {
        // First move: put the spotlight under the pointer instead of sweeping in.
        seen = true;
        x = targetX;
        y = targetY;
      }

      if (!smooth) {
        x = targetX;
        y = targetY;
        paint();
        return;
      }

      // Same direction as the pointer: -DRIFT at the left/top edge, +DRIFT at the right/bottom.
      targetDriftX = (targetX / window.innerWidth - 0.5) * 2 * DRIFT;
      targetDriftY = (targetY / window.innerHeight - 0.5) * 2 * DRIFT;
      start();
    };

    const onLeave = () => {
      el.style.setProperty("--active", "0");
      // Ease the grid back to rest when the pointer leaves the window.
      targetDriftX = 0;
      targetDriftY = 0;
      if (smooth) start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-black",
        className,
      )}
      style={
        { "--mx": "0px", "--my": "0px", "--ox": "0px", "--oy": "0px", "--active": 0 } as React.CSSProperties
      }
    >
      {/* Base dot grid: drifts with the pointer */}
      <div
        className={cn(
          "absolute -inset-16 will-change-transform [transform:translate3d(var(--ox),var(--oy),0)]",
          DOT_GRID,
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient to give a faded look towards the edges */}
      <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      {/* Soft glow under the cursor */}
      <div
        className={cn(
          "absolute inset-0 opacity-[var(--active)] transition-opacity duration-300",
          "[background-image:radial-gradient(circle_260px_at_var(--mx)_var(--my),rgba(0,0,0,0.05),transparent)]",
          "dark:[background-image:radial-gradient(circle_260px_at_var(--mx)_var(--my),rgba(255,255,255,0.07),transparent)]",
        )}
      />
      {/* Same grid, darker dots, revealed only around the cursor.
          It drifts with the base grid, so its mask centre is corrected for the
          drift and for the layer's -4rem inset to stay under the pointer. */}
      <div
        className={cn(
          "absolute -inset-16 opacity-[var(--active)] transition-opacity duration-300 will-change-transform [transform:translate3d(var(--ox),var(--oy),0)]",
          DOT_GRID,
          "[background-image:radial-gradient(#525252_1.5px,transparent_1.5px)]",
          "dark:[background-image:radial-gradient(#d4d4d4_1.5px,transparent_1.5px)]",
          "[mask-image:radial-gradient(circle_170px_at_calc(var(--mx)-var(--ox)+4rem)_calc(var(--my)-var(--oy)+4rem),black,transparent)]",
        )}
      />
    </div>
  );
}
