# Homepage Hero Skyline — Design Spec

**Date:** 2026-08-12  
**Status:** Approved (Direction A)  
**Scope:** Homepage hero only; all other pages unchanged.

---

## Goal

Add a faint Toronto skyline to the homepage hero so the site has a subtle sense of place without changing the warm, text-first portfolio tone.

## User choice

**Direction A — Subtle:** Faint skyline in the homepage hero only. Highlights, selected work, about, experience, projects, writing, and Days Gone stay as-is.

## Non-goals

- Toronto imagery on inner pages or footer
- Full site redesign or card unification (deferred)
- Dark mode, parallax, or animated backgrounds
- New photography on case studies or about page

---

## Visual design

### Hero layout

The existing hero content (eyebrow, name, Lyft logo, lede, stack badges, CTAs, social link) stays in the same order and copy. It moves into a new `HomeHero` wrapper that adds a background layer behind the text.

```
┌──────────────────────────────────────────────┐
│  SiteHeader (unchanged)                      │
├──────────────────────────────────────────────┤
│  ┌─ hero band (full viewport width) ─────┐  │
│  │  [skyline image, ~12–18% opacity]      │  │
│  │  [warm gradient: claude-bg → transparent]│
│  │                                        │  │
│  │  Backend engineer · Toronto            │  │
│  │  Arshiya Sayyed                        │  │
│  │  …existing hero content…               │  │
│  └────────────────────────────────────────┘  │
│  Highlights (unchanged)                      │
│  Selected work (unchanged)                   │
└──────────────────────────────────────────────┘
```

### Image treatment

- **Subject:** Wide Toronto skyline with CN Tower; pale or overcast sky preferred (blends with `#faf9f5` palette).
- **Opacity:** Image layer at **12–18%** opacity via CSS, not a pre-edited file.
- **Overlay:** Linear gradient from `var(--claude-bg)` at 85% opacity (top) to transparent (bottom), so text contrast stays WCAG-friendly.
- **Position:** `background-position: center 70%` — skyline sits low in the frame; text reads in the upper area.
- **Size:** `background-size: cover`; on mobile, slightly zoomed (`110%`) so the tower doesn’t crowd the name.

### Asset

**Requirement:** A **wide panoramic skyline** — multiple downtown towers, ideally shot from across the water (Toronto Islands / harbour). Not a CN Tower close-up or single-building crop.

| Option | Preview | Notes |
|--------|---------|-------|
| **A (recommended)** | [Skyline from across the water](https://unsplash.com/photos/a-view-of-the-toronto-skyline-from-across-the-water-rqvB7EjIub0) | Panoramic view from Toronto Islands; full downtown row, daylight, pale sky — best fit for subtle hero |
| **B** | [Skyline with CN Tower + Rogers Centre](https://unsplash.com/photos/toronto-skyline-with-cn-tower-and-rogers-centre-across-water-mkx_LVlYYkM) | Jim Luo; harbour foreground, recognizable landmarks but still a true skyline |
| **C** | [Pexels sunset skyline](https://www.pexels.com/photo/toronto-skyline-with-cn-tower-at-sunset-32969094/) | Warmer/oranger — may clash with cream palette unless heavily washed |

| Field | Value |
|-------|-------|
| Source | Unsplash photo **rqvB7EjIub0** (option A) |
| License | [Unsplash License](https://unsplash.com/license) |
| Stored at | `public/images/toronto-skyline.webp` |
| Format | WebP, ~1600px wide, quality ~80 |

Fallback: same image as `.jpg` in `public/images/` for older browsers if needed.

### Accessibility

- Background is **decorative** — `aria-hidden="true"` on the image layer; no alt text on a visible `<img>` that affects layout.
- If using `<img>`, use `alt=""` and `role="presentation"`.
- Respect `prefers-reduced-motion`: no animation (static only).
- Text contrast unchanged from current hero.

### Responsive

| Breakpoint | Behavior |
|------------|----------|
| `< sm` | Hero band extends edge-to-edge; content keeps `px-6`; image opacity 12% |
| `≥ sm` | Opacity 15%; gradient slightly softer |
| `≥ lg` | Max content width unchanged (`920px`); hero background spans full viewport width |

---

## Technical approach

### New files

- `src/components/HomeHero.tsx` — wrapper with skyline background + children slot
- `public/images/toronto-skyline.webp` — optimized asset

### Modified files

- `src/routes/index.tsx` — wrap first `<section>` in `<HomeHero>`
- `src/styles.css` — optional `.home-hero` utility classes if needed (prefer Tailwind in component)

### Component API

```tsx
<HomeHero>
  {/* existing hero section children */}
</HomeHero>
```

`HomeHero` responsibilities:

1. Full-bleed background (negative margin or breakout from `max-w` container)
2. Layered skyline + gradient
3. Inner content constrained to same width/padding as today

### Header interaction

No header changes in v1. Header remains sticky with current `theme-neutral` styling. If the skyline peeks behind the header, the existing header background is opaque enough to mask it.

---

## Success criteria

1. First-time visitor notices slightly more depth on the homepage, not a “stock photo website.”
2. Hero text is as readable as before on desktop and mobile.
3. No layout shift on load (image dimensions reserved or CSS-only background).
4. Inner pages pixel-identical to before.
5. Asset committed with clear source in this spec.

## Risks

| Risk | Mitigation |
|------|------------|
| Image feels cheesy | Low opacity + warm gradient; pick pale-sky photo |
| LCP regression | WebP, reasonable size, `fetchpriority="high"` if using `<img>` |
| Full-bleed breaks max-width | Break out only the background; keep content in `max-w-[920px]` |
