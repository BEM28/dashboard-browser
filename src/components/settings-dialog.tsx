"use client";

import { useEffect, useRef, useState } from "react";
import {
  BOOKMARKS_KEY,
  MAX_BOOKMARKS,
  defaultBookmarks,
  labelFromUrl,
  normalizeUrl,
  type Bookmark,
} from "@/lib/bookmarks";
import { DEFAULT_NAME, MAX_NAME_LENGTH, NAME_KEY } from "@/lib/profile";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn, newId } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  GearIcon,
  PlusIcon,
} from "./icons";

const inputClass =
  "h-9 min-w-0 rounded-lg border border-neutral-200 bg-transparent px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 aria-invalid:border-red-500 dark:border-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-600 dark:aria-invalid:border-red-500";

const iconButtonClass =
  "flex size-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-neutral-900 dark:hover:text-neutral-100";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Pengaturan"
        title="Pengaturan"
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white/80 text-neutral-500 shadow-sm backdrop-blur transition hover:border-neutral-400 hover:text-neutral-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
      >
        <GearIcon className="size-5" />
      </button>
      {/* Mounted only while open, so the draft always starts from the saved values. */}
      {open && <SettingsDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SettingsDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listEndRef = useRef<HTMLLIElement>(null);
  const focusId = useRef<string | null>(null);

  const [savedName, setSavedName] = useLocalStorage(NAME_KEY, DEFAULT_NAME);
  const [savedBookmarks, setSavedBookmarks] = useLocalStorage(BOOKMARKS_KEY, defaultBookmarks);

  const [name, setName] = useState(savedName);
  const [rows, setRows] = useState<Bookmark[]>(savedBookmarks);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  const updateRow = (id: string, patch: Partial<Bookmark>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    if (invalid === id) {
      setInvalid(null);
      setError(null);
    }
  };

  const moveRow = (index: number, offset: -1 | 1) =>
    setRows((prev) => {
      const target = index + offset;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const addRow = () => {
    const id = newId();
    focusId.current = id;
    setRows((prev) => [...prev, { id, name: "", url: "" }]);
    requestAnimationFrame(() => listEndRef.current?.scrollIntoView({ block: "nearest" }));
  };

  const save = () => {
    const cleaned: Bookmark[] = [];
    for (const row of rows) {
      const rawName = row.name.trim();
      const rawUrl = row.url.trim();
      if (!rawName && !rawUrl) continue; // untouched blank row
      const url = normalizeUrl(rawUrl);
      if (!url) {
        setInvalid(row.id);
        setError(
          rawUrl
            ? `Alamat web "${rawUrl}" tidak valid.`
            : `Bookmark "${rawName}" belum punya alamat web.`,
        );
        return;
      }
      cleaned.push({ id: row.id, name: rawName || labelFromUrl(url), url });
    }

    setSavedName(name.trim() || DEFAULT_NAME);
    setSavedBookmarks(cleaned);
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="settings-title"
      className="m-auto max-h-[min(88dvh,42rem)] w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:flex dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <h2 id="settings-title" className="text-sm font-medium">
            Pengaturan
          </h2>
          <button type="button" onClick={close} aria-label="Tutup" className={iconButtonClass}>
            <CloseIcon className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <section>
            <label htmlFor="settings-name" className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Nama
            </label>
            <input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              placeholder={DEFAULT_NAME}
              autoComplete="off"
              className={cn(inputClass, "w-full")}
            />
          </section>

          <section>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Bookmark{" "}
                <span className="font-mono tabular-nums">
                  {rows.length}/{MAX_BOOKMARKS}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setRows(defaultBookmarks);
                  setInvalid(null);
                  setError(null);
                }}
                className="text-xs text-neutral-500 underline-offset-2 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Reset ke bawaan
              </button>
            </div>

            <ul className="space-y-2">
              {rows.map((row, index) => (
                <li key={row.id} className="flex items-start gap-1">
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row">
                    <input
                      ref={(el) => {
                        if (el && focusId.current === row.id) {
                          el.focus();
                          focusId.current = null;
                        }
                      }}
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.target.value })}
                      maxLength={24}
                      placeholder="Nama"
                      aria-label="Nama bookmark"
                      autoComplete="off"
                      className={cn(inputClass, "sm:w-32 sm:shrink-0")}
                    />
                    <input
                      value={row.url}
                      onChange={(e) => updateRow(row.id, { url: e.target.value })}
                      placeholder="contoh.com"
                      aria-label="Alamat web"
                      aria-invalid={invalid === row.id || undefined}
                      autoComplete="off"
                      spellCheck={false}
                      inputMode="url"
                      className={cn(inputClass, "sm:flex-1")}
                    />
                  </div>
                  <div className="flex shrink-0 items-center sm:h-9">
                    <button
                      type="button"
                      onClick={() => moveRow(index, -1)}
                      disabled={index === 0}
                      aria-label={`Naikkan ${row.name || "bookmark"}`}
                      className={iconButtonClass}
                    >
                      <ChevronUpIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRow(index, 1)}
                      disabled={index === rows.length - 1}
                      aria-label={`Turunkan ${row.name || "bookmark"}`}
                      className={iconButtonClass}
                    >
                      <ChevronDownIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label={`Hapus ${row.name || "bookmark"}`}
                      className={cn(iconButtonClass, "hover:text-red-600 dark:hover:text-red-400")}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
              <li ref={listEndRef} aria-hidden className="h-0" />
            </ul>

            {rows.length === 0 && (
              <p className="py-3 text-center text-xs text-neutral-400">Belum ada bookmark.</p>
            )}

            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= MAX_BOOKMARKS}
              className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
            >
              <PlusIcon className="size-3.5" />
              Tambah bookmark
            </button>
          </section>
        </div>

        <footer className="flex shrink-0 items-center gap-3 border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <p role="alert" className="min-w-0 flex-1 truncate text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
          <button
            type="button"
            onClick={close}
            className="h-9 shrink-0 rounded-lg px-3 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="h-9 shrink-0 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Simpan
          </button>
        </footer>
      </form>
    </dialog>
  );
}
