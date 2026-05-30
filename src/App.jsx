import { useState } from "react";

import TRIPS from "./data.json";
import TripDetails from "./TripDetails";

function parseDays(dur) {
  const d = dur.toLowerCase();
  if (d.includes("month")) return parseFloat(d) * 30;
  if (d.includes("week")) return parseFloat(d) * 7;
  if (d.includes("½") || d.includes("0.5")) return 0.5;
  return parseFloat(d) || 1;
}

const totalCities = new Set(TRIPS.flatMap(t => t.cities.map(c => c.city))).size;
const totalDays = Math.round(TRIPS.flatMap(t => t.cities.map(c => parseDays(c.dur))).reduce((a, b) => a + b, 0));
const totalStops = TRIPS.reduce((a, t) => a + t.cities.length, 0);

const styles = {
  root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f0e8", color: "#1a1208", minHeight: "100vh" },
  hero: { background: "#1a1208", color: "#f5f0e8", padding: "3rem 2rem 2.5rem", position: "relative", overflow: "hidden" },
  heroPattern: { position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,150,42,0.04) 40px, rgba(201,150,42,0.04) 41px)" },
  heroInner: { position: "relative", maxWidth: 720, margin: "0 auto" },
  heroLabel: { fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#c9962a", marginBottom: "1rem" },
  heroTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.4rem,6vw,3.8rem)", lineHeight: 1.1, marginBottom: "1rem", fontWeight: 700 },
  heroTitleEm: { fontStyle: "italic", color: "#c9962a" },
  heroSub: { fontSize: 14, color: "#a09888", maxWidth: 480, lineHeight: 1.7, marginBottom: "2rem" },
  heroStats: { display: "flex", gap: "2rem", flexWrap: "wrap" },
  heroStatN: { fontFamily: "Georgia, serif", fontSize: "2rem", color: "#c9962a", lineHeight: 1 },
  heroStatL: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#6a6055", marginTop: 3 },
  section: { maxWidth: 720, margin: "0 auto", padding: "2rem" },
  card: (open) => ({
    background: "#faf7f2", border: `1px solid ${open ? "#c9962a" : "#e0d8cc"}`,
    borderRadius: 4, marginBottom: 12, overflow: "hidden", cursor: "pointer",
    boxShadow: open ? "0 2px 16px rgba(201,150,42,0.1)" : "none", transition: "border-color 0.2s, box-shadow 0.2s"
  }),
  cardHeader: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" },
  tripNum: (open) => ({ fontFamily: "Georgia, serif", fontSize: "1.6rem", fontStyle: "italic", color: "#c9962a", opacity: open ? 1 : 0.5, minWidth: 36, lineHeight: 1 }),
  tripName: { fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: 700 },
  tripMeta: { fontSize: 12, color: "#8a7a65", marginTop: 2 },
  arrow: (open) => ({ fontSize: 18, color: open ? "#c9962a" : "#8a7a65", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s, color 0.2s" }),
  routeStrip: { display: "flex", alignItems: "center", flexWrap: "nowrap", overflowX: "auto", padding: "0 1.25rem 0.75rem", borderTop: "1px solid #e0d8cc", scrollbarWidth: "none" },
  routeCity: { fontSize: 11, color: "#8a7a65", whiteSpace: "nowrap" },
  routeDot: { width: 3, height: 3, borderRadius: "50%", background: "#c9962a", margin: "0 5px", flexShrink: 0 },
  citiesWrap: { borderTop: "1px solid #e0d8cc", padding: "1rem 1.25rem", background: "white" },
  citiesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 },
  cityItem: { background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 3, padding: "8px 10px" },
  cityName: { fontSize: 13, fontWeight: 500 },
  cityDur: { fontSize: 11, color: "#8a7a65", marginTop: 2 },
  statsBar: { background: "#1a1208", color: "#f5f0e8", padding: "1.5rem 2rem", marginTop: "1rem" },
  statsInner: { maxWidth: 720, margin: "0 auto" },
  statsRow: { display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-start" },
  statN: { fontFamily: "Georgia, serif", fontSize: "1.5rem", color: "#c9962a" },
  statL: { fontSize: 11, color: "#6a6055", letterSpacing: 1, textTransform: "uppercase" },
  footer: { textAlign: "center", padding: "2rem", fontSize: 11, color: "#8a7a65", letterSpacing: 1, textTransform: "uppercase" }
};

function TripCard({ trip, index, onSelect }) {
  const preview = trip.cities.slice(0, 8);
  const extra = trip.cities.length - 8;

  return (
    <div style={styles.card(false)} onClick={onSelect}>
      <div style={styles.cardHeader}>
        <div style={styles.tripNum(false)}>{String(index + 1).padStart(2, "0")}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.tripName}>SuperTrip {index + 1} — {trip.name}</div>
          <div style={styles.tripMeta}>{trip.cities.length} stops</div>
        </div>
        <div style={styles.arrow(false)}>›</div>
      </div>

      <div style={styles.routeStrip} className="hide-scroll">
        {preview.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={styles.routeCity}>{c.city}</span>
            {i < preview.length - 1 && <span style={styles.routeDot} />}
          </span>
        ))}
        {extra > 0 && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}><span style={{ ...styles.routeCity, color: "#c9962a", marginLeft: "8px" }}>+{extra} more</span></span>}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);

  if (selectedTripIndex !== null) {
    return (
      <div style={styles.root}>
        <TripDetails 
          trip={TRIPS[selectedTripIndex]} 
          index={selectedTripIndex}
          onBack={() => setSelectedTripIndex(null)} 
        />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <div style={styles.heroPattern} />
        <div style={styles.heroInner}>
          <div style={styles.heroLabel}>India, one city at a time</div>
          <h1 style={styles.heroTitle}>
            Super<em style={styles.heroTitleEm}>Trips</em>
          </h1>
          <p style={styles.heroSub}>
            Routes from remote work, slow travel, and ordinary days across India. Kept as notes from the road, and shared in case they help someone plan their own journey.
          </p>
          <div style={styles.heroStats}>
            {[["10", "Trips"], [totalCities, "Unique cities"], [totalStops, "Total stops"], [`${totalDays}+`, "Days on the road"]].map(([n, l]) => (
              <div key={l}>
                <div style={styles.heroStatN}>{n}</div>
                <div style={styles.heroStatL}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        {TRIPS.map((trip, i) => <TripCard key={i} trip={trip} index={i} onSelect={() => setSelectedTripIndex(i)} />)}
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statsInner}>
          <div style={styles.statsRow}>
            {[["North", "Delhi · Punjab · J&K · HP · UP"], ["South", "Kerala · Tamil Nadu · Karnataka · AP"], ["East", "Bengal · Odisha · Northeast"], ["West", "Rajasthan · Gujarat · Goa · Mumbai"]].map(([n, l]) => (
              <div key={n}>
                <div style={styles.statN}>{n}</div>
                <div style={styles.statL}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
  );
}
