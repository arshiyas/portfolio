import { useState } from "react"
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import {
  getListedProjects,
  getUnavailableWriteupCopy,
  PROJECT_LIST_ID,
} from "@/lib/content"

export function ProjectGrid() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  function seeRecentWork() {
    setOpenSlug(null)
    document
      .getElementById(PROJECT_LIST_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div id={PROJECT_LIST_ID} className="grid gap-4 sm:grid-cols-2">
      {getListedProjects().map((project) => (
        <FeaturedProjectCard
          key={project.slug}
          project={project}
          onSelectUnavailable={
            getUnavailableWriteupCopy(project)
              ? () => setOpenSlug(project.slug)
              : undefined
          }
          unavailableOpen={openSlug === project.slug}
          onSeeRecentWork={seeRecentWork}
        />
      ))}
    </div>
  )
}
