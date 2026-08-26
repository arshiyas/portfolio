import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import { getListedProjects } from "@/lib/content"

export function ProjectGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {getListedProjects().map((project) => (
        <FeaturedProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
