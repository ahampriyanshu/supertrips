import { useEffect, useState } from "react";
import "./App.css";

import TripDetails, { CityDetails } from "./TripDetails";
import { CATEGORIES, CITIES, REGIONS, STATES, TRIPS } from "./data.js";


const totalCities = new Set(TRIPS.flatMap(t => t.cities.map(c => c.city))).size;
const totalStops = TRIPS.reduce((a, t) => a + t.cities.length, 0);

const routeDefinitions = [
  "/",
  "/supertrips",
  "/routes/:route",
  "/cities",
  "/cities/:city",
  "/categories",
  "/states/:state",
  "/regions/:region",
  "/categories/:category",
];

function toDirectoryItems(groups, basePath, hashPrefix) {
  return Object.values(groups).map(({ label, slug, cities }) => ({
    label,
    href: `/${basePath}#${hashPrefix}-${slug}`,
    count: cities.length,
  }));
}

const directoryGroups = [
  {
    title: "By region",
    items: toDirectoryItems(REGIONS, "cities", "region"),
  },
  {
    title: "By state",
    items: toDirectoryItems(STATES, "cities", "state"),
  },
  {
    title: "By category",
    items: toDirectoryItems(CATEGORIES, "categories", "category"),
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const tripSlugs = TRIPS.map(trip => slugify(trip.name));

function getTripHref(index) {
  return `/routes/${tripSlugs[index]}`;
}

function getTripIndexBySlug(slug) {
  return tripSlugs.indexOf(slug);
}

function getPathname() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function getHash() {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
}

function getCurrentRoute() {
  return {
    ...parseRoute(getPathname()),
    hash: getHash(),
    state: typeof window === "undefined" ? null : window.history.state,
  };
}

function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { name: "home", path: "/" };
  if (parts.length === 1 && parts[0] === "supertrips") {
    return { name: "supertrips", path: "/supertrips" };
  }
  if (parts.length === 2 && parts[0] === "routes") {
    return { name: "route", path: pathname, value: parts[1] };
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
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const onPopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onPopState);
    };
  }, []);

  return route;
}

function navigateTo(href, state = null) {
  if (typeof window === "undefined") return;
  window.history.pushState(state, "", href);
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

function getCategoryLabel(categoryCode) {
  return CATEGORIES[categoryCode]?.label || formatParam(categoryCode || "");
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
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
  heroTitleLink: { color: "inherit", textDecoration: "none" },
  heroTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.4rem,6vw,3.8rem)", lineHeight: 1.1, marginBottom: "1rem", fontWeight: 700 },
  heroTitleEm: { fontStyle: "italic", color: "#c9962a" },
  heroSub: { fontSize: 14, color: "#a09888", maxWidth: 480, lineHeight: 1.7, marginBottom: "2rem" },
  heroStats: { display: "flex", gap: "2rem", flexWrap: "wrap" },
  heroStatN: { fontFamily: "Georgia, serif", fontSize: "2rem", color: "#c9962a", lineHeight: 1 },
  heroStatL: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e8e7a", marginTop: 3 },
  section: { maxWidth: 720, margin: "0 auto", padding: "2rem 0" },
  card: { display: "block", background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: 4, marginBottom: 12, overflow: "hidden", cursor: "pointer", color: "inherit", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" },
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
  directoryGroup: { paddingTop: "1.25rem", marginTop: "1.25rem" },
  directoryGroupTitle: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "#1a1208" },
  directoryLinks: { display: "flex", flexWrap: "wrap", gap: 8 },
  directoryLink: { display: "inline-flex", alignItems: "center", gap: 6, minHeight: 30, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.65rem", color: "#6a5a48", background: "#faf7f2", fontSize: 12, textDecoration: "none" },
  directoryCount: { fontSize: 10, color: "#c9962a", fontWeight: 700 },
  pageContent: { maxWidth: 720, margin: "0 auto", padding: "0.85rem 0 3rem" },
  breadcrumbWrap: { maxWidth: 720, margin: "0 auto", padding: "1.45rem 0 0.25rem" },
  breadcrumb: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, color: "#8a7a65", fontSize: 14, lineHeight: 1.4 },
  breadcrumbHome: { color: "#8a7a65", fontWeight: 700, textDecoration: "none" },
  breadcrumbSeparator: { color: "#c9962a" },
  breadcrumbCurrent: { color: "#1a1208", fontWeight: 700 },
  indexBlock: { paddingTop: "1.5rem", marginTop: "1.5rem", scrollMarginTop: 16 },
  indexBlockFirst: { paddingTop: 0, marginTop: 0 },
  indexHeading: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.55rem", lineHeight: 1.2, margin: "0 0 1rem", color: "#1a1208" },
  indexSubBlock: { scrollMarginTop: 16 },
  indexSubheading: { fontFamily: "Georgia, serif", fontSize: "1rem", margin: "1rem 0 0.45rem", color: "#1a1208" },
  cityList: { margin: 0, padding: 0, listStyle: "none" },
  cityListItem: { borderBottom: "1px dashed rgba(201,150,42,0.5)" },
  cityListItemLast: { borderBottom: "none" },
  cityListLink: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "0.65rem 0", color: "#1a1208", fontSize: 14, textDecoration: "none" },
  cityListTags: { display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 6 },
  cityListTag: { display: "inline-flex", alignItems: "center", minHeight: 22, border: "1px solid #e0d8cc", borderRadius: 4, padding: "0 0.45rem", color: "#8a7a65", background: "#faf7f2", fontSize: 11 },
  footer: { textAlign: "center", padding: "2rem", fontSize: 13, color: "#8a7a65", borderTop: "1px solid #e0d8cc" }
};

function TripCard({ trip, index }) {
  const preview = trip.cities.slice(0, 8);
  const extra = trip.cities.length - 8;

  return (
    <Link href={getTripHref(index)} style={styles.card} className="trip-card">
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
    </Link>
  );
}

function HeroHeader() {
  return (
    <div style={styles.hero}>
      <div style={styles.heroPattern} />
      <div style={styles.heroInner}>
        <h1 style={styles.heroTitle}>
          <Link href="/" style={styles.heroTitleLink}>
            Super<em style={styles.heroTitleEm}>Trips</em>
          </Link>
        </h1>
        <p style={styles.heroSub}>
          My routes across India, city by city. Kept for memory — sharing it with anyone planning to backpack through India.
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
  );
}

function PageHeader({ title }) {
  return (
    <>
      <HeroHeader />
      <div style={styles.breadcrumbWrap}>
        <div style={styles.breadcrumb}>
          <Link href="/" style={styles.breadcrumbHome}>SuperTrips</Link>
          <span style={styles.breadcrumbSeparator}>/</span>
          <span style={styles.breadcrumbCurrent}>{title}</span>
        </div>
      </div>
    </>
  );
}

function CityListItem({ cityCode, isLast = false }) {
  const city = CITIES[cityCode];
  if (!city) return null;
  const tags = normalizeList(city.category).slice(0, 3);

  return (
    <li style={isLast ? styles.cityListItemLast : styles.cityListItem}>
      <Link href={`/cities/${cityCode}`} style={styles.cityListLink}>
        <span>{city.city}</span>
        <span style={styles.cityListTags}>
          {tags.map(tag => (
            <span key={tag} style={styles.cityListTag}>
              {getCategoryLabel(tag)}
            </span>
          ))}
        </span>
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
        {regions.map((region, regionIndex) => {
          const regionCityCodes = sortCityCodes(region.cities);
          const stateCodes = sortStateCodes([
            ...new Set(regionCityCodes.map(cityCode => CITIES[cityCode].state)),
          ]);

          return (
            <section
              key={region.slug}
              id={`region-${region.slug}`}
              style={regionIndex === 0 ? { ...styles.indexBlock, ...styles.indexBlockFirst } : styles.indexBlock}
            >
              <h2 style={styles.indexHeading}>{region.label}</h2>

              {stateCodes.map(stateCode => {
                const stateCityCodes = sortCityCodes(
                  regionCityCodes.filter(cityCode => CITIES[cityCode].state === stateCode)
                );
                const stateSlug = STATES[stateCode]?.slug || stateCode;

                return (
                  <div
                    key={`${region.slug}-${stateCode}`}
                    id={`state-${stateSlug}`}
                    style={styles.indexSubBlock}
                  >
                    <h3 style={styles.indexSubheading}>{getStateLabel(stateCode)}</h3>
                    <ul style={styles.cityList}>
                      {stateCityCodes.map((cityCode, index) => (
                        <CityListItem
                          key={cityCode}
                          cityCode={cityCode}
                          isLast={index === stateCityCodes.length - 1}
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
        {categories.map((category, categoryIndex) => {
          const cityCodes = sortCityCodes(category.cities);

          return (
            <section
              key={category.slug}
              id={`category-${category.slug}`}
              style={categoryIndex === 0 ? { ...styles.indexBlock, ...styles.indexBlockFirst } : styles.indexBlock}
            >
              <h2 style={styles.indexHeading}>{category.label}</h2>
              <ul style={styles.cityList}>
                {cityCodes.map((cityCode, index) => (
                  <CityListItem
                    key={cityCode}
                    cityCode={cityCode}
                    isLast={index === cityCodes.length - 1}
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

  return <CityDetails city={city} onBack={() => navigateTo("/cities")} />;
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
          {cityCodes.map((cityCode, index) => (
            <CityListItem
              key={cityCode}
              cityCode={cityCode}
              isLast={index === cityCodes.length - 1}
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (route.name === "route") return;

    if (!route.hash) {
      window.scrollTo(0, 0);
      return;
    }

    requestAnimationFrame(() => {
      const target = document.getElementById(route.hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }, [route.path, route.hash, route.name]);

  if (route.name === "route") {
    const tripIndex = getTripIndexBySlug(route.value);

    if (tripIndex === -1) {
      return <NotFoundPage />;
    }

    const prevIdx = (tripIndex - 1 + TRIPS.length) % TRIPS.length;
    const nextIdx = (tripIndex + 1) % TRIPS.length;
    const requestedCityIndex = Number(route.state?.initialCityIndex ?? 0);
    const initialCityIndex = Math.min(
      Math.max(Number.isFinite(requestedCityIndex) ? requestedCityIndex : 0, 0),
      TRIPS[tripIndex].cities.length - 1
    );

    return (
      <div style={styles.root}>
        <TripDetails
          key={`${tripIndex}-${initialCityIndex}`}
          trip={TRIPS[tripIndex]}
          index={tripIndex}
          initialCityIndex={initialCityIndex}
          onBack={() => navigateTo("/")}
          onPrevTrip={(fromEnd = false) => {
            navigateTo(
              getTripHref(prevIdx),
              { initialCityIndex: fromEnd === true ? TRIPS[prevIdx].cities.length - 1 : 0 }
            );
          }}
          onNextTrip={() => {
            navigateTo(getTripHref(nextIdx), { initialCityIndex: 0 });
          }}
        />
      </div>
    );
  }

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

  return (
    <div style={styles.root}>
      <HeroHeader />

      <div style={styles.section}>
        {TRIPS.map((trip, i) => (
          <TripCard
            key={i}
            trip={trip}
            index={i}
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

      <footer style={styles.footer}>
        made by{' '}
        <a href="https://ahampriyanshu.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8a7a65', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#c9962a'}
          onMouseLeave={e => e.currentTarget.style.color = '#8a7a65'}
        >
          ahampriyanshu
        </a>
      </footer>
    </div>
  );
}
