# TripDetails Page — Redesign Spec

## Summary

Replace the current TripDetails layout (plain grid, inconsistent styling) with a viewport-locked, city-by-city navigation experience that matches the index page's design language.

## Design Language

Inherits everything from App.jsx:
- Background: `#f5f0e8` (warm cream)
- Dark surface: `#1a1208`
- Accent: `#c9962a` (gold)
- Headings: Georgia serif
- Body: DM Sans / Segoe UI
- All styles inline (no separate CSS file)

## Layout — Three Zones

The page is `100dvh` tall and never scrolls as a document. It is divided into three fixed zones stacked vertically:

### 1. Header (compact, fixed height ~70px)

- Same dark background (`#1a1208`) and diagonal pattern as the index hero
- Left: back button (`← All trips`, gold, uppercase) | vertical divider | trip number label + trip name (Georgia serif, italic gold em)
- Right: stop count and day count as stat pills (matching index hero stat style)
- No page scroll — header always visible

### 2. Main Split (fills remaining height between header and footer)

Two columns, side by side, no gap:

| Column | Width | Content |
|--------|-------|---------|
| Map | 40% | Leaflet MapContainer, fixed, always shows full trip route. Active city marker is visually distinct (larger / pulsing). |
| Detail | 60% | Shows data for the **current city**. For now: city name (Georgia, large), duration badge. Placeholder for Phase 2 content. Scroll hint (↑ ↓) at bottom. |

The detail column transitions between cities (fade or slide) as the user scrolls. The map pans/zooms to keep the active city marker centred.

### 3. Footer Tape (fixed height ~38px, dark `#1a1208`)

A horizontally centred "tape" of city names. Only a window of ~7 cities is visible at a time:

```
Delhi   Jaipur   Chittorgarh   [Udaipur]   Kumbhalgarh   Ahmedabad   Kevadiya
  ←dim               dim          active        dim             dim→
```

- No separators or dots between city names
- Active city: slightly larger font, subtle gold background pill, full-brightness text
- Cities to the left (visited): progressively smaller and darker, fading into the edge gradient
- Cities to the right (upcoming): same fade treatment
- Both edges have a hard gradient fade to `#1a1208` so the tape reads as infinite
- The tape translates horizontally (CSS `transform: translateX`) to keep the active city centred
- Transition: `0.35s cubic-bezier(.4,0,.2,1)` on transform and per-city colour/size

## Scroll / Navigation Mechanic

- Wheel and touch events on the page body are intercepted (`preventDefault`)
- Each scroll tick (or swipe) advances or retreats by one city
- Debounced: one city change per scroll gesture to prevent skipping
- Keyboard: `↓` / `→` = next city, `↑` / `←` = previous city
- At the last city: a "end of trip" state appears in the detail column (Phase 2 decides exact element)

## State

Single `currentIndex` integer (0 → cities.length - 1). Everything (map focus, detail content, footer tape position) is derived from this.

## What Is Out of Scope for This Phase

- The detail column content beyond city name + duration (Phase 2)
- The "next trip" transition element at the end
- Mobile / touch responsiveness tweaks (separate pass)

## Files Affected

- `src/TripDetails.jsx` — full rewrite
- `src/App.jsx` — no changes needed (already passes `trip`, `index`, `onBack` props correctly)
