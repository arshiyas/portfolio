import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { SiteFooter } from "@/components/SiteFooter"
import { site } from "@/lib/content"

const location = vi.hoisted(() => ({ pathname: "/" }))

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    hash,
    children,
    ...props
  }: {
    to: string
    hash?: string
    children: ReactNode
  }) => (
    <a href={hash ? `${to}#${hash}` : to} {...props}>
      {children}
    </a>
  ),
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => string
  }) => select({ location }),
}))

afterEach(() => {
  location.pathname = "/"
})

test("homepage footer omits Resume because the hero already links to it", () => {
  render(<SiteFooter />)

  expect(screen.queryByRole("link", { name: "Resume" })).toBeNull()
  expect(screen.queryByRole("link", { name: "About" })).toBeNull()
  expect(
    screen.getByRole("link", { name: "Send a note" }).getAttribute("href")
  ).toBe("/about#contact")
})

test("project pages keep Resume and Send a note in the footer", () => {
  location.pathname = "/projects"
  render(<SiteFooter />)

  expect(screen.queryByRole("link", { name: site.name })).toBeNull()
  expect(screen.queryByRole("link", { name: "Projects" })).toBeNull()
  expect(screen.queryByRole("link", { name: "About" })).toBeNull()
  expect(
    screen.getByRole("link", { name: "Resume" }).getAttribute("href")
  ).toBe("/resume")
  expect(
    screen.getByRole("link", { name: "Send a note" }).getAttribute("href")
  ).toBe("/about#contact")

  const email = screen.getByRole("link", { name: "Email" })
  expect(email.getAttribute("href")).toBe(`mailto:${site.links.email}`)

  const linkedin = screen.getByRole("link", { name: "LinkedIn" })
  expect(linkedin.getAttribute("href")).toBe(site.links.linkedin)
})

test("resume page footer omits Resume and Send a note", () => {
  location.pathname = "/resume"
  render(<SiteFooter />)

  expect(screen.queryByRole("link", { name: "Resume" })).toBeNull()
  expect(screen.queryByRole("link", { name: "Send a note" })).toBeNull()
})

test("about page footer omits Send a note", () => {
  location.pathname = "/about"
  render(<SiteFooter />)

  expect(screen.queryByRole("link", { name: "Send a note" })).toBeNull()
  expect(
    screen.getByRole("link", { name: "Resume" }).getAttribute("href")
  ).toBe("/resume")
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
