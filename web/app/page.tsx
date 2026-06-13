import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="theme-neutral flex min-h-full flex-col">
      <SiteHeader theme="neutral" />
      <main className="mx-auto w-full max-w-[920px] flex-1 px-6 pb-16 pt-16">
        <p className="mb-4 font-mono text-sm text-claude-accent">{site.tagline}</p>
        <h1 className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-[1.15] tracking-tight">
          {site.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-claude-muted">{site.lede}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {site.stack.map((item, index) => (
            <span
              key={item}
              className={
                index === 0
                  ? "rounded-full border border-claude-accent-soft bg-claude-accent-soft px-3 py-1 text-xs text-claude-accent"
                  : "rounded-full border border-claude-border bg-claude-surface px-3 py-1 text-xs text-claude-muted"
              }
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-full bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b85638]"
          >
            View work
          </Link>
          <Link
            href="/writing"
            className="rounded-full border border-claude-border bg-claude-surface px-5 py-2.5 text-sm font-medium text-claude-text transition hover:-translate-y-px"
          >
            Read writing
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {site.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-claude-border bg-claude-surface p-5"
            >
              <div className="font-mono text-xl text-claude-accent">{stat.value}</div>
              <p className="mt-1 text-xs text-claude-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter theme="neutral" />
    </div>
  );
}
