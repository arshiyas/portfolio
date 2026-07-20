import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectGridCard } from "@/components/ProjectGridCard"
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
                ? "rounded-full border-claude-accent-soft bg-claude-accent-soft text-claude-accent"
                : "rounded-full text-claude-muted"
            }
          >
            {value === "all" ? "All" : value === "work" ? "Work" : "Personal"}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectGridCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
