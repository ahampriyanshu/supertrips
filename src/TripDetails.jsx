import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function BoundsUpdater({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

export default function TripDetails({ trip, index, onBack }) {
  const positions = trip.cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng]);
  const totalDays = Math.round(trip.cities.reduce((sum, c) => {
    const d = c.dur.toLowerCase();
    if (d.includes("month")) return sum + parseFloat(d) * 30;
    if (d.includes("week")) return sum + parseFloat(d) * 7;
    if (d.includes("½") || d.includes("0.5")) return sum + 0.5;
    return sum + (parseFloat(d) || 1);
  }, 0));

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <button 
        onClick={onBack}
        style={{ background: "transparent", border: "none", color: "#c9962a", cursor: "pointer", fontSize: 13, marginBottom: "2rem", display: "flex", alignItems: "center", gap: 5, padding: 0, textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}
      >
        ← Back to all trips
      </button>

      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "3rem", marginBottom: "0.5rem", color: "#1a1208", fontWeight: 700 }}>
          SuperTrip {index + 1} — <span style={{ fontStyle: "italic", color: "#c9962a" }}>{trip.name}</span>
        </h2>
        <div style={{ color: "#8a7a65", letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12 }}>
          {trip.cities.length} Stops · {totalDays}+ Days on the road
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem" }}>
        {/* Left: Timeline */}
        <div className="hide-scroll" style={{ background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, padding: "2rem", height: 600, overflowY: "auto", position: "relative" }}>
          <h3 style={{ fontSize: "11px", letterSpacing: 3, textTransform: "uppercase", color: "#8a7a65", marginBottom: "2rem", borderBottom: "1px solid #e0d8cc", paddingBottom: "1rem" }}>
            Route Itinerary
          </h3>
          <div style={{ position: "relative", paddingLeft: "2rem", borderLeft: "1px dashed #c9962a", marginLeft: "10px" }}>
            {trip.cities.map((city, idx) => (
              <div key={idx} style={{ marginBottom: "2rem", position: "relative" }}>
                <div style={{ position: "absolute", left: "-2.35rem", width: 12, height: 12, background: "#faf7f2", borderRadius: "50%", top: 5, border: "3px solid #c9962a" }} />
                <div style={{ padding: "0" }}>
                  <h4 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: 6, color: "#1a1208", fontWeight: 700 }}>{city.city}</h4>
                  <span style={{ fontSize: "0.85rem", color: "#6a6055", display: "inline-block", background: "rgba(201, 150, 42, 0.1)", padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5, fontWeight: 500 }}>
                    Stay: {city.dur}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map */}
        <div style={{ height: 600, borderRadius: 4, overflow: "hidden", border: "1px solid #e0d8cc", zIndex: 1, boxShadow: "0 10px 30px rgba(26, 18, 8, 0.05)" }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%", zIndex: 1, background: "#f5f0e8" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {positions.length > 0 && <BoundsUpdater positions={positions} />}
            {positions.length > 1 && (
              <Polyline 
                positions={positions} 
                pathOptions={{ color: '#c9962a', weight: 4, opacity: 0.8, dashArray: '6, 12' }} 
              />
            )}
            {trip.cities.map((city, i) => {
              if (!city.lat || !city.lng) return null;
              return (
                <Marker key={i} position={[city.lat, city.lng]}>
                  <Popup>
                    <strong style={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", color: "#1a1208" }}>{city.city}</strong><br/>
                    <span style={{ color: "#8a7a65", fontSize: "0.9rem" }}>Stay: {city.dur}</span>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
