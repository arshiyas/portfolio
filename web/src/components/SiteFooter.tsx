import { Link, useRouterState } from "@tanstack/react-router"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  theme?: "work" | "personal" | "neutral"
}

type FooterVariant = "home" | "projects" | "project" | "resume" | "about" | "contact" | "default"

function getFooterVariant(pathname: string): FooterVariant {
  if (pathname === "/") return "home"
  if (pathname === "/about") return "about"
  if (pathname === "/contact") return "contact"
  if (pathname === "/resume") return "resume"
  if (pathname === "/projects" || pathname === "/projects/") return "projects"
  if (pathname.startsWith("/projects/")) return "project"
  return "default"
}

type FooterContent = {
  note: string
  links: Array<{ label: string; href: string; external?: boolean }>
}

const footerContent: Record<FooterVariant, FooterContent> = {
  home: {
    note: "Software engineer in Toronto. Building systems that hold up in production.",
    links: [
      { label: "Resume", href: "/resume" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Email", href: `mailto:${site.links.email}` },
      { label: "LinkedIn ↗", href: site.links.linkedin, external: true },
    ],
  },
  projects: {
    note: "Mobility, geospatial, and healthcare — the through-line is backend systems at scale.",
    links: [
      { label: "Resume", href: "/resume" },
      { label: "About", href: "/about" },
      { label: "Home", href: "/" },
    ],
  },
  project: {
    note: "Want the tradeoffs and dead ends too? Just ask.",
    links: [
      { label: "All projects", href: "/projects" },
      { label: "Resume", href: "/resume" },
      { label: "Email", href: `mailto:${site.links.email}` },
    ],
  },
  resume: {
    note: "Happy to walk through any of this in more detail.",
    links: [
      { label: "View projects", href: "/projects" },
      { label: "About", href: "/about" },
      { label: "Email", href: `mailto:${site.links.email}` },
    ],
  },
  about: {
    note: "Away from the keyboard: kayaking, hiking, or being supervised by two cats.",
    links: [
      { label: "See my work", href: "/projects" },
      { label: "Resume", href: "/resume" },
      { label: "LinkedIn ↗", href: site.links.linkedin, external: true },
    ],
  },
  contact: {
    note: "Prefer email? I read everything that comes through here.",
    links: [
      { label: "Email", href: `mailto:${site.links.email}` },
      { label: "LinkedIn ↗", href: site.links.linkedin, external: true },
      { label: "Home", href: "/" },
    ],
  },
  default: {
    note: `${site.name} · ${site.location}`,
    links: [{ label: "LinkedIn ↗", href: site.links.linkedin, external: true }],
  },
}

function FooterLink({
  label,
  href,
  external = false,
}: {
  label: string
  href: string
  external?: boolean
}) {
  const className = "transition hover:text-claude-accent"

  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link to={href as "/"} className={className}>
      {label}
    </Link>
  )
}

export function SiteFooter({ theme = "neutral" }: SiteFooterProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const variant = getFooterVariant(pathname)
  const content = footerContent[variant]
  const borderClass =
    theme === "personal" ? "border-playful-border" : "border-claude-border"

  return (
    <footer
      className={cn(
        "border-t px-6 py-10 pb-14 text-sm text-claude-muted",
        borderClass,
      )}
    >
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md leading-relaxed">{content.note}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {content.links.map((link) => (
            <FooterLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </footer>
  )
}
