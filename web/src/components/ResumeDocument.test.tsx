import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { ResumeDocument } from "@/components/ResumeDocument"

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
