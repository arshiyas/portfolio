import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { ProjectGrid } from "@/components/ProjectGrid"

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

test("lists projects with the same square-mark cards as the homepage", () => {
  render(<ProjectGrid />)

  expect(screen.queryByText("Work · Lyft")).toBeNull()
  expect(screen.queryByText("Work · SkyWatch")).toBeNull()
  expect(
    screen.getByRole("heading", { name: "International Expansion" })
  ).toBeTruthy()
  expect(screen.getAllByRole("img", { name: "Lyft" }).length).toBeGreaterThan(0)
  expect(
    screen.getByRole("heading", { name: "Search Optimization @ SkyWatch" })
  ).toBeTruthy()
  expect(screen.getAllByRole("img", { name: "SkyWatch" }).length).toBeGreaterThan(
    0
  )
  expect(
    screen.getByRole("heading", { name: "Healthcare Microservices @ GE" })
  ).toBeTruthy()
  expect(screen.getAllByRole("img", { name: "GE" }).length).toBeGreaterThan(0)
  expect(screen.queryByRole("button", { name: "All" })).toBeNull()
  expect(screen.queryByRole("button", { name: "Work" })).toBeNull()
  expect(screen.queryByRole("button", { name: "Personal" })).toBeNull()
})
