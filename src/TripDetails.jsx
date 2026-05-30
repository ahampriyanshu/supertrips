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
function FooterTape() {
  return <div style={{ height: 38, background: '#1a1208' }} />;
}

export default function TripDetails({ trip, index, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cities = trip.cities;
  const totalDays = Math.round(cities.reduce((s, c) => s + parseDays(c.dur), 0));
  const activeCity = cities[currentIndex];

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
        <MapColumn
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
        />
        <DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} />
      </div>

      {/* ── FOOTER TAPE ── */}
      <FooterTape />
    </div>
  );
}
