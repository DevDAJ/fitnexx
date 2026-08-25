import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-end border-b border-border/80 px-4 py-3 sm:px-6">
        <ModeToggle />
      </header>
      <main className="flex-1 p-4 sm:px-6">
        This is a app page for Fitnexx.
      </main>
    </div>
  );
}
