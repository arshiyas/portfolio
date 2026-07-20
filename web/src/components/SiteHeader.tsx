import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { navLinks, site } from "@/lib/content"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  theme?: "neutral" | "work" | "personal"
}

export function SiteHeader({ theme = "neutral" }: SiteHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const headerBg =
    theme === "personal"
      ? "bg-[rgba(255,248,243,0.92)] border-playful-border"
      : "bg-[rgba(250,249,245,0.9)] border-claude-border"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md",
        headerBg,
      )}
    >
      <Link
        to="/"
        className="font-serif text-[1.05rem] font-semibold tracking-tight text-claude-text"
      >
        {site.name}
      </Link>
      <nav className="flex gap-2 text-sm sm:gap-3">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Button
              key={href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto px-2 py-1 font-normal",
                active
                  ? "text-claude-accent"
                  : "text-claude-muted hover:bg-transparent hover:text-claude-accent",
              )}
            >
              <Link to={href}>{label}</Link>
            </Button>
          )
        })}
      </nav>
    </header>
  )
}
