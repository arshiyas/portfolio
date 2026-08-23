import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import { projects } from "@/lib/content"

export function ProjectGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <FeaturedProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
