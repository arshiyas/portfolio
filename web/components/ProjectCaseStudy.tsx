import Link from "next/link";
import { notFound } from "next/navigation";
import type { Project } from "@/lib/content";
import { getProjectBySlug, projects } from "@/lib/content";

type ProjectCaseStudyProps = {
  project: Project;
};

type StepProps = {
  number: string;
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
};

function Step({ number, title, highlight = false, children }: StepProps) {
  return (
    <div className="relative flex gap-4 sm:gap-5">
      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs tabular-nums sm:h-11 sm:w-11 ${
          highlight
            ? "border-claude-accent bg-claude-accent text-white"
            : "border-claude-border bg-claude-bg text-claude-accent"
        }`}
      >
        {number}
      </div>
      <div className="min-w-0 flex-1 pt-1 sm:pt-2">
        <h2 className="font-serif text-lg font-semibold text-claude-text">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { caseStudy } = project;
  if (!caseStudy) return null;

  return (
    <article className="space-y-10">
      <header>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-claude-accent">
          {project.category}
        </p>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-claude-muted">
          {caseStudy.overview}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-claude-accent-soft px-3 py-1 text-xs text-claude-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {caseStudy.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-claude-border bg-claude-surface p-5"
          >
            <div className="font-mono text-xl text-claude-accent">{stat.value}</div>
            <p className="mt-2 text-sm leading-relaxed text-claude-muted">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="relative">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-claude-border sm:left-[22px]"
        />
        <div className="space-y-8">
          <Step number="01" title="The problem">
            <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.problem}</p>
          </Step>

          <Step number="02" title="Approach">
            <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.approach}</p>
          </Step>

          <Step number="03" title="My contribution" highlight>
            <div className="rounded-2xl border-l-4 border-claude-accent bg-claude-accent-soft/50 p-5 sm:p-6">
              <p className="max-w-2xl leading-relaxed text-claude-text">
                {caseStudy.myContribution.intro}
              </p>
              <ul className="mt-6 space-y-4">
                {caseStudy.myContribution.items.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-claude-border/80 bg-claude-surface px-4 py-4 shadow-sm"
                  >
                    <h3 className="font-serif text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-claude-muted">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>

              {caseStudy.myContribution.media && caseStudy.myContribution.media.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {caseStudy.myContribution.media.map((placeholder) => (
                    <figure
                      key={placeholder.id}
                      className="overflow-hidden rounded-xl border border-dashed border-claude-border bg-claude-surface"
                    >
                      <div className="flex aspect-[16/10] items-center justify-center bg-[#f3f0ea] px-4">
                        <p className="text-center text-xs text-claude-muted">Screenshot coming soon</p>
                      </div>
                      <figcaption className="border-t border-claude-border px-4 py-3 text-sm text-claude-muted">
                        {placeholder.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </Step>

          <Step number="04" title="What we built">
            <div className="grid gap-3 sm:grid-cols-2">
              {caseStudy.features.map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 rounded-xl border border-claude-border bg-claude-surface px-4 py-4"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-claude-accent"
                  />
                  <p className="text-sm leading-relaxed text-claude-muted">{feature}</p>
                </div>
              ))}
            </div>
          </Step>
        </div>
      </section>

      <section className="rounded-2xl border border-claude-border bg-[#f3f0ea] p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-claude-accent">Source</p>
        <a
          href={caseStudy.source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-claude-text underline-offset-4 hover:text-claude-accent hover:underline"
        >
          {caseStudy.source.label} ↗
        </a>
      </section>

      <Link
        href="/projects"
        className="inline-block text-sm text-claude-accent transition hover:underline"
      >
        ← All projects
      </Link>
    </article>
  );
}

export function generateProjectStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export function getProjectPageMetadata(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
  };
}

export function resolveProjectPage(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) notFound();
  return project;
}
