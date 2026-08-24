import { Link } from "@tanstack/react-router"
import { DaysGoneBackdrop } from "@/components/days-in-canada/DaysGoneBackdrop"
import type { Project } from "@/lib/content"

function DaysGoneCardSurface() {
  const steps = 4

  return (
    <div
      className="project-card-days-gone-surface days-gone-app pointer-events-none absolute inset-0 flex flex-col"
      aria-hidden
    >
      <div className="days-gone-band relative h-[4.25rem] shrink-0 overflow-hidden border-b border-claude-border">
        <DaysGoneBackdrop />
        <div className="relative z-10 flex h-full items-center justify-between gap-3 px-3.5 sm:px-4">
          <div className="min-w-0">
            <p className="truncate font-mono text-[8px] tracking-[0.1em] text-claude-accent uppercase sm:text-[9px]">
              Free · Private · Browser-only
            </p>
            <p className="truncate font-sans text-xs font-bold tracking-[0.1em] text-claude-text uppercase sm:text-sm">
              Days Gone
            </p>
          </div>
          <ol className="flex shrink-0 items-center gap-1">
            {Array.from({ length: steps }, (_, i) => (
              <li key={i}>
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-semibold sm:h-[1.125rem] sm:w-[1.125rem] sm:text-[9px] ${
                    i === 0
                      ? "bg-claude-accent text-[var(--dg-band-text)]"
                      : "border border-claude-border bg-transparent text-claude-muted"
                  }`}
                >
                  {i + 1}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export function ProjectGridCard({ project }: { project: Project }) {
  const isPersonal = project.type === "personal"
  const hasTheme = project.cardTheme === "days-gone"

  const baseClass = "border-border bg-card hover:border-primary"

  const className = `group relative block overflow-hidden rounded-xl border transition-[border-color] duration-300 ${
    hasTheme ? "project-card-days-gone border-border" : baseClass
  }`

  const inner = (
    <>
      {hasTheme ? (
        <>
          <div
            className="project-card-days-gone-base pointer-events-none absolute inset-0 bg-[#fffdfb]"
            aria-hidden
          />
          <DaysGoneCardSurface />
        </>
      ) : null}

      <div
        className={`project-card-content relative z-10 flex flex-col p-4 transition-[padding] duration-300 sm:p-5 ${
          hasTheme
            ? "group-hover:pt-[5.25rem] group-focus-visible:pt-[5.25rem]"
            : ""
        }`}
      >
        <p className="project-card-category truncate text-xs font-semibold tracking-wider text-primary uppercase">
          {project.category}
        </p>
        <h3
          className={`project-card-title mt-2 line-clamp-2 font-sans text-base font-semibold ${
            isPersonal ? "text-foreground" : "font-serif"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground ${hasTheme ? "group-hover:mt-0 group-focus-visible:mt-0" : ""}`}
        >
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="project-card-tag rounded-full bg-secondary px-2 py-0.5 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.caseStudy ? (
          <p className="mt-4 text-xs font-medium text-primary">
            Read case study →
          </p>
        ) : project.toolUrl ? (
          <p className="mt-4 text-xs font-medium text-primary">Open tool →</p>
        ) : null}
      </div>
    </>
  )

  if (project.caseStudy) {
    return (
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className={className}
      >
        {inner}
      </Link>
    )
  }

  if (project.toolUrl === "/days-gone") {
    return (
      <Link to="/days-gone" className={className}>
        {inner}
      </Link>
    )
  }

  return (
    <Link to="/projects" className={className}>
      {inner}
    </Link>
  )
}
