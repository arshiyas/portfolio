import type { ReactNode } from "react"
import type * as TanStackRouter from "@tanstack/react-router"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { HomePage } from "@/routes/index"
import { getFeaturedProjects } from "@/lib/content"

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof TanStackRouter>()
  return {
    ...actual,
    Link: ({
      to,
      params,
      hash,
      children,
      ...props
    }: {
      to: string
      params?: { slug?: string }
      hash?: string
      children: ReactNode
    }) => (
      <a
        href={
          hash
            ? `${to}#${hash}`
            : params?.slug
              ? to.replace("$slug", params.slug)
              : to
        }
        {...props}
      >
        {children}
      </a>
    ),
  }
})

test("highlighted projects is a snap scroller of the five featured projects", () => {
  render(<HomePage />)

  const scroller = screen.getByRole("list", { name: "Highlighted projects" })
  expect(scroller.className).toMatch(/snap-x/)
  expect(scroller.className).toMatch(/sm:grid/)
  expect(scroller.className).toMatch(/motion-safe:scroll-smooth/)
  expect(scroller.className.split(/\s+/).includes("scroll-smooth")).toBe(false)

  const featured = getFeaturedProjects()
  expect(featured.map((project) => project.slug)).toEqual([
    "lyft-international",
    "ai-engineering",
    "lyft-teens",
    "lyft-silver",
    "days-gone",
  ])
  expect(featured).toHaveLength(5)

  for (const project of featured) {
    expect(screen.getByRole("heading", { name: project.title })).toBeTruthy()
  }

  expect(
    screen.getByRole("link", { name: "All projects →" }).getAttribute("href")
  ).toBe("/projects")

  const intro = screen.getByText(
    /Lyft backend work across mobility products and AI-assisted engineering/
  )
  expect(intro.className).toMatch(/hidden/)
  expect(intro.className).toMatch(/sm:block/)
})
