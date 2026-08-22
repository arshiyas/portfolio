import type { ReactNode } from "react"
import type * as TanStackRouter from "@tanstack/react-router"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { WorkPage } from "@/routes/_work/projects/index"

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof TanStackRouter>()
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

test("projects page is titled Projects, not Work", () => {
  render(<WorkPage />)

  expect(screen.getByRole("heading", { name: "Projects" })).toBeTruthy()
  expect(screen.queryByRole("heading", { name: "Work" })).toBeNull()
  expect(screen.queryByText("Selected work")).toBeNull()
})
