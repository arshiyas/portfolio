import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { PageTrail } from "@/components/PageTrail"

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

test("renders a single crumb as a back-to-home link", () => {
  render(<PageTrail items={[{ label: "Home", to: "/" }]} />)

  const home = screen.getByRole("link", { name: "← Home" })
  expect(home.getAttribute("href")).toBe("/")
  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy()
})

test("renders nested crumbs as Home / Projects without a back arrow", () => {
  render(
    <PageTrail
      items={[
        { label: "Home", to: "/" },
        { label: "Projects", to: "/projects" },
      ]}
    />
  )

  expect(screen.queryByRole("link", { name: "← Home" })).toBeNull()
  expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe(
    "/"
  )
  expect(
    screen.getByRole("link", { name: "Projects" }).getAttribute("href")
  ).toBe("/projects")
  expect(screen.getByText("/")).toBeTruthy()
})
