import { Separator } from "@/components/ui/separator"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  theme?: "work" | "personal" | "neutral"
}

export function SiteFooter({ theme = "neutral" }: SiteFooterProps) {
  const borderClass =
    theme === "personal" ? "border-playful-border" : "border-claude-border"

  return (
    <footer
      className={cn("border-t px-6 py-8 pb-12 text-sm text-claude-muted", borderClass)}
    >
      <div className="mx-auto w-full max-w-[920px]">
        <p>
          {site.name} · {site.location}
        </p>
        <Separator className="my-3 bg-transparent" />
        <div className="mt-2 flex gap-5">
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-claude-accent"
          >
            LinkedIn
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-claude-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
