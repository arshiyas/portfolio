import { createFileRoute } from "@tanstack/react-router"
import { PageTrail } from "@/components/PageTrail"
import { ProjectGrid } from "@/components/ProjectGrid"

export const Route = createFileRoute("/_work/projects/")({
  head: () => ({
    meta: [{ title: "Projects | Arshiya Sayyed" }],
  }),
  component: WorkPage,
})

export function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <PageTrail items={[{ label: "Home", to: "/" }]} />
      <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
        Projects
      </h1>
      <p className="mt-3 mb-10 max-w-lg text-muted-foreground">
        Backend case studies from production systems, plus space for personal
        experiments.
      </p>
      <ProjectGrid />
    </main>
  )
}
