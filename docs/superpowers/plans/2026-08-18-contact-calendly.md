# Contact Calendly Booking Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Calendly booking card above the existing contact form so visitors can send a note or open a calendar invite in a new tab.

**Architecture:** Store the Calendly URL on `site.links`. A small `CalendlyBookingCard` component renders the card and link. The contact route places it above `ContactForm`. Footer contact-variant copy mentions calendar invites. No Calendly script or iframe.

**Tech Stack:** TanStack Router, React 19, Vitest, Testing Library, existing Card/Button and `playful-*` tokens.

**Spec:** `docs/superpowers/specs/2026-08-18-contact-calendly-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `web/vitest.config.ts` | jsdom test runner (repo has Vitest but no tests yet) |
| `web/src/lib/content.ts` | `site.links.calendly` URL |
| `web/src/components/CalendlyBookingCard.tsx` | Booking card UI and Calendly link |
| `web/src/components/CalendlyBookingCard.test.tsx` | Card behavior tests |
| `web/src/routes/_personal/contact.tsx` | Intro copy + card above form |
| `web/src/routes/_personal/contact.test.tsx` | Page composition tests |
| `web/src/components/SiteFooter.tsx` | Contact footer note |

---

### Task 1: Vitest jsdom config

**Files:**
- Create: `web/vitest.config.ts`

- [ ] **Step 1: Add Vitest config**

```ts
import { defineConfig } from "vitest/config"
import viteReact from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [viteReact()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
})
```

- [ ] **Step 2: Confirm runner starts with no tests**

Run: `cd web && npm test`

Expected: Vitest exits 0 or reports no test files. If it errors on config, fix config before Task 2.

---

### Task 2: Add Calendly URL

**Files:**
- Modify: `web/src/lib/content.ts` (`site.links`)
- Test: `web/src/lib/content.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from "vitest"
import { site } from "@/lib/content"

test("exposes the Calendly chat URL", () => {
  expect(site.links.calendly).toBe(
    "https://calendly.com/arshiyasayyed8/chat-with-arshiya",
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run src/lib/content.test.ts`

Expected: FAIL because `site.links.calendly` is undefined / not on the type.

- [ ] **Step 3: Add the URL**

In `site.links`, next to `email`:

```ts
links: {
  linkedin: "https://www.linkedin.com/in/arshiyasayyed/",
  email: "arshiyasayyed8@gmail.com",
  calendly: "https://calendly.com/arshiyasayyed8/chat-with-arshiya",
},
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run src/lib/content.test.ts`

Expected: PASS

---

### Task 3: CalendlyBookingCard

**Files:**
- Create: `web/src/components/CalendlyBookingCard.tsx`
- Test: `web/src/components/CalendlyBookingCard.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { CalendlyBookingCard } from "@/components/CalendlyBookingCard"
import { site } from "@/lib/content"

test("links Book a time to Calendly in a new tab", () => {
  render(<CalendlyBookingCard />)

  const link = screen.getByRole("link", { name: /book a time/i })
  expect(link).toHaveProperty("href", site.links.calendly)
  expect(link.getAttribute("target")).toBe("_blank")
  expect(link.getAttribute("rel")).toBe("noreferrer")
})

test("uses a heading and does not embed Calendly", () => {
  render(<CalendlyBookingCard />)

  expect(
    screen.getByRole("heading", { name: "Prefer to talk live?" }),
  ).toBeTruthy()
  expect(screen.getByText("Book a chat on my calendar.")).toBeTruthy()
  expect(document.querySelector("iframe")).toBeNull()
  expect(document.querySelector("script")).toBeNull()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd web && npx vitest run src/components/CalendlyBookingCard.test.tsx`

Expected: FAIL, module not found.

- [ ] **Step 3: Implement the card**

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { site } from "@/lib/content"

export function CalendlyBookingCard() {
  return (
    <Card className="max-w-xl border-playful-border shadow-none">
      <CardHeader>
        <h2 className="font-serif text-lg font-medium leading-snug">
          Prefer to talk live?
        </h2>
        <CardDescription>Book a chat on my calendar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          className="rounded-full border-playful-purple bg-white px-6 text-playful-purple hover:bg-[#f3ecfb]"
        >
          <a href={site.links.calendly} target="_blank" rel="noreferrer">
            Book a time ↗
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd web && npx vitest run src/components/CalendlyBookingCard.test.tsx`

Expected: PASS

---

### Task 4: Contact page and footer copy

**Files:**
- Modify: `web/src/routes/_personal/contact.tsx`
- Modify: `web/src/components/SiteFooter.tsx` (contact variant `note`)
- Test: `web/src/routes/_personal/contact.test.tsx`

- [ ] **Step 1: Write the failing page tests**

Export `ContactPage` from `contact.tsx` so tests can render it (keep `Route` as the route entry).

```tsx
import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { ContactPage } from "@/routes/_personal/contact"
import { site } from "@/lib/content"

test("offers the form and a Calendly booking link", () => {
  render(<ContactPage />)

  expect(
    screen.getByRole("heading", { name: "Contact me" }),
  ).toBeTruthy()
  expect(
    screen.getByText(
      "Recruiting, collaboration, or a project chat. Send a note, or book a time.",
    ),
  ).toBeTruthy()

  const booking = screen.getByRole("link", { name: /book a time/i })
  expect(booking.getAttribute("href")).toBe(site.links.calendly)

  expect(screen.getByLabelText("Name")).toBeTruthy()
  expect(screen.getByLabelText("Email")).toBeTruthy()
  expect(screen.getByLabelText("Message")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run src/routes/_personal/contact.test.tsx`

Expected: FAIL (ContactPage not exported, or intro still has the old em dash copy, or no booking link).

- [ ] **Step 3: Update the contact page**

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { CalendlyBookingCard } from "@/components/CalendlyBookingCard"
import { ContactForm } from "@/components/ContactForm"

export const Route = createFileRoute("/_personal/contact")({
  head: () => ({
    meta: [{ title: "Contact | Arshiya Sayyed" }],
  }),
  component: ContactPage,
})

export function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold">Contact me</h1>
        <p className="mt-3 leading-relaxed text-claude-muted">
          Recruiting, collaboration, or a project chat. Send a note, or book a
          time.
        </p>
      </div>

      <div className="mt-10">
        <CalendlyBookingCard />
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Update footer contact note**

In `footerContent.contact.note`:

```ts
note: "Prefer email or a calendar invite? Both work.",
```

Do not add a Calendly footer link.

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd web && npx vitest run src/lib/content.test.ts src/components/CalendlyBookingCard.test.tsx src/routes/_personal/contact.test.tsx`

Expected: all PASS

- [ ] **Step 6: Typecheck**

Run: `cd web && npm run typecheck`

Expected: exit 0

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Direction C: card above form | Task 4 |
| New-tab Calendly link, no embed | Task 3 |
| Copy table (intro, card, button, footer) | Tasks 3 to 4 |
| `site.links.calendly` | Task 2 |
| Ghost pill vs solid Send message | Task 3 |
| No Calendly in header/nav/other pages | No edits outside listed files |
| Real `h2` on the card | Task 3 |
| Form unchanged | Task 4 tests still find Name/Email/Message |
