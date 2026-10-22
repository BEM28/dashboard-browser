"use client";

import { DEFAULT_NAME, NAME_KEY } from "@/lib/profile";
import { useHydrated } from "@/lib/use-hydrated";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

export function Greeting() {
  const [name] = useLocalStorage(NAME_KEY, DEFAULT_NAME);
  const hydrated = useHydrated();

  return (
    <h1
      className={cn(
        "min-w-0 truncate bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text pb-1 text-xl font-bold tracking-tight text-transparent transition-opacity duration-200 sm:text-3xl dark:from-neutral-100 dark:to-neutral-500",
        // Hold back until the saved name is read, so the default never flashes.
        hydrated ? "opacity-100" : "opacity-0",
      )}
    >
      Hi, {name}
    </h1>
  );
}
