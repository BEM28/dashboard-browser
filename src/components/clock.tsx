"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Whole seconds, so the snapshot is stable between ticks.
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

const pad = (n: number) => String(n).padStart(2, "0");

export function Clock() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = seconds === null ? null : new Date(seconds * 1000);

  return (
    <div className="shrink-0 text-right leading-none">
      <p className="font-mono text-2xl font-medium tabular-nums tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
        {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--"}
        <span className="ml-1 text-sm text-neutral-400 sm:text-lg dark:text-neutral-500">
          {now ? pad(now.getSeconds()) : "--"}
        </span>
      </p>
      <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
        {now
          ? now.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : " "}
      </p>
    </div>
  );
}
