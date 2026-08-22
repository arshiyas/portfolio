import { Link } from "@tanstack/react-router"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LyftLogo } from "@/components/LyftLogo"
import { site } from "@/lib/content"

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
      />
    </svg>
  )
}

function MetaDot() {
  return (
    <span aria-hidden className="mx-2">
      ·
    </span>
  )
}

const chatLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:opacity-80"

const socialLinkClass =
  "inline-flex items-center text-muted-foreground transition hover:text-primary"

export function HomeHero() {
  return (
    <div className="home-hero pt-14 pb-0 sm:pt-16">
      <section>
        <h1 className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.15] font-semibold tracking-tight">
          {site.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-y-2 text-sm font-medium text-muted-foreground sm:mt-4">
          <div className="flex items-center whitespace-nowrap">
            <LyftLogo className="h-[22px] w-auto" />
            <span className="ml-2">{site.tagline}</span>
            <MetaDot />
            <span>{site.location}</span>
            <MetaDot />
          </div>
          <div className="flex items-center whitespace-nowrap">
            <a
              href={`mailto:${site.links.email}`}
              aria-label="Email"
              className={socialLinkClass}
            >
              <Mail className="size-4" aria-hidden />
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={`${socialLinkClass} ml-2 hover:opacity-80`}
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
          {site.lede}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Want to learn more?{" "}
          <a
            href={site.links.calendly}
            target="_blank"
            rel="noreferrer"
            className={chatLinkClass}
          >
            Book a time
          </a>{" "}
          or{" "}
          <Link to="/about" hash="contact" className={chatLinkClass}>
            send a note
          </Link>
          .
        </p>

        <div className="mt-5">
          {site.heroButtons.map((button) => {
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
                className="h-11 w-full px-4 sm:h-8 sm:w-auto sm:px-2.5"
              >
                {action}
              </Button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
