import { createFileRoute } from "@tanstack/react-router"
import {
  ProjectCaseStudy,
  getProjectPageMetadata,
  resolveProjectPage,
} from "@/components/ProjectCaseStudy"

export const Route = createFileRoute("/_work/projects/$slug")({
  loader: ({ params }) => resolveProjectPage(params.slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project | Arshiya Sayyed" }] }
    }
    const meta = getProjectPageMetadata(loaderData.slug)
    return {
      meta: [
        { title: `${meta.title} | Arshiya Sayyed` },
        ...(meta.description
          ? [{ name: "description" as const, content: meta.description }]
          : []),
      ],
    }
  },
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData()

  return (
    <main className="site-page flex-1 py-14">
      <ProjectCaseStudy project={project} />
    </main>
  )
}
