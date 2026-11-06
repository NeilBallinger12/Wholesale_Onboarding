# WelcomeTour (React)

Scroll-driven Wholesale welcome tour: UK map → zoom into the office tower → street builds around it →
Ethernet cable → router → office → handset → network diagram (Manage / Track orders / Raise issues) →
"Ready to explore?" link cards.

## Install

```bash
npm i gsap@^3.13.0      # ScrollTrigger, SplitText and DrawSVG are all free and included
```

Copy this `WelcomeTour/` folder into your project. It works with React 17, 18 and 19 and has no other dependencies.
Lenis is **not** needed: the component scrolls itself and uses ScrollTrigger's `scrub` smoothing.

## Usage

```tsx
import { WelcomeTourContent } from './WelcomeTour';

{showTour && (
  <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>   {/* or your full-screen modal */}
    <WelcomeTourContent
      userName={user.firstName}
      onComplete={() => setShowTour(false)}
      onNavigate={dest => router.push(ROUTES[dest])}
    />
  </div>
)}
```

**The parent must have a defined height.** The component fills its parent and is its own scroll container, so it works the
same inside a modal or as a full page.

## Props

| Prop | Type | Behaviour |
|---|---|---|
| `onComplete` | `() => void` | Called by **Skip tour** (top right, always visible), and after a link card is chosen. |
| `onNavigate` | `(dest: TourDestination) => void` | Optional. Called when a "Ready to explore?" card is clicked, before `onComplete`. `dest` is `'order' \| 'orders' \| 'billing' \| 'inventory' \| 'training'`. |
| `userName` | `string?` | Renders "Hey {name},". Falls back to "Hey there," if empty. |

**Start tour** smooth-scrolls to the start of the tour (the map zoom). It does not call `onComplete`.

## Files

| File | What it does |
|---|---|
| `WelcomeTourContent.tsx` | Markup, copy and the link cards. Edit text here. |
| `animations.ts` | Every timeline: the intro on load, the Part 1 scroll, the map → street hand-off and Parts 2–4, and the network section. |
| `scene/buildMap.ts` | The map and its buildings, including `towerMarkup()`, the mini office tower the tour zooms into. Built twice (intro + zoom copy). |
| `scene/mapData.ts` | Map outline and building artwork from the Figma assets, `PLACES` and `ZOOM_BUILDING`. |
| `scene/buildStreet.ts` | Street (both sides of the tower), office block, router window, cable and green lines. Exports `OFFICE`, `WIN`, `FY`. |
| `scene/buildOffice.ts` | Office interior and the animated people. |
| `scene/buildNetwork.ts` | You → sub-resellers → end customers diagram, order chips, issue ticket. Sample names live here. |
| `scene/camera.ts` | Fits the camera (SVG `viewBox`) into the subject area for the container's current size. |
| `scene/iso.ts` | Isometric projection and SVG helpers. |
| `WelcomeTour.css` | All styles, scoped under `.wt-root`. |

## How it's built

- **Pinning** uses CSS `position: sticky` inside the component's own scroller, not ScrollTrigger `pin`. That's what lets it run
  inside a modal without jitter.
- **Scroll length** is set in CSS: `.wt-p1` is 3.2× the container height, `.wt-p2` 11.5× and `.wt-p3` 12×. The scroll distance of each
  part is its height minus one screen. Change these to speed up or slow down a part.
- **Seamless map hand-off:** `.wt-p2` has `margin-top: -1 screen`, so the tour sticks at the exact scroll position where Part 1 unsticks.
  The tour opens on a second copy of the map (`.wt-mapZoom`), placed from the intro map's `getScreenCTM()` so it sits on exactly the
  same pixels. While the tour is active the intro is hidden, and it's shown again on scrolling back.
- **Tower swap:** the map's front building is a scaled copy of the street's office block. The zoom ends with it on the same centre line,
  base and width as the street tower at camera `kz`, so the crossfade is an exact overlay.
- **Two timelines for Parts 2–4:** `camTl` holds only the camera (`viewBox`) moves. They depend on the container size, so `camTl` is invalidated
  and re-measured on every refresh or resize. `tl` holds everything that's drawn, revealed or faded, and is never invalidated. Keep `from()`
  tweens and staggers out of `camTl`: invalidating them makes staggered items show early.
- **Responsive:** layout switches at a container width of 760px via a container query (keep it in sync with `NARROW` in `camera.ts`).
  Sizes use container units, so the tour adapts to its box rather than the window. A `ResizeObserver` re-measures on any size change.
- **Reduced motion:** the intro jumps to its end state, scroll scrubbing loses its smoothing, and the ambient loops (people typing) are
  turned off.
- **StrictMode-safe:** the effect's cleanup reverts every tween, ScrollTrigger and SplitText, and empties the SVGs. SVG ids are prefixed with a
  per-instance `useId`.

## Things to set for production

- **Brand font:** set `--wt-font` on `.wt-root`. The component waits for `document.fonts.ready` before splitting text.
- **Logo:** replace the `wt-logo` placeholder in `WelcomeTourContent.tsx`.
- **Green accent:** `--wt-green` is currently `#00A651`. Confirm the brand value.
- **Subline copy:** "Whether dedicated internet access…" still needs its full text.
- **Sample data:** reseller, customer, order and ticket names in `buildNetwork.ts` are placeholders.
- **Next.js:** the component file starts with `'use client'`. With the Pages Router, global CSS can only be imported from `_app.tsx`, so move
  the `import './WelcomeTour.css'` there.
