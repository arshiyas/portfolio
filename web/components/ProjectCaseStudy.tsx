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

function isInternalUrl(url: string): boolean {
  return url.startsWith("/");
}

function CaseStudyActions({ project }: { project: Project }) {
  const { caseStudy } = project;
  if (!caseStudy) return null;
  if (!project.toolUrl && !(caseStudy.source && caseStudy.source.url !== project.toolUrl)) return null;

  const isPersonal = project.type === "personal";

  return (
    <section className="flex flex-wrap items-center gap-3">
      {project.toolUrl ? (
        <Link
          href={project.toolUrl}
          className={
            isPersonal
              ? "inline-flex rounded-full bg-playful-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              : "inline-flex rounded-full bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          }
        >
          {isPersonal ? "Try it yourself" : "Open live tool"}
        </Link>
      ) : null}
      {caseStudy.source && caseStudy.source.url !== project.toolUrl ? (
        isInternalUrl(caseStudy.source.url) ? (
          <Link
            href={caseStudy.source.url}
            className="text-sm text-claude-accent underline-offset-4 hover:underline"
          >
            {caseStudy.source.label} →
          </Link>
        ) : (
          <a
            href={caseStudy.source.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-claude-accent underline-offset-4 hover:underline"
          >
            {caseStudy.source.label} ↗
          </a>
        )
      ) : null}
    </section>
  );
}

function ToolPreviewFrame({ href, blurb }: { href: string; blurb?: string }) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-claude-border bg-claude-surface shadow-sm transition hover:border-claude-accent/30"
    >
      <div className="flex items-center gap-2 border-b border-claude-border bg-[#f3f0ea] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8e4dc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8e4dc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8e4dc]" />
        <span className="ml-2 truncate font-mono text-[11px] text-claude-muted">days-in-canada</span>
      </div>
      <div className="bg-claude-bg px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-xs space-y-4">
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full ${n === 1 ? "bg-claude-accent" : "bg-claude-border"}`}
              />
            ))}
          </div>
          <p className="font-serif text-lg font-semibold text-claude-text">Days in Canada</p>
          <p className="text-xs leading-relaxed text-claude-muted">
            {blurb ?? "Paste travel history, review parsed trips, count days outside Canada."}
          </p>
          <span className="inline-flex rounded-lg bg-claude-accent px-3 py-1.5 text-xs font-medium text-white">
            Open live tool →
          </span>
        </div>
      </div>
    </Link>
  );
}

function PersonalProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { caseStudy } = project;
  if (!caseStudy) return null;

  const storyParagraphs = (caseStudy.story ?? "").split("\n\n").filter(Boolean);

  return (
    <article>
      <Link
        href="/projects"
        className="mb-8 inline-block text-sm text-claude-muted transition hover:text-claude-accent"
      >
        ← Projects
      </Link>

      {caseStudy.metaLine ? (
        <p className="font-mono text-xs uppercase tracking-widest text-claude-muted">{caseStudy.metaLine}</p>
      ) : null}

      <header className="mt-3 max-w-3xl">
        <h1 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-claude-text">
          {project.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-claude-muted">{caseStudy.overview}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-claude-border bg-claude-surface px-2.5 py-1 font-mono text-xs text-claude-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {project.toolUrl ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-start">
          <ToolPreviewFrame href={project.toolUrl} blurb={caseStudy.toolPreviewBlurb} />
          <div className="flex flex-col justify-center gap-4 lg:py-4">
            <p className="text-sm leading-relaxed text-claude-muted">
              {caseStudy.toolPreviewBlurb ??
                "Four-step wizard: key dates, paste or add trips, fill missing returns, review totals for IRCC."}
            </p>
            <Link
              href={project.toolUrl}
              className="inline-flex w-fit items-center rounded-lg bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b55638]"
            >
              Open Days in Canada
            </Link>
          </div>
        </div>
      ) : null}

      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl font-semibold text-claude-text">
          {caseStudy.contextTitle ?? "Why I built this"}
        </h2>
        <p className="mt-4 text-base leading-[1.75] text-claude-text">{caseStudy.problem}</p>
        {storyParagraphs.length > 0 ? (
          <div className="mt-6 space-y-4">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base leading-[1.75] text-claude-muted">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </section>

      {caseStudy.sections?.map((section) => (
        <section key={section.title} className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">{section.title}</h2>
          <div className="mt-6 space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base leading-[1.75] text-claude-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {caseStudy.pipeline && caseStudy.pipeline.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">
            {caseStudy.pipelineTitle ?? "How it works"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-claude-muted">
            {caseStudy.pipelineIntro ??
              "Four stages from scattered travel records to a row-by-row list for IRCC."}
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {caseStudy.pipeline.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-claude-border bg-claude-surface p-5"
              >
                <p className="font-mono text-xs font-semibold text-claude-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-medium text-claude-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-claude-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {caseStudy.featureItems && caseStudy.featureItems.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">Key features</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {caseStudy.featureItems.map((feature) => (
              <li
                key={feature.title}
                className="rounded-xl border border-claude-border bg-claude-surface p-5"
              >
                <h3 className="font-medium text-claude-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-claude-muted">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {caseStudy.techStack && caseStudy.techStack.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">Tech stack</h2>
          <div className="mt-8 space-y-6">
            {caseStudy.techStack.map((group) => (
              <div key={group.category}>
                <p className="font-mono text-xs uppercase tracking-widest text-claude-muted">
                  {group.category}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-claude-border bg-[#f3f0ea] px-2.5 py-1 text-xs text-claude-text"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {caseStudy.underTheHood ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">Under the hood</h2>
          <p className="mt-4 text-base leading-[1.75] text-claude-muted">{caseStudy.underTheHood}</p>
        </section>
      ) : null}

      {caseStudy.learnings && caseStudy.learnings.length > 0 ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-claude-text">What I learned</h2>
          <ul className="mt-6 space-y-4">
            {caseStudy.learnings.map((item) => (
              <li key={item.slice(0, 40)} className="flex gap-3 text-sm leading-relaxed text-claude-muted">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-claude-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.toolUrl ? (
        <section className="mt-16 rounded-xl border border-claude-border bg-[#f3f0ea] px-6 py-8 sm:px-8">
          <h2 className="font-serif text-xl font-semibold text-claude-text">Try it yourself</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-claude-muted">
            Free and local-only. Built for citizenship applicants reconstructing travel dates from email
            and exports.
          </p>
          <Link
            href={project.toolUrl}
            className="mt-5 inline-flex rounded-lg bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b55638]"
          >
            Open Days in Canada
          </Link>
        </section>
      ) : null}

      <footer className="mt-12 border-t border-claude-border pt-8">
        <Link href="/projects" className="text-sm text-claude-muted transition hover:text-claude-accent">
          ← All projects
        </Link>
      </footer>
    </article>
  );
}

function WorkProjectCaseStudy({ project }: ProjectCaseStudyProps) {
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

      {caseStudy.stats && caseStudy.stats.length > 0 ? (
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
      ) : null}

      <section className="relative">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-claude-border sm:left-[22px]"
        />
        <div className="space-y-8">
          <Step number="01" title="The problem">
            <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.problem}</p>
          </Step>

          {caseStudy.approach ? (
            <Step number="02" title="Approach">
              <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.approach}</p>
            </Step>
          ) : null}

          {caseStudy.myContribution ? (
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

                {caseStudy.myContribution.media && caseStudy.myContribution.media.length > 0 ? (
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
                ) : null}
              </div>
            </Step>
          ) : null}

          {caseStudy.features && caseStudy.features.length > 0 ? (
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
          ) : null}
        </div>
      </section>

      <CaseStudyActions project={project} />

      <Link
        href="/projects"
        className="inline-block text-sm text-claude-accent transition hover:underline"
      >
        ← All projects
      </Link>
    </article>
  );
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  if (project.type === "personal") {
    return <PersonalProjectCaseStudy project={project} />;
  }
  return <WorkProjectCaseStudy project={project} />;
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
