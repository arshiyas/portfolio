import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-claude-accent">
        Selected work
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
        Projects
      </h1>
      <p className="mt-3 mb-10 max-w-lg text-claude-muted">
        Backend case studies from production systems, plus space for personal experiments.
      </p>
      <ProjectGrid />
    </main>
  );
}
