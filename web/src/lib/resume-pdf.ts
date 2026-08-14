import { resume } from "@/lib/resume"

const MARGIN = 50
const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const BODY_SIZE = 10
const BODY_LINE = 12
const SECTION_SIZE = 11
const NAME_SIZE = 17
const BULLET_INDENT = 12

type JsPDFDoc = import("jspdf").jsPDF

function ensureSpace(doc: JsPDFDoc, y: number, needed: number) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function writeLine(doc: JsPDFDoc, text: string, x: number, y: number, lineHeight = BODY_LINE) {
  y = ensureSpace(doc, y, lineHeight)
  doc.text(text, x, y)
  return y + lineHeight
}

function writeWrapped(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = BODY_LINE,
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  for (const line of lines) {
    y = writeLine(doc, line, x, y, lineHeight)
  }
  return y
}

function writeSection(doc: JsPDFDoc, title: string, y: number) {
  y = ensureSpace(doc, y, 22)
  y += 5
  doc.setFont("helvetica", "bold")
  doc.setFontSize(SECTION_SIZE)
  doc.text(title.toUpperCase(), MARGIN, y)
  y += 12
  doc.setFont("helvetica", "normal")
  doc.setFontSize(BODY_SIZE)
  return y
}

function writeBullet(doc: JsPDFDoc, text: string, y: number) {
  const textX = MARGIN + BULLET_INDENT
  const textWidth = CONTENT_WIDTH - BULLET_INDENT
  const lines = doc.splitTextToSize(text, textWidth) as string[]

  y = ensureSpace(doc, y, BODY_LINE)
  doc.text("-", MARGIN + 1, y)
  doc.text(lines[0] ?? "", textX, y)
  y += BODY_LINE

  for (let i = 1; i < lines.length; i++) {
    y = writeLine(doc, lines[i], textX, y)
  }

  return y + 1
}

export async function downloadResumePdf() {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "letter", compress: true })

  doc.setProperties({
    title: `${resume.name} - Resume`,
    subject: "Resume",
    author: resume.name,
    keywords: "backend engineer, software engineer, python, go, aws, lyft",
  })

  let y = MARGIN

  doc.setFont("helvetica", "bold")
  doc.setFontSize(NAME_SIZE)
  y = writeLine(doc, resume.name, MARGIN, y, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(BODY_SIZE)
  y = writeWrapped(doc, `${resume.headline} · ${resume.location}`, MARGIN, y, CONTENT_WIDTH)
  y = writeWrapped(doc, `${resume.email}  |  ${resume.phone}`, MARGIN, y, CONTENT_WIDTH)
  y = writeWrapped(
    doc,
    `linkedin.com/in/arshiyasayyed  |  ${resume.portfolioLabel}`,
    MARGIN,
    y,
    CONTENT_WIDTH,
  )
  y += 6

  y = writeSection(doc, "Summary", y)
  y = writeWrapped(doc, resume.summary, MARGIN, y, CONTENT_WIDTH)
  y += 3

  y = writeSection(doc, "Skills", y)
  for (const skill of resume.skills) {
    y = writeBullet(doc, skill, y)
  }
  y += 2

  y = writeSection(doc, "Experience", y)
  for (const role of resume.experience) {
    y = ensureSpace(doc, y, 28)
    doc.setFont("helvetica", "bold")
    y = writeWrapped(doc, role.title, MARGIN, y, CONTENT_WIDTH)
    doc.setFont("helvetica", "normal")
    y = writeWrapped(
      doc,
      `${role.company} | ${role.location} | ${role.period}`,
      MARGIN,
      y,
      CONTENT_WIDTH,
    )
    y += 1

    for (const bullet of role.bullets) {
      y = writeBullet(doc, bullet, y)
    }
    y += 4
  }

  y = writeSection(doc, "Education", y)
  for (const item of resume.education) {
    y = writeWrapped(doc, `${item.degree} - ${item.school}`, MARGIN, y, CONTENT_WIDTH)
    y += 1
  }

  doc.save("Arshiya-Sayyed-Resume.pdf")
}
