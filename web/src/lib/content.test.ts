import { expect, test } from "vitest"
import {
  getNextCaseStudy,
  getProjectsWithCaseStudies,
  site,
} from "@/lib/content"

test("exposes the Calendly chat URL", () => {
  expect(site.links.calendly).toBe(
    "https://calendly.com/arshiyasayyed8/chat-with-arshiya"
  )
})

test("hero role is Software Engineer without a level", () => {
  expect(site.tagline).toBe("Software Engineer")
})

test("hero CTA is resume", () => {
  expect(site.heroButtons).toEqual([
    { label: "Resume", href: "/resume", primary: true },
  ])
})

test("next case study follows listing order and wraps", () => {
  const caseStudies = getProjectsWithCaseStudies()
  expect(caseStudies.length).toBeGreaterThan(1)

  const first = caseStudies[0]
  const second = caseStudies[1]
  const last = caseStudies[caseStudies.length - 1]
  if (!first || !second || !last) {
    throw new Error("expected at least two case studies")
  }

  expect(getNextCaseStudy(first.slug)?.slug).toBe(second.slug)
  expect(getNextCaseStudy(last.slug)?.slug).toBe(first.slug)
  expect(getNextCaseStudy("lyft-international")?.slug).toBe("ai-engineering")
})
