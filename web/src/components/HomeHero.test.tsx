import type { ReactNode } from "react"
import { render, within } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { HomeHero } from "@/components/HomeHero"
import { site } from "@/lib/content"

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
}))

test("shows greeting with compact social icons, intro, and resume", () => {
  render(<HomeHero />)

  const hero = document.querySelector(".home-hero")
  expect(hero).toBeTruthy()
  const scope = within(hero as HTMLElement)

  expect(scope.getByRole("heading", { name: site.heroHeading })).toBeTruthy()
  expect(scope.queryByText(site.tagline)).toBeNull()
  expect(scope.queryByText(site.location)).toBeNull()
  expect(scope.queryByRole("img", { name: "Lyft" })).toBeNull()
  expect(scope.getByText(site.lede)).toBeTruthy()

  const booking = scope.getByRole("link", { name: "Book a time" })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  const note = scope.getByRole("link", { name: "send a note" })
  expect(note.getAttribute("href")).toBe("/about#contact")

  const email = scope.getByRole("link", { name: "Email" })
  expect(email.getAttribute("href")).toBe(`mailto:${site.links.email}`)

  const linkedin = scope.getByRole("link", { name: "LinkedIn" })
  expect(linkedin.getAttribute("href")).toBe(site.links.linkedin)

  const heading = scope.getByRole("heading", { name: site.heroHeading })
  expect(
    heading.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
  expect(
    heading.compareDocumentPosition(linkedin) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()

  const resume = scope.getByRole("link", { name: "Resume" })
  expect(resume.getAttribute("href")).toBe("/resume")
  expect(scope.queryByRole("link", { name: "View projects" })).toBeNull()

  expect(scope.queryByText(site.eyebrow)).toBeNull()
  expect(scope.queryByText("Tech stack")).toBeNull()
  for (const item of site.stack) {
    expect(scope.queryByText(item)).toBeNull()
  }
})
