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

test("hero intro is conversational", () => {
  expect(site.heroHeading).toBe("Hi, I'm Arshiya")
  expect(site.heroMemoji).toBe("/images/waving-memoji.png")
  expect(site.lede).toEqual([
    "I build backend features with Lyft Toronto. I shipped products for older and teen riders, and now I work on taking the app to Europe.",
    "I care about making the system reliable and scalable, and giving coding agents enough context so they stop recommending libraries that don't exist.",
  ])
})

test("hero CTA is resume", () => {
  expect(site.heroButtons).toEqual([
    { label: "Resume", href: "/resume", primary: true },
  ])
})

test("featured projects put AI-Assisted Engineering after International Expansion", () => {
  expect(site.featuredProjectSlugs).toEqual([
    "lyft-international",
    "ai-engineering",
    "lyft-teens",
    "lyft-silver",
    "days-gone",
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
