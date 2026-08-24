import { Link } from "@tanstack/react-router"
import { LyftLogo } from "@/components/LyftLogo"
import type { Project } from "@/lib/content"
import { cn } from "@/lib/utils"

function LetterMark({ label, letters }: { label: string; letters: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex size-16 items-center justify-center rounded-xl bg-secondary font-sans text-sm font-semibold tracking-wide text-primary"
    >
      {letters}
    </div>
  )
}

function ProjectMark({ project }: { project: Project }) {
  if (project.slug === "days-gone" || project.cardTheme === "days-gone") {
    return (
      <img
        src="/logos/days-gone.svg"
        alt="Days Gone"
        width={64}
        height={64}
        className="size-16 rounded-xl"
      />
    )
  }

  if (
    project.category.includes("Lyft") ||
    project.slug.startsWith("lyft-") ||
    project.slug === "ai-engineering"
  ) {
    return (
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-secondary px-1.5">
        <LyftLogo className="h-8 w-auto" />
      </div>
    )
  }

  if (
    project.category.includes("SkyWatch") ||
    project.slug.includes("skywatch")
  ) {
    return (
      <div className="size-16 overflow-hidden rounded-xl bg-[#212b35]">
        <img
          src="/logos/skywatch.svg"
          alt="SkyWatch"
          width={64}
          height={64}
          className="size-full object-cover"
        />
      </div>
    )
  }

  if (project.slug.startsWith("ge-") || project.title.includes("@ GE")) {
    return (
      <img
        src="/logos/ge.png"
        alt="GE"
        width={64}
        height={64}
        className="size-16 rounded-xl object-cover"
      />
    )
  }

  return <LetterMark label={project.title} letters="P" />
}

export function FeaturedProjectCard({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  const isPersonal = project.type === "personal"
  const cardClass = cn(
    "group flex h-full w-full items-center gap-3 rounded-xl border border-border bg-card p-5 transition-[border-color] duration-300 hover:border-primary",
    className
  )

  const inner = (
    <>
      <div className="shrink-0">
        <ProjectMark project={project} />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-base font-semibold ${
            isPersonal ? "font-sans text-foreground" : "font-serif"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
          {project.cardLine ?? project.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )

  if (project.caseStudy) {
    return (
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className={cardClass}
      >
        {inner}
      </Link>
    )
  }

  if (project.toolUrl === "/days-gone") {
    return (
      <Link to="/days-gone" className={cardClass}>
        {inner}
      </Link>
    )
  }

  return (
    <Link to="/projects" className={cardClass}>
      {inner}
    </Link>
  )
}
