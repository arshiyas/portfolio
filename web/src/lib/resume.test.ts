import { expect, test } from "vitest"
import { resume } from "@/lib/resume"

const lyft = resume.experience.find((role) => role.company === "Lyft")

test("Lyft bullets include AI-enabled OE, org AI initiatives, and Cursor/Claude", () => {
  expect(lyft).toBeDefined()
  expect(lyft?.bullets).toContain(
    "Built an AI-enabled operational-excellence dashboard so teams can track tech debt and cut operational burden. Worked on AI initiatives across the org, and write day-to-day code in Cursor and Claude",
  )
})

test("skills include an AI and tooling line", () => {
  expect(resume.skills).toContain(
    "AI and tooling: Cursor, Claude, AGENTS.md, evals, agent skills, WebLLM",
  )
})
