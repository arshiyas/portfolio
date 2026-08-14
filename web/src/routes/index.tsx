import { Link, createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LyftLogo } from "@/components/LyftLogo"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { getFeaturedProjects, site } from "@/lib/content"

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
      <SiteHeader theme="neutral" />

      <main className="mx-auto w-full max-w-[920px] flex-1 pb-20">
        <div className="home-hero relative left-1/2 -ml-[50vw] w-screen overflow-hidden">
          <div aria-hidden className="home-hero__skyline" />
          <div aria-hidden className="home-hero__wash" />
          <div className="home-hero__content mx-auto w-full max-w-[920px] px-6 pb-14 pt-16">
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-claude-muted">
                <a
                  href={`mailto:${site.links.email}`}
                  className="transition hover:text-claude-accent"
                >
                  {site.links.email}
                </a>
                <span aria-hidden className="text-claude-border">
                  ·
                </span>
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-claude-accent"
                >
                  LinkedIn ↗
                </a>
              </div>
              <p className="mb-3 font-mono text-sm text-claude-accent">{site.eyebrow}</p>
              <h1 className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-[1.15] tracking-tight">
                {site.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <LyftLogo className="h-[22px] w-auto" />
                <span className="text-sm font-medium text-claude-muted">{site.tagline}</span>
              </div>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-claude-muted">
                {site.lede}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {site.stack.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full font-normal">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {site.heroButtons.map((button) =>
                  button.primary ? (
                    <Button key={button.href} asChild className="rounded-full px-5">
                      <Link to={button.href}>{button.label}</Link>
                    </Button>
                  ) : (
                    <Button
                      key={button.href}
                      asChild
                      variant="outline"
                      className="rounded-full px-5"
                    >
                      <Link to={button.href}>{button.label}</Link>
                    </Button>
                  ),
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="px-6">
          <section className="relative z-[1] mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  Selected work
                </h2>
                <p className="mt-1 text-sm text-claude-muted">
                  European expansion, teen rides, Silver, and AI-assisted engineering at Lyft.
                </p>
              </div>
              <Button asChild variant="link" className="h-auto shrink-0 px-0 text-claude-accent">
                <Link to="/projects">All projects →</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProjects.map((project) => {
                const card = (
                  <Card className="h-full border-claude-border shadow-none transition hover:border-claude-accent">
                    <CardHeader>
                      <p className="text-xs font-semibold uppercase tracking-wider text-claude-accent">
                        {project.category}
                      </p>
                      <CardTitle className="font-serif text-base group-hover:text-claude-accent">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {project.caseStudy ? (
                        <p className="text-xs font-medium text-claude-accent">
                          Read case study →
                        </p>
                      ) : project.toolUrl ? (
                        <p className="text-xs font-medium text-claude-accent">Open tool →</p>
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
                    <Link key={project.slug} to="/days-gone" className="group block">
                      {card}
                    </Link>
                  )
                }

                return (
                  <Link key={project.slug} to="/projects" className="group block">
                    {card}
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter theme="neutral" />
    </div>
  )
}
