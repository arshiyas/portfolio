import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy"
import { getProjectBySlug } from "@/lib/content"

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>()
  return {
    ...actual,
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
  }
})

test("personal case study trail is Home / Projects, not a lone back link", () => {
  const project = getProjectBySlug("days-gone")
  if (!project) throw new Error("missing days-gone fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(screen.queryByRole("link", { name: "← Projects" })).toBeNull()
  expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe(
    "/"
  )
  expect(
    screen.getByRole("link", { name: "Projects" }).getAttribute("href")
  ).toBe("/projects")
  expect(screen.getByRole("link", { name: "← All projects" })).toBeTruthy()
})

test("work case study trail is Home / Projects above the title", () => {
  const project = getProjectBySlug("lyft-international")
  if (!project) throw new Error("missing lyft-international fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe(
    "/"
  )
  expect(
    screen.getByRole("link", { name: "Projects" }).getAttribute("href")
  ).toBe("/projects")
  expect(screen.queryByText("Work · Lyft")).toBeNull()
})

test("work case study heading is the title only, with no company logo", () => {
  const project = getProjectBySlug("lyft-international")
  if (!project) throw new Error("missing lyft-international fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(
    screen.getByRole("heading", { level: 1, name: "International Expansion" })
  ).toBeTruthy()
  expect(screen.queryByRole("img", { name: "Lyft" })).toBeNull()
})

test("case study heading drops the @ company suffix", () => {
  const project = getProjectBySlug("search-skywatch")
  if (!project) throw new Error("missing search-skywatch fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(
    screen.getByRole("heading", { level: 1, name: "Search Optimization" })
  ).toBeTruthy()
  expect(screen.queryByText(/@ SkyWatch/)).toBeNull()
  expect(screen.queryByRole("img", { name: "SkyWatch" })).toBeNull()
})

test("personal case study heading is the title only", () => {
  const project = getProjectBySlug("days-gone")
  if (!project) throw new Error("missing days-gone fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(
    screen.getByRole("heading", { level: 1, name: "Days Gone" })
  ).toBeTruthy()
  expect(screen.queryByText("| Personal project")).toBeNull()
})

test("work case study ends with a readable preview of the next project", () => {
  const project = getProjectBySlug("lyft-international")
  if (!project) throw new Error("missing lyft-international fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(screen.getByText("Next")).toBeTruthy()
  expect(
    screen.getByRole("heading", { name: "AI-Assisted Engineering" })
  ).toBeTruthy()
  expect(
    screen.getByText(/Changing how a backend org works with coding agents/)
  ).toBeTruthy()
  expect(
    screen.getByRole("link", { name: /Learn more/ }).getAttribute("href")
  ).toBe("/projects/ai-engineering")
})

test("personal case study wraps to the first case study as next", () => {
  const project = getProjectBySlug("days-gone")
  if (!project) throw new Error("missing days-gone fixture")

  render(<ProjectCaseStudy project={project} />)

  expect(screen.getByRole("heading", { name: "Lyft Silver" })).toBeTruthy()
  expect(
    screen.getByRole("link", { name: /Learn more/ }).getAttribute("href")
  ).toBe("/projects/lyft-silver")
})
