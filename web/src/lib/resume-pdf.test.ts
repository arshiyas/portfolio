import { expect, test } from "vitest"
import { jsPDF } from "jspdf"
import { fillResumePdf } from "@/lib/resume-pdf"

test("downloadable PDF includes the agent-eval bullet and AI skills line", () => {
  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const chunks: string[] = []
  const original = doc.text.bind(doc)
  doc.text = ((text: string | string[], x: number, y: number) => {
    if (typeof text === "string") chunks.push(text)
    else chunks.push(...text)
    return original(text, x, y)
  }) as typeof doc.text

  fillResumePdf(doc)

  const body = chunks.join(" ")
  expect(body).toContain("AGENTS.md")
  expect(body).toContain("Cursor/Claude")
  expect(body).toContain("AI and tooling")
  expect(doc.getNumberOfPages()).toBe(1)
})
