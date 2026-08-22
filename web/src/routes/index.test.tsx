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

test("selected work is a snap scroller of the four featured projects", () => {
  render(<HomePage />)

  const scroller = screen.getByRole("list", { name: "Selected work" })
  expect(scroller.className).toMatch(/snap-x/)
  expect(scroller.className).toMatch(/sm:grid/)
  expect(scroller.className).toMatch(/motion-safe:scroll-smooth/)
  expect(scroller.className.split(/\s+/).includes("scroll-smooth")).toBe(false)

  for (const project of getFeaturedProjects()) {
    expect(screen.getByRole("heading", { name: project.title })).toBeTruthy()
  }

  expect(
    screen.getByRole("link", { name: "All projects →" }).getAttribute("href")
  ).toBe("/projects")
})
