import { expect, test } from "vitest"
import { jsPDF } from "jspdf"
import { fillResumePdf } from "@/lib/resume-pdf"

test("downloadable PDF includes the AI initiatives bullet and AI skills line", () => {
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
  expect(body).toContain("Worked on AI initiatives across the org")
  expect(body).toContain("proof of concepts for conversational agents")
  expect(body).toContain("Silver is Gold")
  expect(body).toContain("AI and tooling")
  expect(doc.getNumberOfPages()).toBe(1)
})
