import { LyftLogo } from "@/components/LyftLogo"
import type { Project } from "@/lib/content"

export function getProjectCompany(
  project: Project
): "lyft" | "skywatch" | "ge" | undefined {
  if (
    project.category.includes("Lyft") ||
    project.slug.startsWith("lyft-") ||
    project.slug === "ai-engineering"
  ) {
    return "lyft"
  }
  if (
    project.category.includes("SkyWatch") ||
    project.slug.includes("skywatch")
  ) {
    return "skywatch"
  }
  if (project.slug.startsWith("ge-")) {
    return "ge"
  }
}

export function ProjectCompanyLogo({
  project,
  className = "h-3.5 w-auto",
}: {
  project: Project
  className?: string
}) {
  const company = getProjectCompany(project)
  if (company === "lyft") {
    return <LyftLogo className={className} />
  }
  if (company === "skywatch") {
    return (
      <img
        src="/logos/skywatch.svg"
        alt="SkyWatch"
        className={`${className} rounded-sm`}
        width={72}
        height={18}
      />
    )
  }
  if (company === "ge") {
    const geSize = className.includes("h-5") ? "h-8 w-8" : "h-7 w-7"
    return (
      <img
        src="/logos/ge.png"
        alt="GE"
        className={`${geSize} rounded-full`}
        width={32}
        height={32}
      />
    )
  }
  return null
}

export function ProjectTitleAddon({
  project,
  className = "h-3.5 w-auto",
}: {
  project: Project
  className?: string
}) {
  if (project.type === "personal") {
    return (
      <span className="font-sans text-sm font-normal text-muted-foreground">
        | Personal project
      </span>
    )
  }
  return <ProjectCompanyLogo project={project} className={className} />
}
