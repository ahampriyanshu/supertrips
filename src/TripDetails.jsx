import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;


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
    <div style={{ width: '40%', flexShrink: 0, position: 'relative', padding: '1.25rem', background: '#f5f0e8' }}>
      <div style={{ height: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #e0d8cc', boxShadow: '0 2px 16px rgba(26,18,8,0.06)' }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%', background: '#eae8e0' }}
      >
        {import.meta.env.VITE_MAPPLS_KEY ? (
          // MapmyIndia tiles — Survey of India boundaries (correct for India)
          <TileLayer
            attribution='&copy; <a href="https://www.mappls.com/">MapmyIndia</a>'
            url={`https://apis.mappls.com/advancedmaps/v1/${import.meta.env.VITE_MAPPLS_KEY}/still_map/{z}/{x}/{y}.png`}
          />
        ) : (
          // Fallback — uses international boundaries (PoK shown as Pakistan)
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
        )}
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
    </div>
  );
}
function DetailColumn({ city, cityIndex, total }) {
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState({ city, cityIndex });

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 0);
    const show = setTimeout(() => {
      setDisplayed({ city, cityIndex });
      setVisible(true);
    }, 150);
    return () => { clearTimeout(hide); clearTimeout(show); };
  }, [city, cityIndex]);

  const { city: c, cityIndex: ci } = displayed;

  return (
    <div style={{
      flex: 1, background: '#f5f0e8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', gap: '0.75rem',
      transition: 'opacity 0.15s ease',
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#8a7a65' }}>
        City {ci + 1} of {total}
      </div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1a1208', textAlign: 'center', lineHeight: 1.1 }}>
        {c?.city}
      </div>
      <div style={{ fontSize: 12, color: '#6a6055', background: 'rgba(201,150,42,0.12)', padding: '5px 16px', borderRadius: 20, letterSpacing: 0.5 }}>
        Stay: {c?.dur}
      </div>
      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.4 }}>
        <div style={{ fontSize: 18, color: '#c9962a', lineHeight: 1 }}>↕</div>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#8a7a65' }}>Scroll to navigate</div>
      </div>
    </div>
  );
}
function FooterTape({ cities, currentIndex, onPrev, onNext }) {
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
      height: 46, background: '#1a1208', flexShrink: 0,
      display: 'flex', alignItems: 'center',
    }}>
      {/* City navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', flexShrink: 0 }}>
        <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: currentIndex === 0 ? 0.2 : 1 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7L9 3" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', lineHeight: 1, minWidth: 36, textAlign: 'center' }}>
          <span style={{ fontSize: '0.95rem', color: '#c9962a' }}>{currentIndex + 1}</span>
          <span style={{ fontSize: '0.7rem', color: '#3a3020', margin: '0 2px' }}>/</span>
          <span style={{ fontSize: '0.75rem', color: '#6a6055' }}>{cities.length}</span>
        </div>
        <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: currentIndex === cities.length - 1 ? 0.2 : 1 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: '#3a3020', flexShrink: 0 }} />

      {/* City tape */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
        {/* Left fade */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        {/* Right fade */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />

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
            const opacity = isActive ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.3 : 0.12;
            const fontSize = isActive ? 12 : dist === 1 ? 10 : 9;

            return (
              <span
                key={i}
                ref={el => cityRefs.current[i] = el}
                style={{
                  padding: '3px 10px',
                  fontSize,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#c9962a' : '#f5f0e8',
                  opacity,
                  letterSpacing: isActive ? 0.3 : 0.2,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'opacity 0.35s ease, font-size 0.35s ease, color 0.35s ease',
                }}
              >
                {city.city}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TripDetails({ trip, index, onBack, onPrevTrip, onNextTrip }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cities = trip.cities;
  const activeCity = cities[currentIndex];
  const totalDays = Math.round(cities.reduce((s, c) => {
    const d = c.dur.toLowerCase();
    if (d.includes('month')) return s + parseFloat(d) * 30;
    if (d.includes('week'))  return s + parseFloat(d) * 7;
    if (d.includes('½') || d.includes('0.5')) return s + 0.5;
    return s + (parseFloat(d) || 1);
  }, 0));

  const advance = useCallback((dir) => {
    setCurrentIndex(i => Math.max(0, Math.min(cities.length - 1, i + dir)));
  }, [cities.length]);

  // Keep trip-nav callbacks in refs so the wheel effect never needs to re-register
  const prevTripRef = useRef(onPrevTrip);
  const nextTripRef = useRef(onNextTrip);
  useEffect(() => { prevTripRef.current = onPrevTrip; }, [onPrevTrip]);
  useEffect(() => { nextTripRef.current = onNextTrip; }, [onNextTrip]);

  useEffect(() => {
    // ── Vertical wheel → city navigation ──────────────────────────────────
    // Accumulate delta, fire once per THRESHOLD pixels, then subtract (not
    // reset) so rapid deliberate scrolls chain naturally while a single
    // momentum flick is proportional but not unlimited.
    let acc = 0;
    let idleTimer = null;
    const THRESHOLD = 400; // ~one mouse-wheel notch

    const onWheel = (e) => {
      e.preventDefault();
      acc += e.deltaY;

      // Clear acc when scrolling truly stops (no new events for 200ms)
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { acc = 0; }, 200);

      while (Math.abs(acc) >= THRESHOLD) {
        advance(acc > 0 ? 1 : -1);
        acc -= acc > 0 ? THRESHOLD : -THRESHOLD;
      }
    };

    // ── Horizontal pointer swipe → trip navigation ─────────────────────────
    // Uses pointer events instead of deltaX because browsers intercept
    // horizontal trackpad gestures for history navigation before wheel fires.
    let swipeStart = null;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    };

    const onPointerUp = (e) => {
      if (!swipeStart) return;
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      const dt = Date.now() - swipeStart.t;
      swipeStart = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Clear horizontal swipe: fast, wide, and X dominates Y by 2:1
      if (dt < 500 && absX > 60 && absX > absY * 2) {
        dx > 0 ? prevTripRef.current() : nextTripRef.current();
      }
    };

    const onPointerCancel = () => { swipeStart = null; };

    // ── Keyboard ───────────────────────────────────────────────────────────
    const onKey = (e) => {
      if (e.key === 'ArrowDown')  advance(1);
      if (e.key === 'ArrowUp')    advance(-1);
      if (e.key === 'ArrowRight') nextTripRef.current();
      if (e.key === 'ArrowLeft')  prevTripRef.current();
    };

    document.addEventListener('wheel',        onWheel,       { passive: false });
    document.addEventListener('pointerdown',  onPointerDown);
    document.addEventListener('pointerup',    onPointerUp);
    document.addEventListener('pointercancel',onPointerCancel);
    document.addEventListener('keydown',      onKey);

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('wheel',        onWheel);
      document.removeEventListener('pointerdown',  onPointerDown);
      document.removeEventListener('pointerup',    onPointerUp);
      document.removeEventListener('pointercancel',onPointerCancel);
      document.removeEventListener('keydown',      onKey);
    };
  }, [advance]);

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

        {/* Back — SVG arrow only */}
        <button onClick={onBack} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 32, background: '#3a3020', flexShrink: 0, position: 'relative' }} />

        {/* Trip name + meta */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
            {trip.name}
          </div>
          <div style={{ fontSize: 11, color: '#a09888', marginTop: 4 }}>
            {totalDays}+ days · {cities.length} stops · {trip.distanceKm.toLocaleString()} km
          </div>
        </div>

        {/* Navigation panel: prev / SuperTrip N / next */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button onClick={onPrevTrip} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', fontWeight: 700, color: '#f5f0e8' }}>
            Super<em style={{ fontStyle: 'italic', color: '#c9962a' }}>Trip </em>{index + 1}
          </div>
          <button onClick={onNextTrip} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <MapColumn
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
        />
        <DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} />
      </div>

      {/* ── FOOTER TAPE ── */}
      <FooterTape cities={cities} currentIndex={currentIndex} onPrev={() => advance(-1)} onNext={() => advance(1)} />
    </div>
  );
}
