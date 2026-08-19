import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { ContactPage } from "@/routes/_personal/contact"
import { site } from "@/lib/content"

test("offers the form and a Calendly booking link", () => {
  render(<ContactPage />)

  expect(screen.getByRole("heading", { name: "Contact me" })).toBeTruthy()
  expect(
    screen.getByText(
      "Recruiting, collaboration, or a project chat. Send a note, or book a time."
    )
  ).toBeTruthy()

  const booking = screen.getByRole("link", { name: /book a time/i })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  expect(screen.getByLabelText("Name")).toBeTruthy()
  expect(screen.getByLabelText("Email")).toBeTruthy()
  expect(screen.getByLabelText("Message")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy()
})
