import type { Metadata } from "next";
import { WritingList } from "@/components/WritingList";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-playful-purple">
        Essays &amp; notes
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
        Writing
      </h1>
      <p className="mt-3 mb-8 max-w-lg text-claude-muted">
        Engineering deep-dives and career reflections. Coming soon, layout ready.
      </p>

      <div className="mb-8 flex gap-2">
        <span className="rounded-full bg-[#f3ecfb] px-3 py-1.5 text-sm font-medium text-playful-purple">
          Engineering
        </span>
        <span className="rounded-full bg-[#fdeee8] px-3 py-1.5 text-sm font-medium text-playful-coral">
          Career
        </span>
      </div>

      <WritingList />
    </main>
  );
}
