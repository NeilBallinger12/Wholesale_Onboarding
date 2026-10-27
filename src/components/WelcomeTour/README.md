# WelcomeTourContent

Scroll-driven onboarding tour for the Wholesale portal (React + TypeScript + GSAP).

## Install

```bash
npm i gsap@^3.13.0      # all plugins used (ScrollTrigger, SplitText, DrawSVG) are free and included
```

Copy this `WelcomeTour/` folder into your project. It works with React 17, 18 and 19 and has no other dependencies.

## Usage

```tsx
import { WelcomeTourContent } from './WelcomeTour';

{showTour && (
  <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>   {/* or your full-screen modal */}
    <WelcomeTourContent userName={user.firstName} onComplete={() => setShowTour(false)} />
  </div>
)}
```

**The parent must have a defined height.** The component fills its parent and is its own scroll container, so it works the same inside a modal or as a full page.

## Props

| Prop | Type | Behaviour |
|---|---|---|
| `onComplete` | `() => void` | Called by **Skip tour** (top-right, always visible) and by **Get started** (shown at the end of the tour). |
| `userName` | `string?` | Renders "Hey {name},". Falls back to "Hey there," if empty. |

**Start tour** smooth-scrolls into Part 2. It does **not** call `onComplete`.

## How it's built

| File | What it does |
|---|---|
| `WelcomeTourContent.tsx` | Markup and copy. Edit text here. |
| `animations.ts` | Every timeline: the intro on load, the Part 1 scroll (buildings rising), and the Parts 2–4 scroll. |
| `scene/buildMap.ts` | Map plus the seven buildings from the Figma assets (`scene/mapData.ts`). |
| `scene/buildStreet.ts` | Street, office block, cable and router. |
| `scene/buildOffice.ts` | Office interior and the animated people. |
| `scene/camera.ts` | Fits the camera (SVG `viewBox`) to the subject area. |
| `WelcomeTour.css` | All styles, scoped under `.wt-root` with `wt-` prefixes. |

- **Pinning** uses CSS `position: sticky` inside the component's own scroller, not ScrollTrigger `pin`. That's what lets it run inside a modal without jitter.
- **Scroll length** is set in CSS: `.wt-p1` is 3.2× the container height and `.wt-p2` is 9×. Change these to speed up or slow down each part.
- **Cameras** are interpolated between keyframes and recomputed from the live container size, so resizing mid-tour works.
- **Reduced motion:** the intro jumps to its end state, scroll scrubbing loses its smoothing, and the ambient loops (people typing) are turned off.
- **StrictMode-safe:** the effect's cleanup reverts every tween and SplitText and clears the SVGs.

## Things to set for production

- **Brand font:** set `--wt-font` on `.wt-root` (it inherits from the host by default). The component waits for `document.fonts.ready` before splitting text.
- **Logo:** replace the `wt-logo` placeholder in `WelcomeTourContent.tsx` with your logo.
- **Green accent:** `--wt-green` is currently `#00A651`. Confirm the brand value.
- **Subline copy:** "Whether dedicated internet access…" still needs its full text.
- **Next.js:** the file starts with `'use client'`. With the Pages Router, global CSS can only be imported from `_app.tsx`. Either move the CSS import there, or rename the file to `WelcomeTour.module.css` and wrap its rules in `:global(...)`.
