import { getFindHref } from '../findRoutes.js';
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MapTileLayer from "./MapTileLayer.jsx";
import { CATEGORIES, REGIONS, STATES } from "../data.js";
import { navigateTo } from "../nav.js";

const cityMapMarkerOptions = {
  color: "#283b31",
  fillColor: "#a34630",
  fillOpacity: 0.82,
  opacity: 0.9,
  weight: 1.2,
};

const atlasMarkerIcon = L.divIcon({
  className: "app-atlas-marker",
  html: '<span class="app-atlas-dot"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -5],
});

function AtlasBounds({ cities }) {
  const map = useMap();
  const bounds = useMemo(() => L.latLngBounds(cities.map(city => city.position)), [cities]);

  useEffect(() => {
    const fit = () => {
      map.invalidateSize({ pan: false });
      map.setMinZoom(0);
      map.fitBounds(bounds, { padding: [24, 24], animate: false });
      map.setMinZoom(map.getZoom());
    };
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    fit();
    return () => observer.disconnect();
  }, [bounds, map]);

  return null;
}

function formatParam(value) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function getStateLabel(stateCode) {
  return STATES[stateCode]?.label || formatParam(stateCode || "");
}

function getStateSlug(stateCode) {
  return STATES[stateCode]?.slug || String(stateCode || "").replace(/_/g, "-");
}

function getRegionLabel(regionCode) {
  return REGIONS[regionCode]?.label || formatParam(regionCode || "");
}

function getRegionSlug(regionCode) {
  return REGIONS[regionCode]?.slug || String(regionCode || "").replace(/_/g, "-");
}

function getCategoryLabel(categoryCode) {
  return CATEGORIES[categoryCode]?.label || formatParam(categoryCode || "");
}

function MapPopupLink({ href, className, children }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

export default function CitiesLeafletMap({ cities, hero = false }) {
  const MapMarker = hero ? Marker : CircleMarker;
  return (
    <MapContainer
      center={[22.4, 79.2]}
      zoom={3.75}
      scrollWheelZoom={false}
      zoomControl={false}
      zoomSnap={hero ? .25 : 1}
      zoomDelta={hero ? .5 : 1}
      maxZoom={19}
      fadeAnimation={!hero}
      zoomAnimation={!hero}
      markerZoomAnimation={!hero}
      style={{ height: "100%", width: "100%", background: "#eae8e0" }}
    >
      <MapTileLayer />
      {hero && <AtlasBounds cities={cities} />}

      {cities.map(({ cityCode, city, position }) => {
        const categories = normalizeList(city.category);

        return (
          <MapMarker
            key={cityCode}
            {...(hero ? { position, icon: atlasMarkerIcon, title: city.city, riseOnHover: true } : { center: position, radius: 5, pathOptions: cityMapMarkerOptions })}
          >
            <Popup className="app-map-popup" closeButton={false} maxHeight={hero ? 200 : undefined} autoPanPaddingBottomRight={hero ? [5, 22] : undefined}>
              <div className="app-map-popup-inner">
                <MapPopupLink href={`/cities/${cityCode}`} className="app-map-popup-title">
                  {city.city}
                </MapPopupLink>
                <div className="app-map-popup-meta">
                  <MapPopupLink href={getFindHref('state', getStateSlug(city.state))}>
                    {getStateLabel(city.state)}
                  </MapPopupLink>
                  <span> · </span>
                  <MapPopupLink href={getFindHref('region', getRegionSlug(city.region))}>
                    {getRegionLabel(city.region)}
                  </MapPopupLink>
                </div>

                {categories.length > 0 && (
                  <div className="app-map-popup-group">
                    <div className="app-map-popup-label">Categories</div>
                    <div className="app-map-popup-chips">
                      {categories.map(category => (
                        <MapPopupLink
                          key={category}
                          href={getFindHref('category', category)}
                          className="app-map-popup-chip"
                        >
                          {getCategoryLabel(category)}
                        </MapPopupLink>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </Popup>
          </MapMarker>
        );
      })}
    </MapContainer>
  );
}
