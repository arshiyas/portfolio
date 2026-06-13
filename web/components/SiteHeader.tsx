"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site } from "@/lib/content";

type SiteHeaderProps = {
  theme?: "neutral" | "work" | "personal";
};

export function SiteHeader({ theme = "neutral" }: SiteHeaderProps) {
  const pathname = usePathname();
  const headerBg =
    theme === "personal"
      ? "bg-[rgba(255,248,243,0.92)] border-playful-border"
      : "bg-[rgba(250,249,245,0.9)] border-claude-border";

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md ${headerBg}`}
    >
      <Link
        href="/"
        className="font-serif text-[1.05rem] font-semibold tracking-tight text-claude-text"
      >
        {site.name}
      </Link>
      <nav className="flex gap-6 text-sm">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "text-claude-accent"
                  : "text-claude-muted transition-colors hover:text-claude-accent"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
