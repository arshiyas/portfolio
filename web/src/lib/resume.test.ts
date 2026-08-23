import { expect, test } from "vitest"
import { resume } from "@/lib/resume"

const lyft = resume.experience.find((role) => role.company === "Lyft")

test("Lyft bullets include a measured agent-eval and adopted skill", () => {
  expect(lyft).toBeDefined()
  expect(lyft?.bullets).toContain(
    "Rolled out AGENTS.md across ten backend repos and published a before/after eval: three repos failed without it, and one dropped from 30-plus turns to a single-turn answer. Shipped a Cursor/Claude dashboard-migration skill the platform team adopted, and co-built the operational-health dashboard",
  )
})

test("skills include an AI and tooling line", () => {
  expect(resume.skills).toContain(
    "AI and tooling: Cursor, Claude, AGENTS.md, evals, agent skills, WebLLM",
  )
})
