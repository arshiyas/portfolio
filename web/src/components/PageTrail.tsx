import { Link } from "@tanstack/react-router"

type PageTrailItem = {
  label: string
  to: "/" | "/projects"
}

type PageTrailProps = {
  items: PageTrailItem[]
}

const linkClass = "text-sm text-muted-foreground transition hover:text-primary"

export function PageTrail({ items }: PageTrailProps) {
  if (items.length === 0) return null

  if (items.length === 1) {
    const item = items[0]
    if (!item) return null

    return (
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link to={item.to} className={linkClass}>
          ← {item.label}
        </Link>
      </nav>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.to} className="flex items-center gap-x-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            <Link to={item.to} className="transition hover:text-primary">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
