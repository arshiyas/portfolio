import { Link } from "@tanstack/react-router"
import type { CSSProperties } from "react"
import { Mail } from "lucide-react"
import { site } from "@/lib/content"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const chatLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:opacity-80"

const socialLinkClass =
  "inline-flex items-center text-muted-foreground transition hover:text-primary"

export function HomeHero() {
  return (
    <div className="home-hero pt-14 pb-0 sm:pt-16">
      <section>
        <TooltipProvider>
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`mailto:${site.links.email}`}
                  aria-label="Email"
                  className={socialLinkClass}
                >
                  <Mail className="size-4" aria-hidden />
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                Email
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className={`${socialLinkClass} ml-2 hover:opacity-80`}
                >
                  <LinkedInIcon className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                LinkedIn
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <h1 className="mt-3 flex items-center gap-2 font-serif text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.15] font-semibold tracking-tight sm:mt-4">
          {site.heroHeading}
          <span
            className="hero-memoji"
            style={{ "--hero-memoji": `url(${site.heroMemoji})` } as CSSProperties}
            aria-hidden
          >
            <img
              src={site.heroMemoji}
              alt=""
              width={80}
              height={80}
            />
          </span>
        </h1>
        {site.lede.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? "mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg"
                : "mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            }
          >
            {paragraph}
          </p>
        ))}
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Want to learn more? Here's my{" "}
          <Link to="/resume" className={chatLinkClass}>
            resume
          </Link>
          , or{" "}
          <a
            href={site.links.calendly}
            target="_blank"
            rel="noreferrer"
            className={chatLinkClass}
          >
            book a time to chat
          </a>
          .
        </p>
      </section>
    </div>
  )
}
