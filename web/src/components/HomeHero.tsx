import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { LyftLogo } from "@/components/LyftLogo"
import { site } from "@/lib/content"

export function HomeHero() {
  return (
    <div className="home-hero relative left-1/2 -ml-[50vw] w-screen overflow-hidden">
      <div aria-hidden className="home-hero__skyline" />
      <div aria-hidden className="home-hero__wash" />
      <div className="home-hero__content site-content-safe mx-auto w-full max-w-[920px] pt-10 pb-8 sm:pt-16 sm:pb-14">
        <section>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.15] font-semibold tracking-tight">
            {site.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-4">
            <LyftLogo className="h-[22px] w-auto" />
            <span className="text-sm font-medium text-muted-foreground">
              {site.tagline} · {site.location}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            {site.lede}
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            {site.heroButtons.map((button) => {
              const className =
                "h-11 w-full rounded-full px-5 sm:h-auto sm:w-auto"
              const action = button.href.startsWith("mailto:") ? (
                <a href={button.href}>{button.label}</a>
              ) : (
                <Link to={button.href}>{button.label}</Link>
              )

              return (
                <Button
                  key={button.href}
                  asChild
                  variant={button.primary ? "default" : "outline"}
                  className={className}
                >
                  {action}
                </Button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
