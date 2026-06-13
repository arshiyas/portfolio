import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div
          className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-playful-purple to-playful-coral"
          aria-hidden
        />
        <div>
          <h1 className="font-serif text-3xl font-semibold">Hey, I&apos;m Arshiya</h1>
          <p className="text-claude-muted">Toronto · Penn State MS · Pune BE</p>
        </div>
      </div>

      <p className="max-w-xl text-[1.05rem] leading-relaxed">
        I&apos;m a backend engineer who loves shipping systems that actually get used — from hospital
        imaging pipelines to satellite data platforms to ride-sharing APIs used by millions.
      </p>
      <p className="mt-4 max-w-xl text-claude-muted">
        I care about clear architecture, measurable impact, and teams that move fast without
        breaking things. Always learning, always building.
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#f3ecfb] px-3 py-1.5 text-sm font-medium text-playful-purple">
          Healthcare
        </span>
        <span className="rounded-full bg-[#e8f5ee] px-3 py-1.5 text-sm font-medium text-[#3d7a55]">
          Geospatial
        </span>
        <span className="rounded-full bg-[#fdeee8] px-3 py-1.5 text-sm font-medium text-playful-coral">
          Mobility
        </span>
        <span className="rounded-full bg-[#fdf6e8] px-3 py-1.5 text-sm font-medium text-[#a67c2a]">
          Mentorship
        </span>
      </div>

      <div className="mt-6 rounded-[20px] border border-playful-border bg-playful-surface p-6">
        <h2 className="font-serif text-lg font-semibold">Beyond the resume</h2>
        <p className="mt-2 text-claude-muted">
          This is where the personal side lives — what you&apos;re reading, what you&apos;re learning,
          what you care about outside of sprint planning. We&apos;ll fill this in together.
        </p>
      </div>
    </main>
  );
}
