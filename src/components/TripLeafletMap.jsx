import { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES, CITIES as CITIES_DATA, REGIONS, STATES } from '../data.js';
import { navigateTo } from '../nav.js';
import MapTileLayer from './MapTileLayer.jsx';

const CITY_ENRICHMENT = Object.values(CITIES_DATA).reduce((acc, entry) => {
  if (!acc[entry.city]) acc[entry.city] = entry;
  return acc;
}, {});

const CITY_CODE_BY_NAME = Object.entries(CITIES_DATA).reduce((acc, [code, entry]) => {
  if (!acc[entry.city]) acc[entry.city] = code;
  return acc;
}, {});

function fmt(s) {
  if (!s) return '';
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getCityData(city) {
  return CITIES_DATA[city?.code] || CITY_ENRICHMENT[city?.city] || city;
}

function getCityCode(city) {
  return city?.code || CITY_CODE_BY_NAME[city?.city];
}

function getStateLabel(value) {
  return STATES[value]?.label || fmt(value);
}

function getStateSlug(value) {
  return STATES[value]?.slug || String(value || '').replace(/_/g, '-');
}

function getRegionLabel(value) {
  return REGIONS[value]?.label || fmt(value);
}

function getRegionSlug(value) {
  return REGIONS[value]?.slug || String(value || '').replace(/_/g, '-');
}

function useDesktopView() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}

function BoundsInit({ positions }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 11);
      done.current = true;
      return;
    }
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

function MapPopupLink({ href, className, children }) {
  return (
    <a
      href={href}
      className={className}
      onClick={e => {
        e.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

function StopPopup({ city }) {
  const data = getCityData(city);
  const cityCode = getCityCode(city);
  const categories = Array.isArray(data?.category) ? data.category.filter(Boolean) : [];

  return (
    <div className="td-map-popup-inner">
      {cityCode ? (
        <MapPopupLink href={`/cities/${cityCode}`} className="td-map-popup-title">
          {city.city}
        </MapPopupLink>
      ) : (
        <div className="td-map-popup-title">{city.city}</div>
      )}

      {data && (
        <div className="td-map-popup-meta">
          <MapPopupLink href={`/cities#state-${getStateSlug(data.state)}`}>
            {getStateLabel(data.state)}
          </MapPopupLink>
          <span> · </span>
          <MapPopupLink href={`/cities#region-${getRegionSlug(data.region)}`}>
            {getRegionLabel(data.region)}
          </MapPopupLink>
        </div>
      )}

      {categories.length > 0 && (
        <div className="td-map-popup-group">
          <div className="td-map-popup-label">Categories</div>
          <div className="td-map-popup-chips">
            {categories.map(category => (
              <MapPopupLink
                key={category}
                href={`/categories#category-${CATEGORIES[category]?.slug || category}`}
                className="td-map-popup-chip"
              >
                {CATEGORIES[category]?.label || fmt(category)}
              </MapPopupLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const routeLineOptions = { color: '#c9962a', weight: 3, opacity: 0.7, dashArray: '6, 14' };
const stopMarkerOptions = {
  color: '#1a1208',
  fillColor: '#c9962a',
  fillOpacity: 0.76,
  opacity: 0.88,
  weight: 1.2,
};
const activeStopMarkerOptions = {
  color: '#1a1208',
  fillColor: '#f5f0e8',
  fillOpacity: 1,
  opacity: 1,
  weight: 2,
};

function StopMarker({ city, index, activePosition, openActivePopup }) {
  const markerRef = useRef(null);
  const isActive = activePosition?.[0] === city.lat && activePosition?.[1] === city.lng;

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;

    if (isActive && openActivePopup) {
      const timer = setTimeout(() => marker.openPopup(), 550);
      return () => clearTimeout(timer);
    }

    if (!isActive) {
      marker.closePopup();
    }

    return undefined;
  }, [city.code, city.city, isActive, openActivePopup]);

  return (
    <CircleMarker
      ref={markerRef}
      key={`${city.code || city.city}-${index}`}
      center={[city.lat, city.lng]}
      radius={isActive ? 7 : 5}
      pathOptions={isActive ? activeStopMarkerOptions : stopMarkerOptions}
    >
      <Popup
        className="td-map-popup"
        closeButton={false}
        autoPan
        keepInView
        autoPanPaddingTopLeft={[32, 72]}
        autoPanPaddingBottomRight={[32, 32]}
      >
        <StopPopup city={city} />
      </Popup>
    </CircleMarker>
  );
}

export default function TripLeafletMap({ cities = [], positions, activePosition }) {
  const openActivePopup = useDesktopView();

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%', background: '#eae8e0' }}
    >
      <MapTileLayer />
      <BoundsInit positions={positions} />
      {activePosition && <CityFocuser position={activePosition} />}
      {positions.length > 1 && <Polyline positions={positions} pathOptions={routeLineOptions} />}
      {cities.map((city, index) => {
        if (!city?.lat || !city?.lng) return null;

        return (
          <StopMarker
            key={`${city.code || city.city}-${index}`}
            city={city}
            index={index}
            activePosition={activePosition}
            openActivePopup={openActivePopup}
          />
        );
      })}
    </MapContainer>
  );
}
