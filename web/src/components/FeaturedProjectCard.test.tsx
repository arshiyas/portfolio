import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard"
import { getProjectBySlug } from "@/lib/content"

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...props
  }: {
    to: string
    params?: { slug?: string }
    children: ReactNode
  }) => (
    <a href={params?.slug ? to.replace("$slug", params.slug) : to} {...props}>
      {children}
    </a>
  ),
}))

test("Lyft card uses a square logo instead of the Work · Lyft label", () => {
  const project = getProjectBySlug("lyft-international")
  if (!project) throw new Error("missing lyft-international fixture")

  render(<FeaturedProjectCard project={project} />)

  expect(screen.queryByText("Work · Lyft")).toBeNull()
  expect(screen.getByRole("img", { name: "Lyft" })).toBeTruthy()
  const heading = screen.getByRole("heading", {
    name: "International Expansion",
  })
  const logo = screen.getByRole("img", { name: "Lyft" })
  expect(heading).toBeTruthy()
  expect(
    screen.getByText(
      "A Lyft rider lands in Europe and takes a FREENOW ride in the same app."
    )
  ).toBeTruthy()
  expect(screen.queryByText(project.description)).toBeNull()
  expect(
    logo.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
  expect(screen.queryByText(/Read case study/)).toBeNull()
  for (const tag of project.tags) {
    expect(screen.getByText(tag)).toBeTruthy()
  }
  const description = screen.getByText(
    "A Lyft rider lands in Europe and takes a FREENOW ride in the same app."
  )
  expect(description.className).not.toMatch(/line-clamp|truncate/)
  expect(
    description.compareDocumentPosition(screen.getByText("Go")) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
})

test("Days Gone card uses its own square logo instead of the category label", () => {
  const project = getProjectBySlug("days-gone")
  if (!project) throw new Error("missing days-gone fixture")

  render(<FeaturedProjectCard project={project} />)

  expect(screen.queryByText("Personal · Citizenship")).toBeNull()
  expect(screen.getByRole("img", { name: "Days Gone" })).toBeTruthy()
  expect(screen.getByRole("heading", { name: "Days Gone" })).toBeTruthy()
  expect(
    screen.getByText(
      "Citizenship travel dates from messy records, parsed on-device in the browser."
    )
  ).toBeTruthy()
  expect(screen.queryByText(project.description)).toBeNull()
  expect(screen.queryByText(/Read case study/)).toBeNull()
  expect(screen.queryByText(/Open tool/)).toBeNull()
})

test("SkyWatch card uses the SkyWatch logo asset", () => {
  const project = getProjectBySlug("search-skywatch")
  if (!project) throw new Error("missing search-skywatch fixture")

  render(<FeaturedProjectCard project={project} />)

  const logo = screen.getByRole("img", { name: "SkyWatch" })
  expect(logo.getAttribute("src")).toBe("/logos/skywatch.svg")
  expect(logo.parentElement?.className).toMatch(/overflow-hidden/)
  expect(logo.parentElement?.className).toMatch(/bg-\[#212b35\]/)
})

test("GE card uses the GE logo asset", () => {
  const project = getProjectBySlug("ge-microservices")
  if (!project) throw new Error("missing ge-microservices fixture")

  render(<FeaturedProjectCard project={project} />)

  const logo = screen.getByRole("img", { name: "GE" })
  expect(logo.getAttribute("src")).toBe("/logos/ge.png")
})
