"use client";

import { useEffect, useRef } from "react";

// Looks like a URL (has a dot, no spaces) -> open it directly.
const URL_LIKE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

function resolveTarget(query: string) {
  if (URL_LIKE.test(query)) {
    return /^https?:\/\//i.test(query) ? query : `https://${query}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.matches("input, textarea, [contenteditable]");
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const query = inputRef.current?.value.trim();
        if (!query) return;
        window.location.assign(resolveTarget(query));
      }}
      className="group flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-neutral-200 bg-white/80 px-4 shadow-sm backdrop-blur transition focus-within:border-neutral-400 focus-within:shadow-md dark:border-neutral-800 dark:bg-neutral-950/80 dark:focus-within:border-neutral-600"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="size-4 shrink-0 text-neutral-400"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        name="q"
        autoComplete="off"
        spellCheck={false}
        placeholder="Cari di Google atau ketik alamat web"
        aria-label="Cari"
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
      />
      <kbd className="hidden rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[11px] text-neutral-400 sm:block dark:border-neutral-800">
        /
      </kbd>
    </form>
  );
}
