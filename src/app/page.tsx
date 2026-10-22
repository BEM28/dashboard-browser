import { Bookmarks } from "@/components/bookmarks";
import { Clock } from "@/components/clock";
import { DotBackground } from "@/components/dot-background";
import { Greeting } from "@/components/greeting";
import { SearchBar } from "@/components/search-bar";
import { SettingsButton } from "@/components/settings-dialog";
import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <DotBackground />

      <div className="relative z-10 flex h-full flex-col gap-4 px-4 py-4 sm:px-8 sm:py-6">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <Greeting />
          <Clock />
        </header>

        {/* Stacked by default; side by side (split) on short landscape screens; 3 columns from xl. */}
        <main className="flex min-h-0 flex-1 flex-col gap-4 split:grid split:grid-cols-[minmax(0,1fr)_20rem] split:gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)] xl:gap-8">
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 sm:gap-8 split:col-start-1 xl:col-start-2">
            <div className="flex w-full shrink-0 items-center gap-2">
              <SearchBar />
              <SettingsButton />
            </div>
            <Bookmarks />
          </section>

          <div className="flex max-h-[45%] min-h-0 flex-col split:col-start-2 split:h-full split:max-h-none split:justify-end xl:col-start-3 xl:h-full xl:max-h-none xl:items-end xl:justify-end">
            <TodoList className="w-full split:max-h-[min(28rem,100%)] xl:max-h-[min(28rem,100%)] xl:max-w-80" />
          </div>
        </main>
      </div>
    </div>
  );
}
