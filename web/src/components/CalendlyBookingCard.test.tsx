import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { CalendlyBookingCard } from "@/components/CalendlyBookingCard"
import { site } from "@/lib/content"

test("links Book a time to Calendly in a new tab", () => {
  render(<CalendlyBookingCard />)

  const link = screen.getByRole("link", { name: /book a time/i })
  expect(link).toHaveProperty("href", site.links.calendly)
  expect(link.getAttribute("target")).toBe("_blank")
  expect(link.getAttribute("rel")).toBe("noreferrer")
})

test("uses a heading and does not embed Calendly", () => {
  render(<CalendlyBookingCard />)

  expect(
    screen.getByRole("heading", { name: "Prefer to talk live?" })
  ).toBeTruthy()
  expect(screen.getByText("Book a chat on my calendar.")).toBeTruthy()
  expect(document.querySelector("iframe")).toBeNull()
  expect(document.querySelector("script")).toBeNull()
})
