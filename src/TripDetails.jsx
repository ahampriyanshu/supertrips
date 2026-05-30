import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { CITIES as CITIES_DATA } from './data.js';

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// city display name → enrichment data (first match wins for duplicates)
const CITY_ENRICHMENT = Object.values(CITIES_DATA).reduce((acc, entry) => {
  if (!acc[entry.city]) acc[entry.city] = entry;
  return acc;
}, {});

function fmt(s) {
  if (!s) return '';
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function Stars({ n }) {
  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? '#c9962a' : '#3a3020', fontSize: 13, lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div style={{ background: '#faf7f2', border: '1px solid #e0d8cc', borderRadius: 4, padding: '5px 12px' }}>
      <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a7a65' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1208', marginTop: 1 }}>{value}</div>
    </div>
  );
}

function WikipediaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 9l1.5 6L11.5 11l2 4L15 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatGPTIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-4.55-2.02 6.06 6.06 0 0 0-5.82 4.2 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .52 4.9 6.05 6.05 0 0 0 6.51 2.9 6.07 6.07 0 0 0 4.55 2.02 6.06 6.06 0 0 0 5.77-4.2 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.7-7.09zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68V11.2l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.42zm-9.66-4.12a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.9a4.5 4.5 0 0 1-6.14-1.6zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.97v5.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0L4.04 14.1A4.5 4.5 0 0 1 2.34 7.9zm16.6 3.86-5.82-3.35 2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.41-.69zm2.01-3.03-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.68zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.4.68v.01zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3z"/>
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.8 3.5h3.6L10 20.5H6.4zm-3.6 0h3.6L6.4 20.5H2.8zM17.4 3.5H21l-7.4 17H10z" opacity=".9"/>
    </svg>
  );
}

function ExternalLinks({ cityName }) {
  const q = encodeURIComponent(`Tell me about ${cityName}, India`);
  const links = [
    { href: `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`, label: 'Wikipedia', Icon: WikipediaIcon },
    { href: `https://chatgpt.com/?q=${q}`, label: 'ChatGPT', Icon: ChatGPTIcon },
    { href: `https://claude.ai/new?q=${q}`, label: 'Claude', Icon: ClaudeIcon },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: '0.85rem' }}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 4,
            border: '1px solid #d8d0c4', background: '#faf7f2',
            color: '#6a5a48', textDecoration: 'none',
            fontSize: 11, letterSpacing: 0.2,
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9962a'; e.currentTarget.style.color = '#c9962a'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d8d0c4'; e.currentTarget.style.color = '#6a5a48'; }}
        >
          <Icon />
          {label}
        </a>
      ))}
    </div>
  );
}

function BulletList({ title, items }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a7a65', marginBottom: 7 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.slice(0, 6).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, fontSize: 12.5, color: '#2e2416', lineHeight: 1.4 }}>
            <span style={{ color: '#c9962a', flexShrink: 0, marginTop: 2, fontSize: 9 }}>▸</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <TileLayer
            attribution='&copy; <a href="https://www.mappls.com/">MapmyIndia</a>'
            url={`https://apis.mappls.com/advancedmaps/v1/${import.meta.env.VITE_MAPPLS_KEY}/still_map/{z}/{x}/{y}.png`}
          />
        ) : (
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

function parseDurationDays(duration) {
  const d = duration.toLowerCase();
  if (d.includes('month')) return parseFloat(d) * 30;
  if (d.includes('week')) return parseFloat(d) * 7;
  if (d.includes('½') || d.includes('0.5')) return 0.5;
  return parseFloat(d) || 1;
}

function formatUnit(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

function formatDuration(days) {
  if (days >= 30) return formatUnit(Math.round(days / 30), 'month');
  if (days >= 7) return formatUnit(Math.round(days / 7), 'week');
  return formatUnit(Math.round(days), 'day');
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
  const data = c ? CITY_ENRICHMENT[c.city] : null;

  return (
    <div
      data-detail-scroll=""
      style={{
        flex: 1, overflowY: 'auto', background: '#f5f0e8',
        transition: 'opacity 0.15s ease', opacity: visible ? 1 : 0,
      }}
    >
      <div style={{ padding: '1.75rem 2rem 2.5rem' }}>

        {/* City name + rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.1, color: '#1a1208' }}>
            {c?.city}
          </div>
          {data && <Stars n={data.rating} />}
        </div>

        {/* State · region */}
        {data && (
          <div style={{ fontSize: 11, color: '#8a7a65', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.9rem' }}>
            {fmt(data.state)} &middot; {fmt(data.region)}
          </div>
        )}

        {/* External links */}
        {c && <ExternalLinks cityName={c.city} />}

        {/* Category chips */}
        {data && data.category.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1rem' }}>
            {data.category.map(cat => (
              <span key={cat} style={{
                fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 20,
                background: 'rgba(201,150,42,0.1)', color: '#7a6a55',
                border: '1px solid rgba(201,150,42,0.22)',
              }}>
                {fmt(cat)}
              </span>
            ))}
          </div>
        )}

        {/* Stay badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {c?.dur && <InfoBadge label="stayed" value={c.dur} />}
          {data?.ideal_stay && <InfoBadge label="ideal stay" value={data.ideal_stay} />}
          {data?.ideal_season && <InfoBadge label="best time" value={fmt(data.ideal_season)} />}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#e0d8cc', marginBottom: '1.25rem' }} />

        {/* Must Visit + Must Try */}
        {data && (data.must_visit?.length > 0 || data.must_try?.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            {data.must_visit?.length > 0 && <BulletList title="Must Visit" items={data.must_visit} />}
            {data.must_try?.length > 0 && <BulletList title="Must Try" items={data.must_try} />}
          </div>
        )}

        {/* Getting Around */}
        {data?.mode_of_travel?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a7a65', marginBottom: 7 }}>
              Getting Around
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {data.mode_of_travel.map(m => (
                <span key={m} style={{
                  fontSize: 11, padding: '4px 11px', borderRadius: 4,
                  background: '#1a1208', color: '#a09888', letterSpacing: 0.2,
                }}>
                  {fmt(m)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {data?.notes?.length > 0 && (
          <>
            <div style={{ height: 1, background: '#e0d8cc', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {data.notes.map((note, i) => (
                <p key={i} style={{
                  fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  fontSize: 13, color: '#6a5a48', lineHeight: 1.8, margin: 0,
                }}>
                  &ldquo;{note}&rdquo;
                </p>
              ))}
            </div>
          </>
        )}

        {/* Fallback when no enrichment data */}
        {!data && (
          <div style={{ color: '#8a7a65', fontSize: 13 }}>
            City {ci + 1} of {total}
          </div>
        )}

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
      height: 72, background: '#1a1208', flexShrink: 0,
      display: 'flex', alignItems: 'center',
    }}>
      {/* City navigation — left panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1.25rem', flexShrink: 0 }}>
        <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', opacity: currentIndex === 0 ? 0.2 : 1, transition: 'opacity 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontFamily: 'Georgia, serif', lineHeight: 1, minWidth: 42, textAlign: 'center' }}>
          <span style={{ fontSize: '1.2rem', color: '#c9962a' }}>{currentIndex + 1}</span>
          <span style={{ fontSize: '0.8rem', color: '#3a3020', margin: '0 3px' }}>/</span>
          <span style={{ fontSize: '0.85rem', color: '#6a6055' }}>{cities.length}</span>
        </div>
        <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', opacity: currentIndex === cities.length - 1 ? 0.2 : 1, transition: 'opacity 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: '#3a3020', flexShrink: 0 }} />

      {/* City tape */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 72, background: 'linear-gradient(to right, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 72, background: 'linear-gradient(to left, #1a1208 40%, transparent)', zIndex: 2, pointerEvents: 'none' }} />

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
            const opacity = isActive ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.28 : 0.1;
            const fontSize = isActive ? 22 : dist === 1 ? 14 : dist === 2 ? 11 : 9;

            return (
              <span
                key={i}
                ref={el => cityRefs.current[i] = el}
                style={{
                  padding: '4px 14px',
                  fontSize,
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: isActive ? "Georgia, 'Times New Roman', serif" : 'inherit',
                  fontStyle: isActive ? 'italic' : 'normal',
                  color: isActive ? '#c9962a' : '#f5f0e8',
                  opacity,
                  letterSpacing: isActive ? 0.2 : 0.1,
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

export default function TripDetails({ trip, index, initialCityIndex = 0, onBack, onPrevTrip, onNextTrip }) {
  const [currentIndex, setCurrentIndex] = useState(initialCityIndex);

  const cities = trip.cities;
  const activeCity = cities[currentIndex];
  const totalDuration = formatDuration(cities.reduce((s, c) => s + parseDurationDays(c.dur), 0));

  const currentIndexRef = useRef(initialCityIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const prevTripRef = useRef(onPrevTrip);
  const nextTripRef = useRef(onNextTrip);
  useEffect(() => { prevTripRef.current = onPrevTrip; }, [onPrevTrip]);
  useEffect(() => { nextTripRef.current = onNextTrip; }, [onNextTrip]);

  const advance = useCallback((dir) => {
    const next = currentIndexRef.current + dir;
    if (next < 0) {
      prevTripRef.current(true);
      return;
    }
    if (next >= cities.length) {
      nextTripRef.current();
      return;
    }
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, [cities.length]);

  useEffect(() => {
    let acc = 0;
    let idleTimer = null;
    const THRESHOLD = 400;

    const onWheel = (e) => {
      // Let the detail column scroll its own content naturally
      if (e.target.closest('[data-detail-scroll]')) return;
      e.preventDefault();
      acc += e.deltaY;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { acc = 0; }, 200);

      while (Math.abs(acc) >= THRESHOLD) {
        advance(acc > 0 ? 1 : -1);
        acc -= acc > 0 ? THRESHOLD : -THRESHOLD;
      }
    };

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

      if (dt < 500 && absX > 60 && absX > absY * 2) {
        dx > 0 ? prevTripRef.current() : nextTripRef.current();
      }
    };

    const onPointerCancel = () => { swipeStart = null; };

    const onKey = (e) => {
      if (e.key === 'ArrowDown')  advance(1);
      if (e.key === 'ArrowUp')    advance(-1);
      if (e.key === 'ArrowRight') nextTripRef.current();
      if (e.key === 'ArrowLeft')  prevTripRef.current();
    };

    document.addEventListener('wheel',         onWheel,       { passive: false });
    document.addEventListener('pointerdown',   onPointerDown);
    document.addEventListener('pointerup',     onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('keydown',       onKey);

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('wheel',         onWheel);
      document.removeEventListener('pointerdown',   onPointerDown);
      document.removeEventListener('pointerup',     onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('keydown',       onKey);
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
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,150,42,0.04) 40px, rgba(201,150,42,0.04) 41px)',
        }} />

        <button onClick={onBack} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div style={{ width: 1, height: 32, background: '#3a3020', flexShrink: 0, position: 'relative' }} />

        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
            {trip.name}
          </div>
          <div style={{ fontSize: 11, color: '#a09888', marginTop: 4 }}>
            {totalDuration} · {cities.length} stops · {trip.distanceKm.toLocaleString()} km
          </div>
        </div>

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
