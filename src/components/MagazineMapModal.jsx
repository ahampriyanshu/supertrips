import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import MapTileLayer from './MapTileLayer.jsx';
import { getMagazine } from '../magazineData.js';

function AtlasFitBounds({ entries }) {
  const map = useMap();

  useEffect(() => {
    const validPositions = (entries || [])
      .filter((e) => e.lat && e.lng)
      .map((e) => [e.lat, e.lng]);

    if (validPositions.length === 0) return;

    const bounds = L.latLngBounds(validPositions);

    const fit = () => {
      map.invalidateSize({ pan: false });
      map.fitBounds(bounds, {
        padding: [48, 48],
        maxZoom: 6,
        animate: false,
      });
    };

    const container = map.getContainer();
    const observer = new ResizeObserver(fit);
    observer.observe(container);

    fit();

    return () => observer.disconnect();
  }, [entries, map]);

  return null;
}

export default function MagazineMapModal({
  topic = 'forts',
  entries = [],
  entry,
  currentIndex = 0,
  totalEntries = 0,
  onPrev,
  onNext,
  onSelect,
  onClose,
}) {
  const currentFort = entry || entries[currentIndex] || {};
  const mag = getMagazine(topic);
  const topicTitle =
    topic === 'forts'
      ? 'Forts of India'
      : topic === 'palaces'
      ? 'Palaces of India'
      : topic === 'tombs' || topic === 'mausoleums'
      ? 'Tombs & Mausoleums of India'
      : mag?.title || 'Monographs of India';

  // Close on Escape, navigate on Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrev();
      } else if (e.key === 'ArrowRight' && currentIndex < totalEntries - 1) {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, currentIndex, totalEntries]);

  // Marker icons
  const inactiveIcon = useMemo(() => {
    return L.divIcon({
      className: 'magazine-atlas-marker magazine-atlas-marker--inactive',
      html: '<span class="magazine-atlas-dot"></span>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  }, []);

  const activeIcon = useMemo(() => {
    return L.divIcon({
      className: 'magazine-atlas-marker magazine-atlas-marker--active',
      html: `
        <span class="magazine-atlas-pulse"></span>
        <span class="magazine-atlas-dot-active"></span>
        <span class="magazine-atlas-badge">${currentFort.monument || ''}</span>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }, [currentFort.monument]);

  return (
    <div
      className="magazine-map-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${topicTitle} Map`}
    >
      <div className="magazine-map-dialog">
        {/* Minimal Clean Header */}
        <div className="magazine-map-header">
          <div className="magazine-map-header-left">
            <h2 className="magazine-map-title">{topicTitle}</h2>
            <span className="magazine-map-header-index">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalEntries).padStart(2, '0')}
            </span>
          </div>
          <button
            className="magazine-map-close-btn"
            onClick={onClose}
            aria-label="Close map dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Subcontinent Map Canvas */}
        <div className="magazine-map-body">
          <MapContainer
            center={[22.8, 79.2]}
            zoom={4.75}
            minZoom={4}
            maxZoom={12}
            zoomSnap={0.25}
            zoomDelta={0.5}
            scrollWheelZoom={true}
            className="magazine-map-leaflet-container"
          >
            <MapTileLayer />
            <AtlasFitBounds entries={entries} />

            {entries.map((item, idx) => {
              if (!item.lat || !item.lng) return null;
              const isCurrent = idx === currentIndex;

              return (
                <Marker
                  key={item.id || item.slug || idx}
                  position={[item.lat, item.lng]}
                  icon={isCurrent ? activeIcon : inactiveIcon}
                  zIndexOffset={isCurrent ? 1000 : 1}
                  eventHandlers={{
                    click: () => onSelect && onSelect(idx),
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, isCurrent ? -18 : -10]}
                    opacity={0.96}
                    className="magazine-map-tooltip"
                  >
                    <div className="magazine-map-tooltip-inner">
                      <span className="magazine-map-tooltip-num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="magazine-map-tooltip-text">
                        <strong>{item.monument}</strong>
                        <small>{item.location}</small>
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Minimal Clean Footer: Previous Arrow, Fort Name & Location on next line, Next Arrow */}
        <div className="magazine-map-footer">
          <button
            className="magazine-map-arrow-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous monument"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="magazine-map-footer-info">
            <div className="magazine-map-footer-title">{currentFort.monument}</div>
            <div className="magazine-map-footer-location">{currentFort.location}</div>
          </div>

          <button
            className="magazine-map-arrow-btn"
            onClick={onNext}
            disabled={currentIndex === totalEntries - 1}
            aria-label="Next monument"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
