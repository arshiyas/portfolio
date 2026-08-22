import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HomeHero } from "@/components/HomeHero"
import { SiteFooter } from "@/components/SiteFooter"
import { getFeaturedProjects } from "@/lib/content"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Arshiya Sayyed | Software Engineer" }],
  }),
  component: HomePage,
})

function HomePage() {
  const featuredProjects = getFeaturedProjects()

  return (
    <div className="theme-neutral flex min-h-full flex-col">
      <main className="site-content-safe mx-auto w-full max-w-[920px] flex-1 pb-20">
        <HomeHero />

        <div className="site-content-safe">
          <section className="relative z-[1] mt-8 sm:mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  Selected work
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lyft backend work across mobility products, plus Days Gone, a
                  personal citizenship tool.
                </p>
              </div>
              <Button
                asChild
                variant="link"
                className="h-auto shrink-0 px-0 text-primary"
              >
                <Link to="/projects">All projects →</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProjects.map((project) => {
                const card = (
                  <Card className="h-full border-border shadow-none transition hover:border-primary">
                    <CardHeader>
                      <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                        {project.category}
                      </p>
                      <CardTitle className="font-serif text-base group-hover:text-primary">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {project.caseStudy ? (
                        <p className="text-xs font-medium text-primary">
                          Read case study →
                        </p>
                      ) : project.toolUrl ? (
                        <p className="text-xs font-medium text-primary">
                          Open tool →
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                )

                if (project.caseStudy) {
                  return (
                    <Link
                      key={project.slug}
                      to="/projects/$slug"
                      params={{ slug: project.slug }}
                      className="group block"
                    >
                      {card}
                    </Link>
                  )
                }

                if (project.toolUrl === "/days-gone") {
                  return (
                    <Link
                      key={project.slug}
                      to="/days-gone"
                      className="group block"
                    >
                      {card}
                    </Link>
                  )
                }

                return (
                  <Link
                    key={project.slug}
                    to="/projects"
                    className="group block"
                  >
                    {card}
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
