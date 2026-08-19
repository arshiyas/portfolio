import { expect, test } from "vitest"
import { site } from "@/lib/content"

test("exposes the Calendly chat URL", () => {
  expect(site.links.calendly).toBe(
    "https://calendly.com/arshiyasayyed8/chat-with-arshiya"
  )
})

test("hero CTAs are view projects and a contact mailto", () => {
  expect(site.heroButtons).toEqual([
    { label: "View projects", href: "/projects", primary: true },
    {
      label: "Contact me",
      href: `mailto:${site.links.email}`,
      primary: false,
    },
  ])
})
