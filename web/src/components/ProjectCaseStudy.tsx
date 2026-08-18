import { Link, notFound } from "@tanstack/react-router";
import type { Project, ProjectCaseStudyFigure } from "@/lib/content";
import { getProjectBySlug, projects } from "@/lib/content";
import { DaysGoneBackdrop } from "@/components/days-in-canada/DaysGoneBackdrop";

function InternalPathLink({
  url,
  className,
  children,
}: {
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (url === "/days-gone") {
    return (
      <Link to="/days-gone" className={className}>
        {children}
      </Link>
    );
  }
  if (url === "/projects") {
    return (
      <Link to="/projects" className={className}>
        {children}
      </Link>
    );
  }
  if (url.startsWith("/projects/")) {
    const slug = url.slice("/projects/".length);
    return (
      <Link to="/projects/$slug" params={{ slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={url as "/"} className={className}>
      {children}
    </Link>
  );
}

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
        <InternalPathLink
          url={project.toolUrl}
          className={
            isPersonal
              ? "inline-flex rounded-full bg-playful-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              : "inline-flex rounded-full bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          }
        >
          {isPersonal ? "Try it yourself" : "Open live tool"}
        </InternalPathLink>
      ) : null}
      {caseStudy.source && caseStudy.source.url !== project.toolUrl ? (
        isInternalUrl(caseStudy.source.url) ? (
          <InternalPathLink
            url={caseStudy.source.url}
            className="text-sm text-claude-accent underline-offset-4 hover:underline"
          >
            {caseStudy.source.label} →
          </InternalPathLink>
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

function ToolPreviewFrame({ href }: { href: string }) {
  const steps = ["Start", "Your dates", "Add trips", "Results"];

  return (
    <div className="space-y-4">
      <div
        aria-hidden
        className="days-gone-app overflow-hidden rounded-xl border border-claude-border bg-claude-bg"
      >
        <div className="days-gone-band relative overflow-hidden border-b border-claude-border px-5 pb-5 pt-5 sm:px-6">
          <DaysGoneBackdrop />
          <p className="relative z-10 font-mono text-[11px] uppercase tracking-[0.12em] text-claude-accent">
            Free · Private · Browser-only
          </p>
          <p className="relative z-10 mt-2 font-sans text-xl font-bold uppercase tracking-[0.12em] text-claude-text">
            Days Gone
          </p>

          <ol className="mt-5 flex items-center">
            {steps.map((label, i) => (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                      i === 0
                        ? "bg-claude-accent text-[var(--dg-band-text)] ring-4 ring-claude-accent/15"
                        : "border border-claude-border bg-transparent text-claude-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`hidden text-[10px] sm:block ${
                      i === 0 ? "font-medium text-claude-text" : "text-claude-muted"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div className="mx-1.5 mb-5 h-px flex-1 bg-claude-border" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="mb-3 rounded-xl border border-[rgba(245,243,240,0.14)] bg-[var(--dg-panel)] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--dg-panel-text)]">Your data stays in this session</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--dg-panel-muted)]">
              No account. No server. Local only.
            </p>
          </div>
          <div className="space-y-2.5">
            <div className="rounded-xl border border-claude-border bg-claude-surface p-4">
              <p className="text-sm font-medium text-claude-text">Check my eligibility</p>
              <p className="mt-1 text-xs leading-relaxed text-claude-muted">
                Dates, absences, and 1,095-day math
              </p>
            </div>
            <div className="rounded-xl border border-claude-border bg-claude-surface p-4">
              <p className="text-sm font-medium text-claude-text">Parse travel dates only</p>
              <p className="mt-1 text-xs leading-relaxed text-claude-muted">
                Paste messy history, extract trips with on-device WebLLM
              </p>
            </div>
          </div>
        </div>
      </div>

      <InternalPathLink
        url={href}
        className="inline-flex rounded-lg bg-claude-accent px-5 py-2.5 text-sm font-medium text-[var(--dg-band-text)] transition hover:bg-[var(--dg-accent-hover)]"
      >
        Open tool
      </InternalPathLink>
    </div>
  );
}

function PersonalProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { caseStudy } = project;
  if (!caseStudy) return null;

  const storyParagraphs = (caseStudy.story ?? "").split("\n\n").filter(Boolean);

  return (
    <article>
      <Link
        to="/projects"
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
        <div className="mt-10 max-w-xl">
          <ToolPreviewFrame href={project.toolUrl} />
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
          {section.figure ? (
            <div className="mt-8">
              <CaseStudyFigure figure={section.figure} />
            </div>
          ) : null}
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
            Free and local-only. Optional WebLLM parsing runs in your browser over WebGPU; nothing
            uploads.
          </p>
          <InternalPathLink
            url={project.toolUrl}
            className="mt-5 inline-flex rounded-lg bg-claude-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b55638]"
          >
            Open Days Gone
          </InternalPathLink>
        </section>
      ) : null}

      <footer className="mt-12 border-t border-claude-border pt-8">
        <Link to="/projects" className="text-sm text-claude-muted transition hover:text-claude-accent">
          ← All projects
        </Link>
      </footer>
    </article>
  );
}

function CaseStudyFigure({ figure }: { figure: ProjectCaseStudyFigure }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-claude-border bg-claude-bg">
      {figure.kind === "link" ? (
        <a
          href={figure.src}
          target="_blank"
          rel="noreferrer"
          className="block bg-claude-surface px-5 py-5 transition hover:border-claude-accent sm:px-6"
        >
          <p className="font-medium text-claude-text">{figure.alt}</p>
          <p className="mt-2 text-sm text-claude-accent">View event on Luma ↗</p>
        </a>
      ) : figure.kind === "embed" ? (
        <div className="flex justify-center bg-claude-surface p-4">
          <iframe
            src={figure.src}
            title={figure.alt}
            height={figure.embedHeight ?? 897}
            width={figure.embedWidth ?? 504}
            className="max-w-full border-0"
            allowFullScreen
          />
        </div>
      ) : figure.kind === "video" || figure.src.endsWith(".mp4") ? (
        <video
          src={figure.src}
          autoPlay
          loop
          muted
          playsInline
          className="block w-full"
          aria-label={figure.alt}
        />
      ) : (
        <img src={figure.src} alt={figure.alt} className="block w-full" />
      )}
      {figure.caption || figure.credit ? (
        <figcaption className="border-t border-claude-border px-4 py-3 text-sm leading-relaxed text-claude-muted">
          {figure.caption}
          {figure.credit ? (
            <>
              {figure.caption ? " " : null}
              <span className="text-claude-muted">
                {figure.kind === "embed"
                  ? "Post by "
                  : figure.kind === "video" || figure.src.endsWith(".mp4")
                    ? "Recording from "
                    : "App screens from "}
                <a
                  href={figure.credit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-claude-accent underline-offset-4 hover:underline"
                >
                  {figure.credit.label}
                </a>
                .
              </span>
            </>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
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

      {caseStudy.figure ? (
        <section className="max-w-2xl">
          <CaseStudyFigure figure={caseStudy.figure} />
        </section>
      ) : null}

      {caseStudy.stats && caseStudy.stats.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-claude-muted">
            By the numbers
          </h2>
          <dl className="mt-4 border-t border-claude-border">
            {caseStudy.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 border-b border-claude-border py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="shrink-0 font-serif text-3xl font-semibold leading-none tracking-tight text-claude-accent sm:w-32">
                  {stat.value}
                </dt>
                <dd className="text-sm leading-relaxed text-claude-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="relative">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-claude-border sm:left-[22px]"
        />
        <div className="space-y-8">
          <Step number="01" title={caseStudy.problemTitle ?? "The problem"}>
            <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.problem}</p>
          </Step>

          {caseStudy.approach ? (
            <Step number="02" title={caseStudy.approachTitle ?? "Approach"}>
              <p className="text-sm leading-relaxed text-claude-muted">{caseStudy.approach}</p>
            </Step>
          ) : null}

          {caseStudy.myContribution ? (
            <Step number="03" title={caseStudy.contributionTitle ?? "My contribution"} highlight>
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
                      {item.link ? (
                        <a
                          href={item.link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm text-claude-accent underline-offset-4 hover:underline"
                        >
                          {item.link.label} ↗
                        </a>
                      ) : null}
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
            <Step number="04" title={caseStudy.featuresTitle ?? "What we built"}>
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
        to="/projects"
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
  if (!project?.caseStudy) {
    throw notFound();
  }
  return project;
}
