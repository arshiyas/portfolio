import { Link } from "@tanstack/react-router"
import { Mail } from "lucide-react"
import { site } from "@/lib/content"

const links = [
  { label: "Resume", href: "/resume" },
  { label: "About", href: "/about" },
] as const

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

const iconLinkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground transition hover:text-primary sm:min-h-0 sm:min-w-0"

export function SiteFooter() {
  return (
    <footer className="site-footer-safe border-t border-border py-10 text-sm text-muted-foreground">
      <div className="site-page flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs sm:justify-end">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="transition hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
        <a
          href={`mailto:${site.links.email}`}
          aria-label="Email"
          className={iconLinkClass}
        >
          <Mail className="size-4" aria-hidden />
        </a>
        <a
          href={site.links.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className={iconLinkClass}
        >
          <LinkedInIcon className="size-4" />
        </a>
      </div>
    </footer>
  )
}
