import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { ResumePage } from "@/routes/_work/resume"
import { site } from "@/lib/content"

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>()
  return {
    ...actual,
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
  }
})

vi.mock("@/components/ResumeDocument", () => ({
  ResumeDocument: () => <div>resume body</div>,
}))

vi.mock("@/lib/resume-pdf", () => ({
  downloadResumePdf: vi.fn(),
}))

test("resume subtitle is Interested with book a time and send a note", () => {
  render(<ResumePage />)

  expect(screen.getByRole("heading", { name: "Resume" })).toBeTruthy()
  expect(screen.getByText(/Interested\?/)).toBeTruthy()
  expect(
    screen.queryByText(/Software engineering across mobility/)
  ).toBeNull()

  const booking = screen.getByRole("link", { name: "book a time" })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  const note = screen.getByRole("link", { name: "send a note" })
  expect(note.getAttribute("href")).toBe("/about#contact")
})
