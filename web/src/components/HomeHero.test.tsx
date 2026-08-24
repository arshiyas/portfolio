import type { ReactNode } from "react"
import { render, screen, within } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { HomeHero } from "@/components/HomeHero"
import { site } from "@/lib/content"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock)

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

  const heading = scope.getByRole("heading", { name: site.heroHeading })
  expect(heading).toBeTruthy()
  expect(heading.textContent).not.toMatch(/👋/)
  expect(heading.querySelector("svg")).toBeNull()
  const octocat = heading.querySelector("img")
  expect(octocat?.getAttribute("src")).toBe("/images/hijab-octocat.png?v=2")
  expect(octocat?.getAttribute("alt")).toBe("")
  expect(octocat?.className).toMatch(/h-\[1em\]/)
  expect(scope.queryByText(site.tagline)).toBeNull()
  expect(scope.queryByText(site.location)).toBeNull()
  expect(scope.queryByRole("img", { name: "Lyft" })).toBeNull()
  expect(scope.getByText(site.lede[0])).toBeTruthy()
  expect(scope.getByText(site.lede[1])).toBeTruthy()

  const booking = scope.getByRole("link", { name: "book a time to chat" })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  expect(scope.queryByRole("link", { name: "send a note" })).toBeNull()

  expect(scope.getByText(/Want to learn more\?/)).toBeTruthy()
  expect(scope.getByText(/Here's my/)).toBeTruthy()

  const email = scope.getByRole("link", { name: "Email" })
  expect(email.getAttribute("href")).toBe(`mailto:${site.links.email}`)

  const linkedin = scope.getByRole("link", { name: "LinkedIn" })
  expect(linkedin.getAttribute("href")).toBe(site.links.linkedin)
  expect(linkedin.querySelector("rect")?.getAttribute("fill")).toBe("#0A66C2")

  expect(
    heading.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_PRECEDING
  ).toBeTruthy()
  expect(
    heading.compareDocumentPosition(linkedin) & Node.DOCUMENT_POSITION_PRECEDING
  ).toBeTruthy()

  const resume = scope.getByRole("link", { name: "resume" })
  expect(resume.getAttribute("href")).toBe("/resume")
  expect(scope.queryByRole("button")).toBeNull()
  expect(scope.queryByRole("link", { name: "View projects" })).toBeNull()

  expect(scope.queryByText(site.eyebrow)).toBeNull()
  expect(scope.queryByText("Tech stack")).toBeNull()
  for (const item of site.stack) {
    expect(scope.queryByText(item)).toBeNull()
  }
})

test("shows email and LinkedIn tooltips on focus", async () => {
  render(<HomeHero />)

  screen.getByRole("link", { name: "Email" }).focus()
  expect(await screen.findByRole("tooltip", { name: "Email" })).toBeTruthy()

  screen.getByRole("link", { name: "LinkedIn" }).focus()
  expect(await screen.findByRole("tooltip", { name: "LinkedIn" })).toBeTruthy()
})
