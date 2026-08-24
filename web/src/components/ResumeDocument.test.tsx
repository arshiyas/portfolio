import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { ResumeDocument } from "@/components/ResumeDocument"

test("header above summary has no horizontal rule", () => {
  const { container } = render(<ResumeDocument />)

  const header = container.querySelector("article > header")
  const summarySection = screen.getByRole("heading", { name: "Summary" }).closest("section")
  const summary = screen.getByRole("heading", { name: "Summary" })

  expect(header?.className).not.toMatch(/border-b/)
  expect(header?.className ?? "").not.toMatch(/pb-/)
  expect(summarySection?.className).toMatch(/\bmt-4\b/)
  expect(summarySection?.className).not.toMatch(/\bmt-8\b/)
  expect(summary.className).toMatch(/border-b/)
  expect(container.querySelector("article")?.className).toMatch(/overflow-hidden/)
  expect(summary.className).toMatch(/-mx-6/)
})

test("shows the Lyft AI-enabled OE bullet on the resume page", () => {
  render(<ResumeDocument />)

  expect(
    screen.getByText(/AI-enabled operational-excellence dashboard/i),
  ).toBeTruthy()
  expect(
    screen.getByText(/Worked on AI initiatives across the org/i),
  ).toBeTruthy()
  expect(screen.getByText(/day-to-day code in Cursor and Claude/i)).toBeTruthy()
  expect(screen.getByText(/AI and tooling:/i)).toBeTruthy()
})
