import { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CITIES as CITIES_DATA } from '../data.js';
import CityMapPopup from './CityMapPopup.jsx';
import MapTileLayer from './MapTileLayer.jsx';

const CITY_CODE_BY_NAME = Object.entries(CITIES_DATA).reduce((acc, [code, entry]) => {
  if (!acc[entry.city]) acc[entry.city] = code;
  return acc;
}, {});

function getCityCode(city) {
  return city?.code || CITY_CODE_BY_NAME[city?.city];
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

function CityFocuser({ position, motionPaused }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (motionPaused) map.stop();
    if (!position) return;
    const key = position.join(',');
    if (prev.current === key) return;
    prev.current = key;
    map.panTo(position, { animate: !motionPaused, duration: 0.5 });
  }, [position, map, motionPaused]);
  return null;
}

const routeLineOptions = { color: '#a34630', weight: 3, opacity: 0.7, dashArray: '6, 14' };
const stopMarkerOptions = {
  color: '#283b31',
  fillColor: '#a34630',
  fillOpacity: 0.76,
  opacity: 0.88,
  weight: 1.2,
};
const activeStopMarkerOptions = {
  color: '#283b31',
  fillColor: '#f7f5ef',
  fillOpacity: 1,
  opacity: 1,
  weight: 2,
};

function StopMarker({ city, index, activePosition, openActivePopup, theme }) {
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
      pathOptions={theme ? {
        ...(isActive ? activeStopMarkerOptions : stopMarkerOptions),
        color: theme.ink,
        fillColor: isActive ? theme.paper : theme.accent,
      } : isActive ? activeStopMarkerOptions : stopMarkerOptions}
    >
      <Popup
        className="td-map-popup"
        closeButton={false}
        autoPan
        keepInView
        autoPanPaddingTopLeft={[32, 72]}
        autoPanPaddingBottomRight={[32, 32]}
      >
        <CityMapPopup city={city} cityCode={getCityCode(city)} />
      </Popup>
    </CircleMarker>
  );
}

export default function TripLeafletMap({ cities = [], positions, activePosition, theme, motionPaused = false }) {
  const openActivePopup = useDesktopView();

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%', background: theme?.paper || '#eae8e0' }}
    >
      <MapTileLayer />
      <BoundsInit positions={positions} />
      {activePosition && <CityFocuser position={activePosition} motionPaused={motionPaused} />}
      {positions.length > 1 && <Polyline positions={positions} pathOptions={theme ? { ...routeLineOptions, color: theme.accent } : routeLineOptions} />}
      {cities.map((city, index) => {
        if (!city?.lat || !city?.lng) return null;

        return (
          <StopMarker
            key={`${city.code || city.city}-${index}`}
            city={city}
            index={index}
            activePosition={activePosition}
            openActivePopup={openActivePopup}
            theme={theme}
          />
        );
      })}
    </MapContainer>
  );
}
