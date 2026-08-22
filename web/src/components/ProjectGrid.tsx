import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import { projects, type ProjectType } from "@/lib/content"

type Filter = "all" | ProjectType

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("all")
  const filtered = projects.filter((p) => filter === "all" || p.type === filter)

  return (
    <>
      <div className="mb-6 flex gap-2">
        {(["all", "work", "personal"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={filter === value ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter(value)}
            className={
              filter === value
                ? "rounded-full border-secondary bg-secondary text-primary"
                : "rounded-full text-muted-foreground"
            }
          >
            {value === "all" ? "All" : value === "work" ? "Work" : "Personal"}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <FeaturedProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
