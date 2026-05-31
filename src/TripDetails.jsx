import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { ACCOMMODATIONS, CITIES as CITIES_DATA, CATEGORIES } from './data.js';
import './TripDetails.css';

function navigateTo(href) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new Event('popstate'));
}

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const CITY_ENRICHMENT = Object.values(CITIES_DATA).reduce((acc, entry) => {
  if (!acc[entry.city]) acc[entry.city] = entry;
  return acc;
}, {});

function fmt(s) {
  if (!s) return '';
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatAccommodation(value) {
  return ACCOMMODATIONS[value]?.label || fmt(value);
}

function getAccommodationSlug(value) {
  return ACCOMMODATIONS[value]?.slug || String(value).replace(/_/g, '-');
}

function InfoBadge({ label, value }) {
  return (
    <div className="td-badge">
      <div className="td-badge-label">{label}</div>
      <div className="td-badge-value">{value}</div>
    </div>
  );
}

function BoundsInit({ positions }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || positions.length === 0) return;
    if (positions.length === 1) { map.setView(positions[0], 11); done.current = true; return; }
    map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    done.current = true;
  }, [positions, map]);
  return null;
}

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

const routeLineOptions = { color: '#c9962a', weight: 3, opacity: 0.7, dashArray: '6, 14' };

function LeafletMap({ positions, activePosition }) {
  return (
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
      {positions.length > 1 && <Polyline positions={positions} pathOptions={routeLineOptions} />}
      {activePosition && <Marker position={activePosition} />}
    </MapContainer>
  );
}

function MapColumn({ positions, activePosition }) {
  return (
    <div className="td-map-column">
      <div className="td-map-frame">
        <LeafletMap positions={positions} activePosition={activePosition} />
      </div>
    </div>
  );
}

function MapModal({ positions, activePosition, cityName, onClose }) {
  return (
    <div className="td-map-modal">
      <div className="td-map-modal-header">
        <span className="td-map-modal-city">{cityName}</span>
        <button className="td-map-modal-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="#1a1208" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="td-map-modal-body">
        <LeafletMap positions={positions} activePosition={activePosition} />
      </div>
      <div className="td-map-modal-footer">
        ↑ ↓ scroll to navigate between cities
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

function formatUnit(value, unit) { return `${value} ${unit}${value === 1 ? '' : 's'}`; }

function formatDuration(days) {
  if (days >= 30) return formatUnit(Math.round(days / 30), 'month');
  if (days >= 7) return formatUnit(Math.round(days / 7), 'week');
  return formatUnit(Math.round(days), 'day');
}

function DetailColumn({ city, cityIndex, total, onOpenMap }) {
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState({ city, cityIndex });

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 0);
    const show = setTimeout(() => { setDisplayed({ city, cityIndex }); setVisible(true); }, 150);
    return () => { clearTimeout(hide); clearTimeout(show); };
  }, [city, cityIndex]);

  const { city: c, cityIndex: ci } = displayed;
  const data = c ? CITY_ENRICHMENT[c.city] : null;
  const notes = Array.isArray(data?.notes)
    ? data.notes.map(note => String(note).trim()).filter(Boolean)
    : [];

  return (
    <div data-detail-scroll="" className="td-detail-scroll" style={{ opacity: visible ? 1 : 0 }}>
      <div className="td-detail-inner">

        {/* Map widget — mobile only */}
        {onOpenMap && (
          <button className="td-map-widget td-mobile-only" onClick={onOpenMap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            View on map
          </button>
        )}

        {/* City name + categories */}
        <div>
          <div className="td-city-title-row">
            <div className="td-city-title">{c?.city}</div>
            {data && data.category.length > 0 && data.category.map((cat, i) => (
              <span key={cat} className="td-category-link">
                <a
                  href={`/categories#category-${CATEGORIES[cat]?.slug || cat}`}
                  onClick={e => { e.preventDefault(); navigateTo(`/categories#category-${CATEGORIES[cat]?.slug || cat}`); }}
                  className="td-category-link"
                >
                  {CATEGORIES[cat]?.label || fmt(cat)}
                </a>
                {i < data.category.length - 1 && ','}
              </span>
            ))}
          </div>
          {data && (
            <div className="td-city-meta">
              <a href={`/cities#state-${data.state}`} onClick={e => { e.preventDefault(); navigateTo(`/cities#state-${data.state}`); }}>
                {fmt(data.state)}
              </a>
              {' '}&middot;{' '}
              <a href={`/cities#region-${data.region}`} onClick={e => { e.preventDefault(); navigateTo(`/cities#region-${data.region}`); }}>
                {fmt(data.region)}
              </a>
            </div>
          )}
        </div>

        {/* Stay badges */}
        <div className="td-badge-row">
          {c?.dur && <InfoBadge label="My stay" value={c.dur} />}
          {data?.ideal_stay && <InfoBadge label="Ideal stay" value={data.ideal_stay} />}
          {data?.ideal_season && <InfoBadge label="Ideal time" value={fmt(data.ideal_season)} />}
        </div>

        {/* Accommodation */}
        {data?.accommodation?.length > 0 && (
          <div>
            <div className="td-section-label">Accommodation</div>
            <div className="td-chip-row">
              {data.accommodation.map(item => (
                <a key={item} href={`/stay#${getAccommodationSlug(item)}`}
                  onClick={e => { e.preventDefault(); navigateTo(`/stay#${getAccommodationSlug(item)}`); }}
                  className="td-chip" style={{ textDecoration: 'none' }}>
                  {formatAccommodation(item)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Getting Around */}
        {data?.mode_of_travel?.length > 0 && (
          <div>
            <div className="td-section-label">Getting Around</div>
            <div className="td-chip-row">
              {data.mode_of_travel.map(m => (
                <span key={m} className="td-chip">{fmt(m)}</span>
              ))}
            </div>
          </div>
        )}

        {/* Must Visit */}
        {data?.must_visit?.length > 0 && (
          <div>
            <div className="td-section-label">Must Visit</div>
            <div className="td-chip-row">
              {data.must_visit.slice(0, 6).map((item, i) => (
                <span key={i} className="td-chip">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Must Try */}
        {data?.must_try?.length > 0 && (
          <div>
            <div className="td-section-label">Must Try</div>
            <div className="td-chip-row">
              {data.must_try.slice(0, 6).map((item, i) => (
                <span key={i} className="td-chip">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* My Notes */}
        {notes.length > 0 && (
          <div>
            <div className="td-section-label">My Notes</div>
            <ul className="td-notes-list">
              {notes.map((note, i) => (
                <li key={i} className="td-note">{note}</li>
              ))}
            </ul>
          </div>
        )}

        {!data && <div className="td-fallback">City {ci + 1} of {total}</div>}
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
    <div className="td-footer-tape">
      <div className="td-footer-controls">
        <button onClick={onPrev} className="td-icon-btn-padded" style={{ opacity: currentIndex === 0 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-footer-counter">
          <span className="td-footer-counter-current">{currentIndex + 1}</span>
          <span className="td-footer-counter-slash">/</span>
          <span className="td-footer-counter-total">{cities.length}</span>
        </div>
        <button onClick={onNext} className="td-icon-btn-padded" style={{ opacity: currentIndex === cities.length - 1 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="td-divider" />

      <div className="td-tape-window">
        <div className="td-tape-fade-left" />
        <div className="td-tape-fade-right" />
        <div ref={tapeRef} className="td-tape-track">
          {cities.map((city, i) => {
            const dist = Math.abs(i - currentIndex);
            const isActive = dist === 0;
            return (
              <span
                key={i}
                ref={el => cityRefs.current[i] = el}
                className="td-tape-city"
                style={{
                  fontSize: isActive ? 22 : dist === 1 ? 14 : dist === 2 ? 11 : 9,
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: isActive ? "Georgia, 'Times New Roman', serif" : 'inherit',
                  fontStyle: isActive ? 'italic' : 'normal',
                  color: isActive ? '#c9962a' : '#f5f0e8',
                  opacity: isActive ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.28 : 0.1,
                  letterSpacing: isActive ? 0.2 : 0.1,
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

export function CityDetails({ city, onBack }) {
  const position = city?.lat && city?.lng ? [city.lat, city.lng] : null;
  return (
    <div className="td-root">
      <div className="td-topbar">
        <div className="td-pattern" />
        <button onClick={onBack} className="td-icon-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-divider" />
        <div className="td-title-block">
          <div className="td-trip-title">{city.city}</div>
          <div className="td-trip-meta">{fmt(city.state)} · {fmt(city.region)}</div>
        </div>
      </div>
      <div className="td-main">
        <MapColumn positions={position ? [position] : []} activePosition={position} />
        <DetailColumn city={city} cityIndex={0} total={1} />
      </div>
    </div>
  );
}

export default function TripDetails({ trip, index, initialCityIndex = 0, onBack, onPrevTrip, onNextTrip }) {
  const [currentIndex, setCurrentIndex] = useState(initialCityIndex);
  const [mapOpen, setMapOpen] = useState(false);

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
    if (next < 0) { prevTripRef.current(true); return; }
    if (next >= cities.length) { nextTripRef.current(); return; }
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, [cities.length]);

  useEffect(() => {
    let acc = 0;
    let idleTimer = null;
    const THRESHOLD = 400;

    const onWheel = (e) => {
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
      if (dt < 500 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
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
    <div className="td-root">
      {/* ── HEADER ── */}
      <div className="td-topbar">
        <div className="td-pattern" />

        {/* Desktop: back button */}
        <button onClick={onBack} className="td-icon-btn td-desktop-only">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="#c9962a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-divider td-desktop-only" />

        {/* Desktop title */}
        <div className="td-title-block td-desktop-only">
          <div className="td-trip-title">{trip.name}</div>
          <div className="td-trip-meta">{totalDuration} · {cities.length} stops · {trip.distanceKm.toLocaleString()} km</div>
        </div>

        {/* Mobile title (city name) */}
        <div className="td-title-block td-mobile-only">
          <div className="td-trip-title">{activeCity?.city}</div>
          <div className="td-trip-meta">{trip.name} · stop {currentIndex + 1}/{cities.length}</div>
        </div>

        {/* Desktop: trip switcher */}
        <div className="td-trip-switcher td-desktop-only">
          <button onClick={onPrevTrip} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="td-trip-number">Super<em>Trip </em>{index + 1}</div>
          <button onClick={onNextTrip} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile: city prev/next */}
        <div className="td-trip-switcher td-mobile-only">
          <button onClick={() => advance(-1)} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => advance(1)} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#c9962a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div className="td-main">
        <MapColumn
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
        />
        <DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} onOpenMap={() => setMapOpen(true)} />
      </div>

      {/* ── FOOTER TAPE ── */}
      <FooterTape cities={cities} currentIndex={currentIndex} onPrev={() => advance(-1)} onNext={() => advance(1)} />

      {/* ── MAP MODAL (mobile) ── */}
      {mapOpen && (
        <MapModal
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
          cityName={activeCity?.city}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
}
