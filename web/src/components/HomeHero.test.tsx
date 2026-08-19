import type { ReactNode } from "react"
import { render, within } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { HomeHero } from "@/components/HomeHero"
import { site } from "@/lib/content"

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

test("shows name, intro, contact mailto, and view projects only", () => {
  render(<HomeHero />)

  const hero = document.querySelector(".home-hero")
  expect(hero).toBeTruthy()
  const scope = within(hero as HTMLElement)

  expect(scope.getByRole("heading", { name: site.name })).toBeTruthy()
  expect(
    scope.getByText(`${site.tagline} · ${site.location}`)
  ).toBeTruthy()
  expect(scope.getByRole("img", { name: "Lyft" })).toBeTruthy()
  expect(scope.getByText(site.lede)).toBeTruthy()

  const contact = scope.getByRole("link", { name: "Contact me" })
  expect(contact.getAttribute("href")).toBe(`mailto:${site.links.email}`)

  const projects = scope.getByRole("link", { name: "View projects" })
  expect(projects.getAttribute("href")).toBe("/projects")

  expect(scope.queryByText(site.eyebrow)).toBeNull()
  expect(scope.queryByRole("link", { name: /linkedin/i })).toBeNull()
  expect(scope.queryByRole("link", { name: "Resume" })).toBeNull()
  expect(scope.queryByText("Tech stack")).toBeNull()
  for (const item of site.stack) {
    expect(scope.queryByText(item)).toBeNull()
  }
})
