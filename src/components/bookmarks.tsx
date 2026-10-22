"use client";

import { useState } from "react";
import { BOOKMARKS_KEY, defaultBookmarks, type Bookmark } from "@/lib/bookmarks";
import { useHydrated } from "@/lib/use-hydrated";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

function BookmarkIcon({ name, url }: Bookmark) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-base font-medium text-neutral-500 dark:text-neutral-400">
        {name[0]}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`}
      alt=""
      width={24}
      height={24}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-6"
    />
  );
}

export function Bookmarks() {
  const [bookmarks] = useLocalStorage(BOOKMARKS_KEY, defaultBookmarks);
  const hydrated = useHydrated();

  return (
    <nav
      aria-label="Bookmark"
      // Many bookmarks on a short screen scroll inside the nav instead of pushing the page.
      className={cn(
        "-m-1 min-h-0 w-[calc(100%+0.5rem)] overflow-y-auto p-1 transition-opacity duration-200",
        hydrated ? "opacity-100" : "opacity-0",
      )}
    >
      {bookmarks.length === 0 ? (
        <p className="py-6 text-center text-xs text-neutral-400">
          Belum ada bookmark. Tambahkan lewat pengaturan.
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-4">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a
                href={bookmark.url}
                className="group flex flex-col items-center gap-2 rounded-xl p-1 outline-none"
              >
                <span className="flex size-12 items-center justify-center rounded-xl border border-neutral-200 bg-white/80 shadow-sm backdrop-blur transition duration-200 group-hover:-translate-y-0.5 group-hover:border-neutral-400 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-neutral-400 sm:size-14 dark:border-neutral-800 dark:bg-neutral-950/80 dark:group-hover:border-neutral-600">
                  <BookmarkIcon {...bookmark} />
                </span>
                <span className="max-w-full truncate text-xs text-neutral-600 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                  {bookmark.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
