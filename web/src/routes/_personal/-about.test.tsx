import type { ReactNode } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import { AboutPage } from "@/routes/_personal/about"
import { site } from "@/lib/content"

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>()
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

test("combines about copy with Calendly and a note form that opens on click", () => {
  render(<AboutPage />)

  expect(screen.getByRole("heading", { name: "Hey, I'm Arshiya" })).toBeTruthy()
  expect(screen.getByText(/Would like to chat/)).toBeTruthy()
  expect(screen.queryByText(/Penn State/)).toBeNull()
  expect(
    screen.getByRole("heading", { name: "Beyond the resume" })
  ).toBeTruthy()
  expect(screen.queryByRole("heading", { name: "Contact me" })).toBeNull()
  expect(screen.queryByLabelText("Name")).toBeNull()

  const booking = screen.getByRole("link", { name: "Book a time" })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  fireEvent.click(screen.getByRole("link", { name: "send me a note" }))

  expect(screen.queryByText(/Would like to chat/)).toBeNull()
  expect(screen.queryByRole("link", { name: "Book a time" })).toBeNull()
  expect(
    screen.queryByRole("heading", { name: "Beyond the resume" })
  ).toBeNull()
  expect(screen.getByLabelText("Name")).toBeTruthy()
  expect(screen.getByLabelText("Email")).toBeTruthy()
  expect(screen.getByLabelText("Message")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy()
})

test("links back to home above the heading", () => {
  render(<AboutPage />)

  expect(
    screen.getByRole("link", { name: "← Home" }).getAttribute("href")
  ).toBe("/")
})
