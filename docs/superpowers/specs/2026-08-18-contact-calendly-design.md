# Contact page Calendly booking card

**Date:** 2026-08-18
**Status:** Approved (Direction C)
**Scope:** Contact page (`/contact`) plus `site.links`. No other routes.

---

## Goal

Give visitors two clear ways to reach Arshiya: the existing contact form, or a Calendly booking link. The form stays the primary path. Booking is a visible sibling option, not an embed.

## User choice

**Direction C: Form plus booking card.** Keep the current form as the main path. Place a booking card above the form. "Book a time" opens Calendly in a new tab.

Rejected:

- **A. Tabs:** Equal-weight Send a message / Book a time tabs with an inline Calendly embed.
- **B. Side by side:** Form and calendar both on screen. Too tall on phones, heavier than needed.

## Non-goals

- Calendly inline embed, popup widget, or third-party Calendly JavaScript
- Changing form fields, Web3Forms behavior, or success/error copy
- Adding Calendly to the homepage, about page, or header nav
- Specifying meeting length in copy (the Calendly event page owns duration)

---

## Page layout

Same personal-theme shell as today: `max-w-[920px]`, `px-6 py-14`, serif H1.

```
┌──────────────────────────────────────────────┐
│  SiteHeader (unchanged)                      │
├──────────────────────────────────────────────┤
│  Contact me                                  │
│  Intro copy (form or book a time)            │
│                                              │
│  ┌─ booking card ─────────────────────────┐  │
│  │  Prefer to talk live?                  │  │
│  │  Book a chat on my calendar.           │  │
│  │  [Book a time]                         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Name / Email / Message / Send message       │
│  (existing ContactForm, unchanged)           │
├──────────────────────────────────────────────┤
│  SiteFooter (contact variant, copy tweak)    │
└──────────────────────────────────────────────┘
```

On all breakpoints the card stacks above the form. No two-column split.

The card uses the same treatment as About: `Card` with `border-playful-border` and `shadow-none`. Inner width follows the form (`max-w-xl`) so the two blocks align.

## Copy

| Surface | Text |
|---------|------|
| H1 | Contact me |
| Intro | Recruiting, collaboration, or a project chat. Send a note, or book a time. |
| Card title | Prefer to talk live? |
| Card body | Book a chat on my calendar. |
| Button | Book a time ↗ |
| Footer note | Prefer email or a calendar invite? Both work. |

No em dashes. Form labels, placeholders, and submit copy stay as they are.

## Interaction

- Button is an `<a>`, styled as a ghost pill: white background, `playful-purple` border and text, `rounded-full`. Matches the mockup, not a second solid purple CTA competing with Send message.
- `href` is `https://calendly.com/arshiyasayyed8/chat-with-arshiya`
- `target="_blank"` and `rel="noreferrer"` (same as footer LinkedIn)
- Visual new-tab cue: trailing `↗` on the button label, consistent with LinkedIn in the footer
- No prefetch of Calendly. The visitor only loads Calendly after they choose to leave.

## Data

Add the URL next to the other public links:

```ts
site.links.calendly = "https://calendly.com/arshiyasayyed8/chat-with-arshiya"
```

`CalendlyBookingCard` reads from `site.links.calendly`. Do not hardcode the URL in JSX.

## Components

### New: `CalendlyBookingCard`

File: `web/src/components/CalendlyBookingCard.tsx`

Renders the card title, body, and Calendly link. Reads `site.links.calendly`. Used only on `/contact` in this spec.

### Modified

| File | Change |
|------|--------|
| `web/src/lib/content.ts` | Add `site.links.calendly` |
| `web/src/routes/_personal/contact.tsx` | Update intro. Render `CalendlyBookingCard` above `ContactForm`. |
| `web/src/components/SiteFooter.tsx` | Contact variant note only. Link row stays Email, LinkedIn, Home. |

## Accessibility

- Card heading is a real heading (`h2`) so the page outline is Contact me, then Prefer to talk live?, then the form.
- The booking control is a link, not a button pretending to navigate.
- New-tab behavior is visible (`↗`). Use `rel="noreferrer"`, matching footer LinkedIn.
- Form remains keyboard-complete. Card does not trap focus.
- Do not load an iframe (nothing to announce or skip).

## Testing

- Contact page shows the card above the form.
- Booking link href equals `site.links.calendly` and opens in a new browsing context (`target="_blank"`).
- Existing form fields and submit path still render.
- Intro and footer copy match the table above (no leftover em dash in the contact intro).

## Success criteria

1. A visitor can choose form or calendar without hunting.
2. The form still reads as the default. Booking is one click, not a widget takeover.
3. No Calendly script or iframe on the page.
4. About, home, and work pages are unchanged.

## Risks

| Risk | Mitigation |
|------|------------|
| Booking feels hidden under the intro | Card sits above the form, not below it |
| Two purple buttons compete | Ghost outline on Book a time, solid purple stays on Send message |
| Calendly URL drift | Single source in `site.links.calendly` |
