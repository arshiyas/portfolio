# Homepage Hero Skyline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle Toronto skyline background to the homepage hero only.

**Architecture:** New `HomeHero` wrapper component layers a low-opacity skyline image and warm gradient behind existing hero markup. Background breaks out to full viewport width; content stays in the current `max-w-[920px]` column. One WebP asset in `public/images/`.

**Tech Stack:** TanStack Router, React 19, Tailwind v4, existing `claude-*` tokens.

**Spec:** `docs/superpowers/specs/2026-08-12-homepage-hero-skyline-design.md`

---

### Task 1: Add skyline asset

**Files:**
- Create: `public/images/toronto-skyline.webp`
- Create: `public/images/ATTRIBUTION.md`

- [ ] **Step 1: Download source image**

Use option **A** — wide Toronto skyline from across the water:

https://unsplash.com/photos/a-view-of-the-toronto-skyline-from-across-the-water-rqvB7EjIub0

```bash
cd /Users/arshiya/cursor-projects/portfolio/web
mkdir -p public/images
curl -L "https://unsplash.com/photos/rqvB7EjIub0/download?force=true&w=1600" -o public/images/toronto-skyline.jpg
# convert to webp if needed:
sips -s format webp public/images/toronto-skyline.jpg --out public/images/toronto-skyline.webp
```

If option A looks too busy at low opacity, swap for option B:
https://unsplash.com/photos/mkx_LVlYYkM/download?force=true&w=1600

- [ ] **Step 2: Record attribution**

Create `public/images/ATTRIBUTION.md`:

```markdown
# Image attribution

| File | Source | Author | License |
|------|--------|--------|---------|
| toronto-skyline.webp | https://unsplash.com/photos/rqvB7EjIub0 | Unsplash contributor | Unsplash License |
```

- [ ] **Step 3: Verify file size**

```bash
ls -lh public/images/toronto-skyline.webp
```

Expected: under 250 KB.

---

### Task 2: Create HomeHero component

**Files:**
- Create: `src/components/HomeHero.tsx`

- [ ] **Step 1: Add component**

```tsx
import type { ReactNode } from "react"

type HomeHeroProps = {
  children: ReactNode
}

export function HomeHero({ children }: HomeHeroProps) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="relative overflow-hidden pb-4 pt-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[url('/images/toronto-skyline.webp')] bg-cover bg-[center_70%] opacity-[0.14] sm:opacity-[0.16]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-claude-bg/90 via-claude-bg/70 to-claude-bg"
        />
        <div className="relative mx-auto w-full max-w-[920px] px-6">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Confirm no lint errors**

```bash
npm run lint
```

---

### Task 3: Wire into homepage

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Import HomeHero**

Add:

```tsx
import { HomeHero } from "@/components/HomeHero"
```

- [ ] **Step 2: Wrap hero section**

Replace the opening hero structure so the first `<section>` sits inside `HomeHero`, and remove duplicate horizontal padding from that section (padding moves to `HomeHero` inner wrapper).

Before:

```tsx
<main className="mx-auto w-full max-w-[920px] flex-1 px-6 pb-20 pt-16">
  <section>
    ...
  </section>
```

After:

```tsx
<main className="mx-auto w-full max-w-[920px] flex-1 pb-20 pt-8">
  <HomeHero>
    <section>
      ...
    </section>
  </HomeHero>
```

Keep `px-6` on `<main>` for sections below the hero, OR add `px-6` only to non-hero sections. Simplest approach:

```tsx
<main className="mx-auto w-full max-w-[920px] flex-1 pb-20">
  <HomeHero>
    <section className="pt-12">
      {/* hero content — no px-6 here */}
    </section>
  </HomeHero>

  <div className="px-6">
    <section className="mt-14 border-y ...">...</section>
    <section className="mt-16">...</section>
  </div>
</main>
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open http://localhost:3000/ — skyline should be faint; text readable; Highlights/Selected work unchanged.

---

### Task 4: Verify and clean up

**Files:**
- None new

- [ ] **Step 1: Check mobile**

Resize to 375px width — name and lede must not overlap awkwardly with skyline.

- [ ] **Step 2: Check inner pages**

Visit `/about`, `/experience`, `/projects` — confirm no visual change.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

---

## Self-review checklist

- [x] Spec coverage: asset, component, homepage only, accessibility
- [x] No placeholder steps
- [x] File paths match repo (`web/` prefix for app files)
