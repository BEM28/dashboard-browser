"use client";

import { useState } from "react";
import { cn, newId } from "@/lib/utils";
import { useLocalStorage } from "@/lib/use-local-storage";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "bev:todos";
const NO_TODOS: Todo[] = [];

export function TodoList({ className }: { className?: string }) {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, NO_TODOS);
  const [draft, setDraft] = useState("");

  const doneCount = todos.filter((t) => t.done).length;

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [{ id: newId(), text, done: false }, ...prev]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  return (
    <section
      aria-label="Todo list"
      className={cn(
        "flex max-h-full min-h-0 flex-col rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80",
        className,
      )}
    >
      <header className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Todo
        </h2>
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-mono tabular-nums">
            {doneCount}/{todos.length}
          </span>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={clearDone}
              className="rounded underline-offset-2 transition-colors hover:text-neutral-900 hover:underline dark:hover:text-neutral-100"
            >
              Hapus selesai
            </button>
          )}
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mb-3 flex shrink-0 gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tambah tugas…"
          aria-label="Tugas baru"
          maxLength={120}
          className="h-9 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-transparent px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-9 shrink-0 rounded-lg bg-neutral-900 px-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          Tambah
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="py-4 text-center text-xs text-neutral-400">
          Belum ada tugas. Semua beres.
        </p>
      ) : (
        <ul className="-mr-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <input
                id={`todo-${todo.id}`}
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                className="size-4 shrink-0 cursor-pointer accent-neutral-900 dark:accent-neutral-100"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "min-w-0 flex-1 cursor-pointer truncate text-sm text-neutral-800 dark:text-neutral-200",
                  todo.done && "text-neutral-400 line-through dark:text-neutral-600",
                )}
                title={todo.text}
              >
                {todo.text}
              </label>
              <button
                type="button"
                onClick={() => remove(todo.id)}
                aria-label={`Hapus ${todo.text}`}
                className="rounded p-0.5 text-neutral-400 opacity-0 transition hover:text-neutral-900 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 dark:hover:text-neutral-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-3.5"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
