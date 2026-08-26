import { useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Link } from "@tanstack/react-router"
import { LyftLogo } from "@/components/LyftLogo"
import { Button } from "@/components/ui/button"
import {
  getUnavailableWriteupCopy,
  PROJECT_LIST_ID,
  type Project,
} from "@/lib/content"
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

function UnavailableWriteupToast({
  title,
  body,
  onSeeRecent,
}: {
  title: string
  body: string
  onSeeRecent: () => void
}) {
  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 sm:inset-x-0 sm:mx-auto sm:max-w-md"
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-5">
        <p className="font-serif text-lg font-semibold">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          {body}
        </p>
        <Button className="mt-4 h-11 w-full text-base" onClick={onSeeRecent}>
          See recent work
        </Button>
      </div>
    </div>
  )
}

export function FeaturedProjectCard({
  project,
  className,
  onSelectUnavailable,
  unavailableOpen,
  onSeeRecentWork,
}: {
  project: Project
  className?: string
  onSelectUnavailable?: () => void
  unavailableOpen?: boolean
  onSeeRecentWork?: () => void
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

  const copy = getUnavailableWriteupCopy(project)
  if (!copy) {
    return <div className={cardClass}>{inner}</div>
  }

  return (
    <UnavailableWriteupCard
      copy={copy}
      className={cardClass}
      onSelect={onSelectUnavailable}
      open={unavailableOpen}
      onSeeRecent={onSeeRecentWork}
    >
      {inner}
    </UnavailableWriteupCard>
  )
}

function UnavailableWriteupCard({
  copy,
  className,
  children,
  onSelect,
  open: openProp,
  onSeeRecent: onSeeRecentProp,
}: {
  copy: { title: string; body: string }
  className: string
  children: ReactNode
  onSelect?: () => void
  open?: boolean
  onSeeRecent?: () => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = onSelect !== undefined
  const open = isControlled ? Boolean(openProp) : internalOpen

  function handleOpen() {
    if (isControlled) onSelect()
    else setInternalOpen(true)
  }

  function seeRecentWork() {
    if (onSeeRecentProp) {
      onSeeRecentProp()
      return
    }
    setInternalOpen(false)
    document
      .getElementById(PROJECT_LIST_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <button
        type="button"
        className={cn(className, "cursor-pointer text-left")}
        onClick={handleOpen}
      >
        {children}
      </button>
      {open
        ? createPortal(
            <UnavailableWriteupToast
              title={copy.title}
              body={copy.body}
              onSeeRecent={seeRecentWork}
            />,
            document.body
          )
        : null}
    </>
  )
}
