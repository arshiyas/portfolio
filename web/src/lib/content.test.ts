import { expect, test } from "vitest"
import {
  getListedProjects,
  getNextCaseStudy,
  getProjectBySlug,
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

test("featured projects put Silver before Teen after International and AI", () => {
  expect(site.featuredProjectSlugs).toEqual([
    "lyft-international",
    "ai-engineering",
    "lyft-silver",
    "lyft-teens",
    "days-gone",
  ])
})

test("projects page lists International, AI, Silver, Teen, then the rest", () => {
  expect(getListedProjects().map((project) => project.slug)).toEqual([
    "lyft-international",
    "ai-engineering",
    "lyft-silver",
    "lyft-teens",
    "search-skywatch",
    "enterprise-skywatch",
    "ge-microservices",
    "ge-data-pipelines",
    "days-gone",
  ])
})

test("Silver contributions include Silver is Gold with the public campaign post", () => {
  const silver = getProjectBySlug("lyft-silver")
  const item = silver?.caseStudy?.myContribution?.items.find(
    (entry) => entry.title === "Silver is Gold"
  )

  expect(item?.description).toContain("Grandparents Day")
  expect(item?.description).toContain("Billie Jean King")
  expect(item?.link).toEqual({
    label: "Silver is Gold, Lyft Blog",
    url: "https://www.lyft.com/blog/posts/lyft-silver-grandparents-day",
  })
  expect(item?.description).not.toMatch(/Shark Tank/i)
})

test("AI contributions include conversational agents without company-only framing", () => {
  const ai = getProjectBySlug("ai-engineering")
  const item = ai?.caseStudy?.myContribution?.items.find(
    (entry) => entry.title === "Conversational agents for riders"
  )

  expect(item?.description).toContain("proof of concepts")
  expect(item?.description).toContain("ride confirmations")
  expect(item?.description).toContain("Silver")
  expect(item?.description).not.toMatch(/Shark Tank/i)
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
