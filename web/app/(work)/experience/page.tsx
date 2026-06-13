import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-claude-accent">
        Professional journey
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
        Experience
      </h1>
      <p className="mt-3 mb-10 max-w-lg text-claude-muted">
        Backend systems across ride-sharing, geospatial platforms, and healthcare, with a focus on
        APIs, reliability, and measurable impact.
      </p>
      <ExperienceTimeline />
    </main>
  );
}
