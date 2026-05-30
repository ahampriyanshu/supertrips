import { useEffect, useState } from "react";
import "./App.css";

import TripDetails from "./TripDetails";
import { CATEGORIES, CITIES, REGIONS, STATES, TRIPS } from "./data.js";


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

function toDirectoryItems(groups, basePath) {
  return Object.values(groups).map(({ label, slug, cities }) => ({
    label,
    href: `/${basePath}/${slug}`,
    count: cities.length,
  }));
}

const directoryGroups = [
  {
    title: "By region",
    description: "Browse places by broad travel zones.",
    items: toDirectoryItems(REGIONS, "regions"),
  },
  {
    title: "By state",
    description: "State-wise entry points for the destinations in these routes.",
    items: toDirectoryItems(STATES, "states"),
  },
  {
    title: "By category",
    description: "Group destinations by the kind of trip they fit best.",
    items: toDirectoryItems(CATEGORIES, "categories"),
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

function navigateTo(href) {
  if (typeof window === "undefined") return;
  window.history.pushState(null, "", href);
  window.dispatchEvent(new Event("popstate"));
}

function Link({ href, style, children, ...props }) {
  return (
    <a
      {...props}
      href={href}
      style={style}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

function formatParam(value) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function pluralize(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function getGroupBySlug(groups, slug) {
  return Object.entries(groups).find(([key, group]) => group.slug === slug || key === slug)?.[1];
}

function getStateLabel(stateCode) {
  return STATES[stateCode]?.label || formatParam(stateCode || "");
}

function getRegionLabel(regionCode) {
  return REGIONS[regionCode]?.label || formatParam(regionCode || "");
}

function getCategoryLabel(categoryCode) {
  return CATEGORIES[categoryCode]?.label || formatParam(categoryCode || "");
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function getTripsForCity(cityCode) {
  return TRIPS.map((trip, tripIndex) => {
    const stops = trip.cities
      .map((city, cityIndex) => city.code === cityCode ? { city, cityIndex } : null)
      .filter(Boolean);

    return stops.length ? { trip, tripIndex, stops } : null;
  }).filter(Boolean);
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
  backpackingSection: { maxWidth: 720, margin: "0 auto", padding: "0 0 3rem" },
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
  directoryLink: { display: "inline-flex", alignItems: "center", gap: 6, minHeight: 30, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.65rem", color: "#6a5a48", background: "#faf7f2", fontSize: 12, textDecoration: "none" },
  directoryCount: { fontSize: 10, color: "#c9962a", fontWeight: 700 },
  pageHeader: { background: "#1a1208", color: "#f5f0e8", padding: "2rem 2rem 2.25rem", position: "relative", overflow: "hidden" },
  pageContent: { maxWidth: 720, margin: "0 auto", padding: "2rem 0 3rem" },
  pageBack: { display: "inline-flex", alignItems: "center", color: "#c9962a", fontSize: 12, textDecoration: "none", marginBottom: "1.4rem" },
  pageEyebrow: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "#9e8e7a", marginBottom: 8 },
  pageTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2rem,5vw,3.2rem)", lineHeight: 1.1, margin: "0 0 0.85rem", fontWeight: 700 },
  pageIntro: { fontSize: 14, color: "#a09888", maxWidth: 560, lineHeight: 1.7, margin: 0 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" },
  chip: { display: "inline-flex", alignItems: "center", minHeight: 28, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.65rem", color: "#6a5a48", background: "#faf7f2", fontSize: 12, textDecoration: "none" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: "1.5rem" },
  statBox: { background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, padding: "0.9rem 1rem" },
  statLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#8a7a65", marginBottom: 5 },
  statValue: { fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#1a1208" },
  panelGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, alignItems: "start" },
  panel: { background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, padding: "1rem" },
  panelTitle: { fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#1a1208", margin: "0 0 0.65rem" },
  panelList: { margin: 0, paddingLeft: "1.1rem", color: "#6a5a48", fontSize: 13, lineHeight: 1.7 },
  panelListPlain: { margin: 0, padding: 0, listStyle: "none", color: "#6a5a48", fontSize: 13, lineHeight: 1.7 },
  cityGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 },
  cityCard: { display: "block", background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, padding: "1rem", color: "#1a1208", textDecoration: "none" },
  cityCardTitle: { fontFamily: "Georgia, serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 4 },
  cityCardMeta: { fontSize: 12, color: "#8a7a65", lineHeight: 1.5, marginBottom: 10 },
  miniChipRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  miniChip: { display: "inline-flex", alignItems: "center", minHeight: 24, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.5rem", color: "#6a5a48", background: "#f5f0e8", fontSize: 11 },
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

function PageHeader({ eyebrow, title, intro }) {
  return (
    <div style={styles.pageHeader}>
      <div style={styles.heroPattern} />
      <div style={styles.heroInner}>
        <Link href="/" style={styles.pageBack}>Back to SuperTrips</Link>
        <div style={styles.pageEyebrow}>{eyebrow}</div>
        <h1 style={styles.pageTitle}>{title}</h1>
        {intro && <p style={styles.pageIntro}>{intro}</p>}
      </div>
    </div>
  );
}

function ListPanel({ title, items, ordered = true }) {
  const normalizedItems = normalizeList(items);

  if (!normalizedItems.length) return null;

  const ListTag = ordered ? "ul" : "div";

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      <ListTag style={ordered ? styles.panelList : styles.panelListPlain}>
        {normalizedItems.map((item) => ordered ? (
          <li key={item}>{item}</li>
        ) : (
          <div key={item}>{item}</div>
        ))}
      </ListTag>
    </div>
  );
}

function CityCard({ cityCode }) {
  const city = CITIES[cityCode];
  if (!city) return null;

  return (
    <Link href={`/cities/${cityCode}`} style={styles.cityCard}>
      <div style={styles.cityCardTitle}>{city.city}</div>
      <div style={styles.cityCardMeta}>
        {getStateLabel(city.state)} - {getRegionLabel(city.region)}
      </div>
      <div style={styles.miniChipRow}>
        {normalizeList(city.category).slice(0, 3).map(category => (
          <span key={category} style={styles.miniChip}>
            {getCategoryLabel(category)}
          </span>
        ))}
      </div>
    </Link>
  );
}

function CityPage({ cityCode }) {
  const city = CITIES[cityCode];

  if (!city) {
    return <NotFoundPage />;
  }

  const cityTrips = getTripsForCity(cityCode);
  const statItems = [
    ["Ideal stay", city.ideal_stay],
    ["Best season", formatParam(city.ideal_season || "")],
    ["Rating", city.rating ? `${city.rating}/5` : ""],
  ].filter(([, value]) => value);

  return (
    <div style={styles.root}>
      <PageHeader
        eyebrow="City"
        title={city.city}
        intro={`${getStateLabel(city.state)} - ${getRegionLabel(city.region)} India`}
      />

      <main style={styles.pageContent}>
        <div style={styles.chipRow}>
          <Link href={`/states/${STATES[city.state]?.slug || city.state}`} style={styles.chip}>
            {getStateLabel(city.state)}
          </Link>
          <Link href={`/regions/${REGIONS[city.region]?.slug || city.region}`} style={styles.chip}>
            {getRegionLabel(city.region)}
          </Link>
          {normalizeList(city.category).map(category => (
            <Link
              key={category}
              href={`/categories/${CATEGORIES[category]?.slug || category}`}
              style={styles.chip}
            >
              {getCategoryLabel(category)}
            </Link>
          ))}
        </div>

        {!!statItems.length && (
          <div style={styles.statGrid}>
            {statItems.map(([label, value]) => (
              <div key={label} style={styles.statBox}>
                <div style={styles.statLabel}>{label}</div>
                <div style={styles.statValue}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.panelGrid}>
          <ListPanel title="Must visit" items={city.must_visit} />
          <ListPanel title="Must try" items={city.must_try} />
          <ListPanel title="Mode of travel" items={normalizeList(city.mode_of_travel).map(formatParam)} />
          <ListPanel title="Accommodation" items={city.accommodation} />
          <ListPanel title="Notes" items={city.notes} />

          {!!cityTrips.length && (
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Appears in trips</h2>
              <ul style={styles.panelList}>
                {cityTrips.map(({ trip, tripIndex, stops }) => (
                  <li key={`${trip.name}-${tripIndex}`}>
                    {trip.name} - stop {stops.map(({ cityIndex }) => cityIndex + 1).join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function GroupPage({ type, value }) {
  const groups = {
    state: STATES,
    region: REGIONS,
    category: CATEGORIES,
  }[type];
  const group = getGroupBySlug(groups, value);

  if (!group) {
    return <NotFoundPage />;
  }

  const cityCodes = group.cities
    .filter(cityCode => CITIES[cityCode])
    .sort((a, b) => CITIES[a].city.localeCompare(CITIES[b].city));

  const typeLabel = {
    state: "State",
    region: "Region",
    category: "Category",
  }[type];

  const intro = {
    state: `${pluralize(cityCodes.length, "destination")} from ${group.label}.`,
    region: `${pluralize(cityCodes.length, "destination")} from the ${group.label.toLowerCase()} travel zone.`,
    category: `${pluralize(cityCodes.length, "destination")} that fit the ${group.label.toLowerCase()} style of travel.`,
  }[type];

  return (
    <div style={styles.root}>
      <PageHeader eyebrow={typeLabel} title={group.label} intro={intro} />

      <main style={styles.pageContent}>
        <div style={styles.cityGrid}>
          {cityCodes.map(cityCode => (
            <CityCard key={cityCode} cityCode={cityCode} />
          ))}
        </div>
      </main>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={styles.root}>
      <PageHeader
        eyebrow="404"
        title="Not found"
        intro={`Available paths: ${routeDefinitions.join(", ")}`}
      />
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
            <li>Keep rain cover and slippers near the top of the bag.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Work Setup</div>
          <ul style={styles.backpackingList}>
            <li>Extension board for awkward hotel, hostel, and cafe plug points.</li>
            <li>Power bank, spare charging cable, and a small notebook.</li>
            <li>Offline copies of tickets, IDs, bookings, and important addresses.</li>
            <li>Carry a small mouse if you work long hours from cafes or homestays.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Small Hacks</div>
          <ul style={styles.backpackingList}>
            <li>Keep a sleep pouch ready for trains and overnight buses.</li>
            <li>Pack one accessible fresh set for delayed check-ins.</li>
            <li>Do laundry before moving cities, not after arriving tired.</li>
            <li>Save the next hotel address in the local language before leaving.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Documents</div>
          <ul style={styles.backpackingList}>
            <li>Keep one printed ID copy in a different pocket from the original.</li>
            <li>Save tickets, hotel bookings, and permits offline before travel days.</li>
            <li>Keep passport photos and emergency contacts in your wallet.</li>
          </ul>
        </div>

        <div style={styles.backpackingCard}>
          <div style={styles.backpackingCardTitle}>Money</div>
          <ul style={styles.backpackingList}>
            <li>Split cash across your wallet, backpack, and phone cover.</li>
            <li>Carry some small notes for buses, autos, tea stalls, and cloakrooms.</li>
            <li>Keep one backup card separate from the card you use daily.</li>
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
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [route.path]);

  if (route.name === "city") {
    return <CityPage cityCode={route.value} />;
  }

  if (route.name === "state") {
    return <GroupPage type="state" value={route.value} />;
  }

  if (route.name === "region") {
    return <GroupPage type="region" value={route.value} />;
  }

  if (route.name === "category") {
    return <GroupPage type="category" value={route.value} />;
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
              {group.items.map(({ label, href, count }) => (
                <Link key={href} href={href} style={styles.directoryLink}>
                  <span>{label}</span>
                  <span style={styles.directoryCount}>{count}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
