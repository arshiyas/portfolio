import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { ResumeDocument } from "@/components/ResumeDocument"

test("shows the Lyft agent-eval bullet on the resume page", () => {
  render(<ResumeDocument />)

  expect(
    screen.getByText(/AGENTS.md across ten backend repos/i),
  ).toBeTruthy()
  expect(
    screen.getByText(/Cursor\/Claude dashboard-migration skill/i),
  ).toBeTruthy()
  expect(screen.getByText(/AI and tooling:/i)).toBeTruthy()
})
