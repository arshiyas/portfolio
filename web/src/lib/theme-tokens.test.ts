import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "vitest"

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..")

const customColorClass =
  /(?:^|[\s"'`])(?:(?:hover|focus|focus-visible|group-hover|aria-expanded):)*(?:bg|text|border|ring)-(?:claude|playful)-/m

const hardcodedPalette =
  /#(?:faf9f5|c96442|fff8f3|9b72cf|fff5ef|fffdfb|f3ecfb|e8f5ee|fdeee8|fdf6e8|3d7a55|a67c2a|b55638|f3f0ea|f5f2ea)|rgba\(250,\s*249,\s*245|rgba\(255,\s*248,\s*243/i

const portfolioFiles = [
  "components/SiteFooter.tsx",
  "components/ResumeDocument.tsx",
  "components/PreviewBanner.tsx",
  "components/ProjectGrid.tsx",
  "components/ContactForm.tsx",
  "components/CalendlyBookingCard.tsx",
  "components/HomeHero.tsx",
  "routes/index.tsx",
  "routes/_work/resume.tsx",
  "routes/_work/projects/index.tsx",
  "routes/_personal/about.tsx",
]

test("portfolio chrome uses shadcn semantic color classes", () => {
  for (const relativePath of portfolioFiles) {
    const source = readFileSync(join(srcRoot, relativePath), "utf8")
    expect(source, relativePath).not.toMatch(customColorClass)
    expect(source, relativePath).not.toMatch(hardcodedPalette)
  }
})

test("page theme shells follow --background", () => {
  const css = readFileSync(join(srcRoot, "styles.css"), "utf8")
  expect(css).toMatch(/\.theme-work\s*\{\s*background:\s*var\(--background\)/)
  expect(css).toMatch(
    /\.theme-personal\s*\{\s*background:\s*var\(--background\)/
  )
  expect(css).toMatch(/\.theme-neutral\s*\{[\s\S]*?var\(--background\)/)
})

test("site-page is the shared content column", () => {
  const css = readFileSync(join(srcRoot, "styles.css"), "utf8")
  expect(css).toMatch(/--site-max-width:\s*920px/)
  expect(css).toMatch(
    /\.site-page\s*\{[\s\S]*?max-width:\s*var\(--site-max-width\)/
  )
  expect(css).not.toMatch(/\.site-content-safe/)
})

test("page shells share site-page without extra nested gutters", () => {
  const files = [
    "routes/index.tsx",
    "routes/_work/resume.tsx",
    "routes/_work/projects/index.tsx",
    "routes/_work/projects/$slug.tsx",
    "routes/_personal/about.tsx",
    "routes/__root.tsx",
    "components/SiteFooter.tsx",
  ]
  for (const relativePath of files) {
    const source = readFileSync(join(srcRoot, relativePath), "utf8")
    expect(source, relativePath).toMatch(/site-page/)
    expect(source, relativePath).not.toMatch(/site-content-safe/)
    expect(source, relativePath).not.toMatch(/max-w-\[920px\]/)
  }

  const home = readFileSync(join(srcRoot, "routes/index.tsx"), "utf8")
  expect(home.match(/site-page/g)).toHaveLength(1)
})

test("Days Gone keeps custom claude tokens", () => {
  const source = readFileSync(
    join(srcRoot, "components/days-in-canada/DaysInCanadaApp.tsx"),
    "utf8"
  )
  expect(source).toMatch(/text-claude-text/)
  expect(source).toMatch(/border-claude-border/)
  expect(source).toMatch(/bg-claude-accent/)
})
