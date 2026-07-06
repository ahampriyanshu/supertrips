import { CircleMarker, MapContainer, Popup } from "react-leaflet";
import MapTileLayer from "./MapTileLayer.jsx";
import { ACCOMMODATIONS, CATEGORIES, REGIONS, STATES } from "../data.js";
import { navigateTo } from "../nav.js";

const cityMapMarkerOptions = {
  color: "#1a1208",
  fillColor: "#c9962a",
  fillOpacity: 0.82,
  opacity: 0.9,
  weight: 1.2,
};

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

function getAccommodationLabel(accommodationCode) {
  return ACCOMMODATIONS[accommodationCode]?.label || formatParam(accommodationCode || "");
}

function getAccommodationSlug(accommodationCode) {
  return ACCOMMODATIONS[accommodationCode]?.slug || String(accommodationCode || "").replace(/_/g, "-");
}

function MapPopupLink({ href, className, children }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

export default function CitiesLeafletMap({ cities }) {
  return (
    <MapContainer
      center={[22.4, 79.2]}
      zoom={3.75}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#eae8e0" }}
    >
      <MapTileLayer />

      {cities.map(({ cityCode, city, position }) => {
        const categories = normalizeList(city.category);
        const accommodation = normalizeList(city.accommodation);

        return (
          <CircleMarker
            key={cityCode}
            center={position}
            radius={5}
            pathOptions={cityMapMarkerOptions}
          >
            <Popup className="app-map-popup" closeButton={false}>
              <div className="app-map-popup-inner">
                <MapPopupLink href={`/cities/${cityCode}`} className="app-map-popup-title">
                  {city.city}
                </MapPopupLink>
                <div className="app-map-popup-meta">
                  <MapPopupLink href={`/cities#state-${getStateSlug(city.state)}`}>
                    {getStateLabel(city.state)}
                  </MapPopupLink>
                  <span> · </span>
                  <MapPopupLink href={`/cities#region-${getRegionSlug(city.region)}`}>
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
                          href={`/categories#category-${CATEGORIES[category]?.slug || category}`}
                          className="app-map-popup-chip"
                        >
                          {getCategoryLabel(category)}
                        </MapPopupLink>
                      ))}
                    </div>
                  </div>
                )}

                {accommodation.length > 0 && (
                  <div className="app-map-popup-group">
                    <div className="app-map-popup-label">Stay</div>
                    <div className="app-map-popup-chips">
                      {accommodation.map(stay => (
                        <MapPopupLink
                          key={stay}
                          href={`/stay#${getAccommodationSlug(stay)}`}
                          className="app-map-popup-chip"
                        >
                          {getAccommodationLabel(stay)}
                        </MapPopupLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
