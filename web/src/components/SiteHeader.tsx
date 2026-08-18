import { Link, useRouterState } from "@tanstack/react-router"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navLinks, primaryNavLinks, site } from "@/lib/content"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  theme?: "neutral" | "work" | "personal"
}

type NavLink = (typeof navLinks)[number]

function NavButton({ href, label, active }: NavLink & { active: boolean }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        "h-11 min-h-11 px-3 py-2 font-normal sm:h-auto sm:min-h-0 sm:px-2 sm:py-1",
        active
          ? "text-claude-accent"
          : "text-claude-muted hover:bg-transparent hover:text-claude-accent",
      )}
    >
      <Link to={href}>{label}</Link>
    </Button>
  )
}

export function SiteHeader({ theme = "neutral" }: SiteHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const headerBg =
    theme === "personal"
      ? "bg-[rgba(255,248,243,0.92)] border-playful-border"
      : "bg-[rgba(250,249,245,0.9)] border-claude-border"

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={cn(
        "site-header-safe sticky top-0 z-50 flex items-center justify-between border-b backdrop-blur-md",
        headerBg,
      )}
    >
      <Link
        to="/"
        className="min-h-11 py-2 font-serif text-[1.05rem] font-semibold leading-none tracking-tight text-claude-text sm:min-h-0 sm:py-0"
      >
        {site.name}
      </Link>
      <nav className="flex items-center gap-0.5 sm:gap-1">
        <div className="flex items-center sm:hidden">
          {primaryNavLinks.map((link) => (
            <NavButton key={link.href} {...link} active={isActive(link.href)} />
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 min-h-11 w-11 px-0 text-claude-muted hover:bg-transparent hover:text-claude-accent"
                aria-label="More navigation links"
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/contact" className="cursor-pointer">
                  Contact
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden items-center sm:flex">
          {navLinks.map((link) => (
            <NavButton key={link.href} {...link} active={isActive(link.href)} />
          ))}
        </div>
      </nav>
    </header>
  )
}
