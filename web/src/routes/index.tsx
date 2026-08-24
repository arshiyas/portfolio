import { Link, createFileRoute } from "@tanstack/react-router"
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import { HomeHero } from "@/components/HomeHero"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ui/button"
import { getFeaturedProjects } from "@/lib/content"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Arshiya Sayyed | Software Engineer" }],
  }),
  component: HomePage,
})

export function HomePage() {
  const featuredProjects = getFeaturedProjects()

  return (
    <div className="theme-neutral flex min-h-full flex-col">
      <main className="site-page flex-1 pb-20">
        <HomeHero />

        <section className="relative z-[1] mt-8 sm:mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2
                id="highlighted-projects-heading"
                className="font-serif text-2xl font-semibold tracking-tight"
              >
                Highlighted projects
              </h2>
              <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
                Lyft backend work across mobility products and AI-assisted
                engineering, plus Days Gone, a personal citizenship tool.
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
          <ul
            aria-labelledby="highlighted-projects-heading"
            className={cn(
              "relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory items-stretch gap-4 overflow-x-auto",
              "scroll-pr-(--site-pad-right) scroll-pl-(--site-pad-left)",
              "pr-(--site-pad-right) pl-(--site-pad-left)",
              "motion-safe:scroll-smooth",
              "sm:static sm:left-auto sm:grid sm:w-auto sm:translate-x-0 sm:snap-none sm:scroll-pr-0 sm:scroll-pl-0 sm:grid-cols-2 sm:overflow-visible sm:pr-0 sm:pl-0"
            )}
          >
            {featuredProjects.map((project) => (
              <li
                key={project.slug}
                className="flex w-[calc(100vw-4.75rem)] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink"
              >
                <FeaturedProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
