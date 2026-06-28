import Link from "next/link";
import { LyftLogo } from "@/components/LyftLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProjects, site } from "@/lib/content";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <div className="theme-neutral flex min-h-full flex-col">
      <SiteHeader theme="neutral" />

      <main className="mx-auto w-full max-w-[920px] flex-1 px-6 pb-20 pt-16">
        {/* Hero */}
        <section>
          <p className="mb-3 font-mono text-sm text-claude-accent">{site.eyebrow}</p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-[1.15] tracking-tight">
            {site.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LyftLogo className="h-[22px] w-auto" />
            <span className="text-sm font-medium text-claude-muted">{site.tagline}</span>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-claude-muted">{site.lede}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {site.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-claude-border bg-claude-surface px-3 py-1 text-xs text-claude-muted"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {site.heroButtons.map((button) =>
              button.primary ? (
                <Link
                  key={button.href}
                  href={button.href}
                  className="rounded-full bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b85638]"
                >
                  {button.label}
                </Link>
              ) : (
                <Link
                  key={button.href}
                  href={button.href}
                  className="rounded-full border border-claude-border bg-claude-surface px-5 py-2.5 text-sm font-medium text-claude-text transition hover:-translate-y-px"
                >
                  {button.label}
                </Link>
              ),
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {site.social.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-claude-muted underline-offset-4 transition hover:text-claude-accent hover:underline"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-14">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-claude-accent">
            At Lyft
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {site.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-claude-border bg-claude-surface p-5"
              >
                <div
                  className={`font-mono text-2xl ${stat.value === "TBD" ? "text-claude-muted" : "text-claude-accent"}`}
                >
                  {stat.value}
                </div>
                <p className="mt-1 text-sm font-medium text-claude-text">{stat.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-claude-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured work */}
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight">Selected work</h2>
              <p className="mt-1 text-sm text-claude-muted">
                Silver, teens, and international expansion at Lyft.
              </p>
            </div>
            <Link
              href="/projects"
              className="shrink-0 text-sm text-claude-accent transition hover:underline"
            >
              All projects →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={
                  project.caseStudy
                    ? `/projects/${project.slug}`
                    : project.toolUrl ?? "/projects"
                }
                className="group rounded-2xl border border-claude-border bg-claude-surface p-5 transition hover:border-claude-accent"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-claude-accent">
                  {project.category}
                </p>
                <h3 className="mt-2 font-serif text-base font-semibold group-hover:text-claude-accent">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-claude-muted">
                  {project.description}
                </p>
                {project.caseStudy ? (
                  <p className="mt-3 text-xs font-medium text-claude-accent">Read case study →</p>
                ) : project.toolUrl ? (
                  <p className="mt-3 text-xs font-medium text-claude-accent">Open tool →</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter theme="neutral" />
    </div>
  );
}
