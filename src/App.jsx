import { useEffect, useState } from "react";
import "./App.css";

import TripDetails from "./TripDetails";
import { CATEGORIES, CITIES, REGIONS, STATES, TRIPS } from "./data.js";


const totalCities = new Set(TRIPS.flatMap(t => t.cities.map(c => c.city))).size;
const totalStops = TRIPS.reduce((a, t) => a + t.cities.length, 0);

const routeDefinitions = [
  "/",
  "/supertrips",
  "/cities",
  "/cities/:city",
  "/categories",
  "/states/:state",
  "/regions/:region",
  "/categories/:category",
];

const directoryLinks = [
  {
    title: "Cities",
    href: "/cities",
    count: totalCities,
    description: "Browse by region, state, and city in one clean list.",
  },
  {
    title: "Categories",
    href: "/categories",
    count: Object.keys(CATEGORIES).length,
    description: "Find destinations by the kind of trip you want to take.",
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
  if (parts.length === 1 && parts[0] === "cities") {
    return { name: "cities", path: "/cities" };
  }
  if (parts.length === 2 && parts[0] === "cities") {
    return { name: "city", path: pathname, value: parts[1] };
  }
  if (parts.length === 1 && parts[0] === "categories") {
    return { name: "categories", path: "/categories" };
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

function sortCityCodes(cityCodes) {
  return cityCodes
    .filter(cityCode => CITIES[cityCode])
    .sort((a, b) => CITIES[a].city.localeCompare(CITIES[b].city));
}

function sortStateCodes(stateCodes) {
  return stateCodes.sort((a, b) => getStateLabel(a).localeCompare(getStateLabel(b)));
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
  directoryCount: { fontSize: 10, color: "#c9962a", fontWeight: 700 },
  directoryShortcut: { display: "block", borderTop: "1px solid #e0d8cc", padding: "1rem 0", color: "#1a1208", textDecoration: "none" },
  directoryShortcutTop: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 },
  directoryShortcutTitle: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700 },
  directoryShortcutText: { fontSize: 12, lineHeight: 1.6, color: "#8a7a65", margin: 0 },
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
  indexBlock: { borderTop: "1px solid #d8cec0", paddingTop: "1.5rem", marginTop: "1.5rem" },
  indexHeading: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.55rem", lineHeight: 1.2, margin: "0 0 1rem", color: "#1a1208" },
  indexSubheading: { fontFamily: "Georgia, serif", fontSize: "1rem", margin: "1rem 0 0.45rem", color: "#1a1208" },
  cityList: { margin: 0, padding: 0, listStyle: "none", borderTop: "1px solid #e0d8cc" },
  cityListLink: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, padding: "0.55rem 0", borderBottom: "1px solid #e0d8cc", color: "#1a1208", fontSize: 14, textDecoration: "none" },
  cityListMeta: { color: "#8a7a65", fontSize: 12, textAlign: "right" },
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

function CityListItem({ cityCode, meta }) {
  const city = CITIES[cityCode];
  if (!city) return null;

  return (
    <li>
      <Link href={`/cities/${cityCode}`} style={styles.cityListLink}>
        <span>{city.city}</span>
        {meta && <span style={styles.cityListMeta}>{meta}</span>}
      </Link>
    </li>
  );
}

function CitiesIndexPage() {
  const regions = Object.values(REGIONS).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div style={styles.root}>
      <PageHeader
        eyebrow="Cities"
        title="Cities"
        intro="All destinations grouped by region, state, and city."
      />

      <main style={styles.pageContent}>
        {regions.map(region => {
          const regionCityCodes = sortCityCodes(region.cities);
          const stateCodes = sortStateCodes([
            ...new Set(regionCityCodes.map(cityCode => CITIES[cityCode].state)),
          ]);

          return (
            <section key={region.slug} style={styles.indexBlock}>
              <h2 style={styles.indexHeading}>{region.label}</h2>

              {stateCodes.map(stateCode => {
                const stateCityCodes = sortCityCodes(
                  regionCityCodes.filter(cityCode => CITIES[cityCode].state === stateCode)
                );

                return (
                  <div key={`${region.slug}-${stateCode}`}>
                    <h3 style={styles.indexSubheading}>{getStateLabel(stateCode)}</h3>
                    <ul style={styles.cityList}>
                      {stateCityCodes.map(cityCode => (
                        <CityListItem
                          key={cityCode}
                          cityCode={cityCode}
                          meta={CITIES[cityCode].ideal_stay}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}

function CategoriesIndexPage() {
  const categories = Object.values(CATEGORIES).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div style={styles.root}>
      <PageHeader
        eyebrow="Categories"
        title="Categories"
        intro="Travel styles with matching destinations from these routes."
      />

      <main style={styles.pageContent}>
        {categories.map(category => {
          const cityCodes = sortCityCodes(category.cities);

          return (
            <section key={category.slug} style={styles.indexBlock}>
              <h2 style={styles.indexHeading}>{category.label}</h2>
              <ul style={styles.cityList}>
                {cityCodes.map(cityCode => (
                  <CityListItem
                    key={cityCode}
                    cityCode={cityCode}
                    meta={`${getStateLabel(CITIES[cityCode].state)} - ${getRegionLabel(CITIES[cityCode].region)}`}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
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
          <Link href="/cities" style={styles.chip}>
            {getStateLabel(city.state)}
          </Link>
          <Link href="/cities" style={styles.chip}>
            {getRegionLabel(city.region)}
          </Link>
          {normalizeList(city.category).map(category => (
            <Link
              key={category}
              href="/categories"
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
        <ul style={styles.cityList}>
          {cityCodes.map(cityCode => (
            <CityListItem
              key={cityCode}
              cityCode={cityCode}
              meta={`${getStateLabel(CITIES[cityCode].state)} - ${getRegionLabel(CITIES[cityCode].region)}`}
            />
          ))}
        </ul>
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

  if (route.name === "cities") {
    return <CitiesIndexPage />;
  }

  if (route.name === "city") {
    return <CityPage cityCode={route.value} />;
  }

  if (route.name === "categories") {
    return <CategoriesIndexPage />;
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

        {directoryLinks.map(link => (
          <Link key={link.href} href={link.href} style={styles.directoryShortcut}>
            <div style={styles.directoryShortcutTop}>
              <span style={styles.directoryShortcutTitle}>{link.title}</span>
              <span style={styles.directoryCount}>{link.count}</span>
            </div>
            <p style={styles.directoryShortcutText}>{link.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
