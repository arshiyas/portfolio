import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { SiteFooter } from "@/components/SiteFooter"
import { site } from "@/lib/content"

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

test("footer is name, Projects, Resume, About, and social icons", () => {
  render(<SiteFooter />)

  expect(
    screen.getByRole("link", { name: site.name }).getAttribute("href")
  ).toBe("/")
  expect(
    screen.getByRole("link", { name: "Projects" }).getAttribute("href")
  ).toBe("/projects")
  expect(
    screen.getByRole("link", { name: "Resume" }).getAttribute("href")
  ).toBe("/resume")
  expect(screen.getByRole("link", { name: "About" }).getAttribute("href")).toBe(
    "/about"
  )

  const email = screen.getByRole("link", { name: "Email" })
  expect(email.getAttribute("href")).toBe(`mailto:${site.links.email}`)

  const linkedin = screen.getByRole("link", { name: "LinkedIn" })
  expect(linkedin.getAttribute("href")).toBe(site.links.linkedin)
})

test("footer has no page aside", () => {
  render(<SiteFooter />)

  expect(screen.queryByText(/Building systems/)).toBeNull()
  expect(screen.queryByText(/kayaking/)).toBeNull()
  expect(screen.queryByText(/tradeoffs/)).toBeNull()
  expect(screen.queryByText(/walk through/)).toBeNull()
})
