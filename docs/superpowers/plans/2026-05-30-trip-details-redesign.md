# TripDetails Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `src/TripDetails.jsx` into a viewport-locked, city-by-city navigation experience with a compact dark header, a 40/60 map+detail split, and a sliding footer tape.

**Architecture:** Single component file. One `currentIndex` integer (0 → cities.length-1) is the only state that matters — everything (map focus, detail content, footer tape position) is derived from it. Wheel and keyboard events are intercepted on `document` to advance the index. A 500 ms cooldown ref prevents skipping. Two internal sub-components (`BoundsInit`, `CityFocuser`) live inside the Leaflet `MapContainer` and use the `useMap()` hook.

**Tech Stack:** React 19, react-leaflet 5, Leaflet 1.9, inline styles only (no CSS files added), DM Sans + Georgia fonts (already loaded).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Rewrite | `src/TripDetails.jsx` | All layout, state, scroll intercept, map sub-components, footer tape |
| No change | `src/App.jsx` | Already passes `trip`, `index`, `onBack` props correctly |

---

## Task 1 — Viewport shell + header

**Files:**
- Rewrite: `src/TripDetails.jsx`

- [ ] **Replace the entire file** with the shell below. It sets up the three fixed zones (header, main, footer) and renders the header fully. The main and footer are placeholder-coloured boxes for now.

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function parseDays(dur) {
  const d = dur.toLowerCase();
  if (d.includes('month')) return parseFloat(d) * 30;
  if (d.includes('week'))  return parseFloat(d) * 7;
  if (d.includes('½') || d.includes('0.5')) return 0.5;
  return parseFloat(d) || 1;
}

// Placeholder sub-components — replaced in later tasks
function MapColumn() {
  return <div style={{ width: '40%', background: '#c8d5c0', flexShrink: 0 }} />;
}
function DetailColumn({ city }) {
  return <div style={{ flex: 1, background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1a1208' }}>{city?.city}</span>
  </div>;
}
function FooterTape() {
  return <div style={{ height: 38, background: '#1a1208' }} />;
}

export default function TripDetails({ trip, index, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cities = trip.cities;
  const totalDays = Math.round(cities.reduce((s, c) => s + parseDays(c.dur), 0));
  const activeCity = cities[currentIndex];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#f5f0e8',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: '#1a1208', color: '#f5f0e8', flexShrink: 0,
        padding: '0 2rem', height: 68, display: 'flex', alignItems: 'center',
        gap: '1.25rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* diagonal pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,150,42,0.04) 40px, rgba(201,150,42,0.04) 41px)',
        }} />

        {/* Back button */}
        <button onClick={onBack} style={{
          position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
          color: '#c9962a', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: 'inherit', fontWeight: 600, flexShrink: 0, padding: 0,
        }}>
          ← All trips
        </button>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 32, background: '#3a3020', flexShrink: 0, position: 'relative' }} />

        {/* Trip label + name */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#c9962a', marginBottom: 2 }}>
            SuperTrip {String(index + 1).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {trip.name}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0, position: 'relative' }}>
          {[
            [cities.length, 'Stops'],
            [`${totalDays}+`, 'Days'],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#c9962a', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6a6055', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <MapColumn />
        <DetailColumn city={activeCity} />
      </div>

      {/* ── FOOTER TAPE ── */}
      <FooterTape />
    </div>
  );
}
```

- [ ] **Run the dev server** (`npm run dev`) and open the trip detail view. Confirm: full viewport coverage, dark header with back/name/stats, green placeholder for map, cream placeholder for detail, dark footer strip. Nothing scrolls.

- [ ] **Commit**
```bash
git add src/TripDetails.jsx
git commit -m "feat: viewport shell and header for TripDetails redesign"
```

---

## Task 2 — Scroll / keyboard intercept

**Files:**
- Modify: `src/TripDetails.jsx`

- [ ] **Add the scroll intercept** — insert this `useEffect` inside `TripDetails`, below the `activeCity` line:

```jsx
  const lastScrollTime = useRef(0);

  const advance = useCallback((dir) => {
    setCurrentIndex(i => Math.max(0, Math.min(cities.length - 1, i + dir)));
  }, [cities.length]);

  useEffect(() => {
    const COOLDOWN = 500;

    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      lastScrollTime.current = now;
      advance(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') advance(1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  advance(-1);
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
    };
  }, [advance]);
```

- [ ] **Verify in browser**: open the detail view, scroll the mouse wheel — the city name in the cream column should cycle through the trip stops one at a time. Arrow keys should do the same. Rapid spinning of the wheel should not skip more than one city per 500 ms.

- [ ] **Commit**
```bash
git add src/TripDetails.jsx
git commit -m "feat: scroll and keyboard city navigation"
```

---

## Task 3 — Map column (40 %)

**Files:**
- Modify: `src/TripDetails.jsx`

- [ ] **Replace the `MapColumn` placeholder** with two new sub-components and a real `MapColumn`. Add these above the `TripDetails` export (after the Leaflet icon fix block):

```jsx
// Fits the full route on first render only
function BoundsInit({ positions }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || positions.length === 0) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    done.current = true;
  }, [positions, map]);
  return null;
}

// Pans smoothly to the active city whenever it changes
function CityFocuser({ position }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (!position) return;
    const key = position.join(',');
    if (prev.current === key) return;
    prev.current = key;
    map.panTo(position, { animate: true, duration: 0.5 });
  }, [position, map]);
  return null;
}

function MapColumn({ positions, activePosition }) {
  return (
    <div style={{ width: '40%', flexShrink: 0, position: 'relative' }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%', background: '#eae8e0' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <BoundsInit positions={positions} />
        {activePosition && <CityFocuser position={activePosition} />}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: '#c9962a', weight: 3, opacity: 0.7, dashArray: '6, 14' }}
          />
        )}
        {activePosition && (
          <Marker position={activePosition} />
        )}
      </MapContainer>
    </div>
  );
}
```

- [ ] **Update `MapColumn` usage** inside the JSX — replace `<MapColumn />` with:

```jsx
<MapColumn
  positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
  activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
/>
```

- [ ] **Verify in browser**: map renders in the left 40 %, full route polyline visible, marker sits on the active city. Scrolling advances the city and the map pans to the new marker position. Scroll wheel does not zoom the map (wheel is intercepted by the page).

- [ ] **Commit**
```bash
git add src/TripDetails.jsx
git commit -m "feat: Leaflet map column with route polyline and active city panning"
```

---

## Task 4 — Detail column (60 %)

**Files:**
- Modify: `src/TripDetails.jsx`

- [ ] **Replace the `DetailColumn` placeholder** with a version that fades between cities:

```jsx
function DetailColumn({ city, cityIndex, total }) {
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState({ city, cityIndex });

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayed({ city, cityIndex });
      setVisible(true);
    }, 150);
    return () => clearTimeout(t);
  }, [city, cityIndex]);

  const { city: c, cityIndex: ci } = displayed;

  return (
    <div style={{
      flex: 1, background: '#faf7f2',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', gap: '0.75rem',
      borderLeft: '1px solid #e0d8cc',
      transition: 'opacity 0.15s ease',
      opacity: visible ? 1 : 0,
    }}>
      {/* City counter */}
      <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#8a7a65' }}>
        City {ci + 1} of {total}
      </div>

      {/* City name */}
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1a1208', textAlign: 'center', lineHeight: 1.1 }}>
        {c?.city}
      </div>

      {/* Duration badge */}
      <div style={{ fontSize: 12, color: '#6a6055', background: 'rgba(201,150,42,0.12)', padding: '5px 16px', borderRadius: 20, letterSpacing: 0.5 }}>
        Stay: {c?.dur}
      </div>

      {/* Scroll hint */}
      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.4 }}>
        <div style={{ fontSize: 18, color: '#c9962a', lineHeight: 1 }}>↕</div>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#8a7a65' }}>Scroll to navigate</div>
      </div>
    </div>
  );
}
```

- [ ] **Update `DetailColumn` usage** — replace `<DetailColumn city={activeCity} />` with:

```jsx
<DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} />
```

- [ ] **Verify in browser**: right column shows city name, "City N of M" counter, and duration badge. Scrolling fades the content out briefly then fades in the next city's data.

- [ ] **Commit**
```bash
git add src/TripDetails.jsx
git commit -m "feat: detail column with city name, counter, duration and fade transition"
```

---

## Task 5 — Footer tape

**Files:**
- Modify: `src/TripDetails.jsx`

- [ ] **Replace the `FooterTape` placeholder** with the full tape component. The tape renders all cities in a flex row; a `useEffect` measures the active city's DOM position and translates the row to keep it centred:

```jsx
function FooterTape({ cities, currentIndex }) {
  const tapeRef = useRef(null);
  const cityRefs = useRef([]);

  useEffect(() => {
    const tape = tapeRef.current;
    const activeEl = cityRefs.current[currentIndex];
    if (!tape || !activeEl) return;

    const container = tape.parentElement;
    const containerWidth = container.offsetWidth;
    const offset = activeEl.offsetLeft - containerWidth / 2 + activeEl.offsetWidth / 2;
    tape.style.transform = `translateX(${-offset}px)`;
  }, [currentIndex]);

  return (
    <div style={{
      height: 42, background: '#1a1208', flexShrink: 0,
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Left fade */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      {/* Right fade */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Tape row */}
      <div
        ref={tapeRef}
        style={{
          display: 'flex', alignItems: 'center', height: '100%',
          transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
          willChange: 'transform',
        }}
      >
        {cities.map((city, i) => {
          const dist = Math.abs(i - currentIndex);
          const isActive = dist === 0;

          // Opacity and size scale with distance from active
          const opacity = isActive ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.3 : 0.12;
          const fontSize = isActive ? 12 : dist === 1 ? 10 : 9;

          return (
            <span
              key={i}
              ref={el => cityRefs.current[i] = el}
              style={{
                padding: isActive ? '4px 14px' : '3px 10px',
                background: isActive ? 'rgba(201,150,42,0.18)' : 'transparent',
                borderRadius: 4,
                fontSize,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f5f0e8' : '#f5f0e8',
                opacity,
                letterSpacing: isActive ? 0.3 : 0.2,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'opacity 0.35s ease, font-size 0.35s ease, padding 0.35s ease, background 0.35s ease',
              }}
            >
              {city.city}
            </span>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Update `FooterTape` usage** — replace `<FooterTape />` with:

```jsx
<FooterTape cities={cities} currentIndex={currentIndex} />
```

- [ ] **Verify in browser**: footer shows a window of city names, active city is centred, brighter and slightly larger. Neighbours fade toward the edges. Scrolling glides the tape so the new active city is always centred. Edge gradients hide the extremes cleanly.

- [ ] **Commit**
```bash
git add src/TripDetails.jsx
git commit -m "feat: footer city tape with centred active city and fade edges"
```

---

## Task 6 — Final review pass

**Files:**
- Modify: `src/TripDetails.jsx` (if any issues found)

- [ ] **Check the first and last cities**: navigate to city 1 (index 0) and the final city. Confirm the tape doesn't over-translate past the edges in a jarring way, and `currentIndex` is clamped (can't go below 0 or above `cities.length - 1`).

- [ ] **Check a long-named trip** (SuperTrip 7 has 35 stops): open it, scroll through several cities, confirm map pans correctly and footer tape glides smoothly.

- [ ] **Check the back button**: pressing it returns to the trip list. Confirm the `position: fixed` overlay doesn't leave any ghost artefacts on the list page.

- [ ] **Stop the dev server**.

- [ ] **Commit** any fixes found, then do a final clean commit:
```bash
git add src/TripDetails.jsx
git commit -m "feat: TripDetails viewport redesign complete"
```
