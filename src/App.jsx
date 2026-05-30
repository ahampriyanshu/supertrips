import { useEffect, useState } from "react";
import "./App.css";

import TRIPS from "./trips.js";
import TripDetails from "./TripDetails";


const totalCities = new Set(TRIPS.flatMap(t => t.cities.map(c => c.city))).size;
const totalStops = TRIPS.reduce((a, t) => a + t.cities.length, 0);

const routeDefinitions = [
  "/",
  "/supertrips",
  "/cities/:city",
  "/states/:state",
  "/regions/:region",
  "/categories/:category",
];

const directoryGroups = [
  {
    title: "By region",
    description: "Browse places by broad travel zones.",
    items: [
      ["Northern", "/regions/northern"],
      ["Western", "/regions/western"],
      ["Eastern", "/regions/eastern"],
      ["Central", "/regions/central"],
      ["Southern", "/regions/southern"],
      ["Northeastern", "/regions/northeastern"],
    ],
  },
  {
    title: "By state",
    description: "State-wise entry points for the destinations in these routes.",
    items: [
      ["Delhi", "/states/delhi"],
      ["Haryana", "/states/haryana"],
      ["Uttar Pradesh", "/states/uttar-pradesh"],
      ["Rajasthan", "/states/rajasthan"],
      ["Gujarat", "/states/gujarat"],
      ["Maharashtra", "/states/maharashtra"],
      ["Goa", "/states/goa"],
      ["Karnataka", "/states/karnataka"],
      ["Kerala", "/states/kerala"],
      ["Tamil Nadu", "/states/tamil-nadu"],
      ["Telangana", "/states/telangana"],
      ["Madhya Pradesh", "/states/madhya-pradesh"],
      ["Odisha", "/states/odisha"],
      ["West Bengal", "/states/west-bengal"],
      ["Punjab", "/states/punjab"],
      ["Jammu & Kashmir", "/states/jammu-kashmir"],
      ["Ladakh", "/states/ladakh"],
      ["Himachal Pradesh", "/states/himachal-pradesh"],
      ["Assam", "/states/assam"],
      ["Meghalaya", "/states/meghalaya"],
      ["Nagaland", "/states/nagaland"],
      ["Arunachal Pradesh", "/states/arunachal-pradesh"],
      ["Sikkim", "/states/sikkim"],
    ],
  },
  {
    title: "By category",
    description: "Group destinations by the kind of trip they fit best.",
    items: [
      ["Coastal", "/categories/coastal"],
      ["Hill station", "/categories/hill-station"],
      ["Pilgrimage", "/categories/pilgrimage"],
      ["Heritage", "/categories/heritage"],
      ["Food", "/categories/food"],
      ["Desert", "/categories/desert"],
      ["Fort & palace", "/categories/fort-palace"],
      ["River ghats", "/categories/river-ghat"],
      ["Backwaters", "/categories/backwaters"],
      ["Tea & coffee estates", "/categories/tea-coffee-estate"],
      ["Metro", "/categories/metro"],
      ["Workation", "/categories/workation"],
      ["Scenic drive", "/categories/scenic-drive"],
      ["Adventure", "/categories/adventure"],
    ],
  },
];

function getPathname() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { name: "home", path: "/" };
  if (parts.length === 1 && parts[0] === "supertrips") {
    return { name: "supertrips", path: "/supertrips" };
  }
  if (parts.length === 2 && parts[0] === "cities") {
    return { name: "city", path: pathname, value: parts[1] };
  }
  if (parts.length === 2 && parts[0] === "states") {
    return { name: "state", path: pathname, value: parts[1] };
  }
  if (parts.length === 2 && parts[0] === "regions") {
    return { name: "region", path: pathname, value: parts[1] };
  }
  if (parts.length === 2 && parts[0] === "categories") {
    return { name: "category", path: pathname, value: parts[1] };
  }

  return { name: "not-found", path: pathname };
}

function useCurrentRoute() {
  const [route, setRoute] = useState(() => parseRoute(getPathname()));

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute(getPathname()));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return route;
}

function formatParam(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const styles = {
  root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f0e8", color: "#1a1208", minHeight: "100vh" },
  hero: { background: "#1a1208", color: "#f5f0e8", padding: "3rem 2rem 2.5rem", position: "relative", overflow: "hidden" },
  heroPattern: { position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,150,42,0.04) 40px, rgba(201,150,42,0.04) 41px)" },
  heroInner: { position: "relative", maxWidth: 720, margin: "0 auto" },
  heroTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.4rem,6vw,3.8rem)", lineHeight: 1.1, marginBottom: "1rem", fontWeight: 700 },
  heroTitleEm: { fontStyle: "italic", color: "#c9962a" },
  heroSub: { fontSize: 14, color: "#a09888", maxWidth: 480, lineHeight: 1.7, marginBottom: "2rem" },
  heroStats: { display: "flex", gap: "2rem", flexWrap: "wrap" },
  heroStatN: { fontFamily: "Georgia, serif", fontSize: "2rem", color: "#c9962a", lineHeight: 1 },
  heroStatL: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e8e7a", marginTop: 3 },
  section: { maxWidth: 720, margin: "0 auto", padding: "2rem 0" },
  card: { background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, marginBottom: 12, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s" },
  cardHeader: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" },
  tripNum: { fontFamily: "Georgia, serif", fontSize: "1.6rem", fontStyle: "italic", color: "#c9962a", opacity: 0.5, minWidth: 36, lineHeight: 1 },
  tripName: { fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: 700 },
  tripMeta: { fontSize: 12, color: "#6a5a48", marginTop: 2 },
  arrow: { fontSize: 18, color: "#8a7a65", transition: "transform 0.2s, color 0.2s" },
  routeStrip: { display: "flex", alignItems: "center", flexWrap: "nowrap", overflowX: "auto", padding: "0.375rem 1.25rem 0.75rem", borderTop: "1px solid #e0d8cc", scrollbarWidth: "none" },
  routeCity: { fontSize: 11, color: "#6a5a48", whiteSpace: "nowrap" },
  routeDot: { width: 3, height: 3, borderRadius: "50%", background: "#c9962a", margin: "0 5px", flexShrink: 0 },
  backpackingSection: { maxWidth: 720, margin: "0 auto", padding: "2.5rem 0 3rem" },
  backpackingTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, margin: "0 0 0.75rem", color: "#1a1208" },
  backpackingIntro: { fontSize: 14, lineHeight: 1.7, color: "#6a5a48", maxWidth: 560, margin: "0 0 1.5rem" },
  backpackingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 },
  backpackingCard: { background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, padding: "1rem" },
  backpackingCardTitle: { fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#1a1208", marginBottom: "0.6rem" },
  backpackingList: { margin: 0, paddingLeft: "1.1rem", color: "#6a5a48", fontSize: 13, lineHeight: 1.7 },
  directorySection: { maxWidth: 720, margin: "0 auto", padding: "0 0 2.5rem" },
  directoryTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, margin: "0 0 0.75rem", color: "#1a1208" },
  directoryIntro: { fontSize: 14, lineHeight: 1.7, color: "#6a5a48", maxWidth: 560, margin: "0 0 2rem" },
  directoryGroup: { borderTop: "1px solid #e0d8cc", paddingTop: "1.25rem", marginTop: "1.25rem" },
  directoryGroupTitle: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "#1a1208" },
  directoryGroupDescription: { fontSize: 12, lineHeight: 1.6, color: "#8a7a65", margin: "0 0 0.85rem" },
  directoryLinks: { display: "flex", flexWrap: "wrap", gap: 8 },
  directoryLink: { display: "inline-flex", alignItems: "center", minHeight: 30, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.65rem", color: "#6a5a48", background: "#faf7f2", fontSize: 12, textDecoration: "none" },
  footer: { textAlign: "center", padding: "2rem", fontSize: 11, color: "#8a7a65", letterSpacing: 1, textTransform: "uppercase" }
};

function TripCard({ trip, index, onSelect }) {
  const preview = trip.cities.slice(0, 8);
  const extra = trip.cities.length - 8;

  return (
    <div style={styles.card} className="trip-card" onClick={onSelect}>
      <div style={styles.cardHeader}>
        <div style={styles.tripNum}>{String(index + 1).padStart(2, "0")}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.tripName}>{trip.name}</div>
          <div style={styles.tripMeta}>{trip.cities.length} stops</div>
        </div>
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

function PlaceholderPage({ type, value }) {
  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <div style={styles.heroPattern} />
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>{formatParam(value)}</h1>
          <p style={styles.heroSub}>{type}</p>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <div style={styles.heroPattern} />
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Not found</h1>
          <p style={styles.heroSub}>
            Available paths: {routeDefinitions.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

function BackpackingSection() {
  return (
    <section style={styles.backpackingSection}>
      <h2 style={styles.backpackingTitle}>Backpacking 101</h2>
      <p style={styles.backpackingIntro}>
        A small, practical list from the road: things worth carrying, habits that
        saved time, and a few items that helped during workdays away from home.
      </p>

      <div style={styles.backpackingGrid}>
        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Carry</div>
          <ul style={styles.backpackingList}>
            <li>One small day bag for walks, buses, and short stays.</li>
            <li>Packing cubes or cloth pouches to separate clothes quickly.</li>
            <li>A light towel, basic medicines, and a reusable water bottle.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Work Setup</div>
          <ul style={styles.backpackingList}>
            <li>Extension board for awkward hotel, hostel, and cafe plug points.</li>
            <li>Power bank, spare charging cable, and a small notebook.</li>
            <li>Offline copies of tickets, IDs, bookings, and important addresses.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Small Hacks</div>
          <ul style={styles.backpackingList}>
            <li>Keep a sleep pouch ready for trains and overnight buses.</li>
            <li>Pack one accessible fresh set for delayed check-ins.</li>
            <li>Do laundry before moving cities, not after arriving tired.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const route = useCurrentRoute();
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [initialCityIndex, setInitialCityIndex] = useState(0);

  useEffect(() => {
    setSelectedTripIndex(null);
    setInitialCityIndex(0);
  }, [route.path]);

  if (route.name === "city") {
    return <PlaceholderPage type="City" value={route.value} />;
  }

  if (route.name === "state") {
    return <PlaceholderPage type="State" value={route.value} />;
  }

  if (route.name === "region") {
    return <PlaceholderPage type="Region" value={route.value} />;
  }

  if (route.name === "category") {
    return <PlaceholderPage type="Category" value={route.value} />;
  }

  if (route.name === "not-found") {
    return <NotFoundPage />;
  }

  if (selectedTripIndex !== null) {
    const prevIdx = (selectedTripIndex - 1 + TRIPS.length) % TRIPS.length;
    const nextIdx = (selectedTripIndex + 1) % TRIPS.length;
    return (
      <div style={styles.root}>
        <TripDetails
          key={selectedTripIndex}
          trip={TRIPS[selectedTripIndex]}
          index={selectedTripIndex}
          initialCityIndex={initialCityIndex}
          onBack={() => { setInitialCityIndex(0); setSelectedTripIndex(null); }}
          onPrevTrip={(fromEnd = false) => {
            setInitialCityIndex(fromEnd === true ? TRIPS[prevIdx].cities.length - 1 : 0);
            setSelectedTripIndex(prevIdx);
          }}
          onNextTrip={() => {
            setInitialCityIndex(0);
            setSelectedTripIndex(nextIdx);
          }}
        />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <div style={styles.heroPattern} />
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>
            Super<em style={styles.heroTitleEm}>Trips</em>
          </h1>
          <p style={styles.heroSub}>
            A personal diary of the routes I took while backpacking across India.
            Kept as notes from the road, and shared in case they help someone
            plan their own journey.
          </p>
          <div style={styles.heroStats}>
            {[
              ["10", "Trips"],
              [totalCities, "Unique cities"],
              [totalStops, "Total stops"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={styles.heroStatN}>{n}</div>
                <div style={styles.heroStatL}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        {TRIPS.map((trip, i) => (
          <TripCard
            key={i}
            trip={trip}
            index={i}
            onSelect={() => setSelectedTripIndex(i)}
          />
        ))}
      </div>

      <BackpackingSection />

      <section style={styles.directorySection}>
        <h2 style={styles.directoryTitle}>Plan your next itinerary</h2>
        <p style={styles.directoryIntro}>
          Start with a region, state, or travel style, then build a route around
          the places that fit your time, pace, and mood.
        </p>

        {directoryGroups.map(group => (
          <div key={group.title} style={styles.directoryGroup}>
            <div style={styles.directoryGroupTitle}>{group.title}</div>
            <p style={styles.directoryGroupDescription}>{group.description}</p>
            <div style={styles.directoryLinks}>
              {group.items.map(([label, href]) => (
                <a key={href} href={href} style={styles.directoryLink}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
