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

test("footer is Resume, About, and social icons without Projects or a name", () => {
  render(<SiteFooter />)

  expect(screen.queryByRole("link", { name: site.name })).toBeNull()
  expect(screen.queryByRole("link", { name: "Projects" })).toBeNull()
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

test("footer content uses the shared page column", () => {
  render(<SiteFooter />)

  const footer = document.querySelector("footer")
  expect(footer?.className.split(/\s+/).includes("site-page")).toBe(false)
  expect(footer?.className.split(/\s+/).includes("px-6")).toBe(false)
  expect(footer?.querySelector(".site-page")).toBeTruthy()
})

test("footer has no page aside", () => {
  render(<SiteFooter />)

  expect(screen.queryByText(/Building systems/)).toBeNull()
  expect(screen.queryByText(/kayaking/)).toBeNull()
  expect(screen.queryByText(/tradeoffs/)).toBeNull()
  expect(screen.queryByText(/walk through/)).toBeNull()
})
