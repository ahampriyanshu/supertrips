import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup } from "react-leaflet";
import "./App.css";

import TripDetails, { CityDetails } from "./TripDetails";
import { ACCOMMODATIONS, BACKPACKING_101, CATEGORIES, CITIES, REGIONS, STATES, TRIPS } from "./data.js";
import MapTileLayer from "./components/MapTileLayer.jsx";
import { navigateTo } from "./nav.js";


const totalCities = new Set(TRIPS.flatMap(t => t.cities.map(c => c.city))).size;
const totalStops = TRIPS.reduce((a, t) => a + t.cities.length, 0);

function toDirectoryItems(groups, basePath, hashPrefix) {
  return Object.values(groups).map(({ label, slug, cities }) => ({
    label,
    href: `/${basePath}#${hashPrefix ? `${hashPrefix}-` : ""}${slug}`,
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
  {
    title: "By stay",
    items: toDirectoryItems(
      Object.fromEntries(Object.entries(ACCOMMODATIONS).filter(([key]) => key !== "budget_hotels")),
      "stay",
      ""
    ),
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
  if (parts.length === 1 && parts[0] === "stay") {
    return { name: "stay", path: "/stay" };
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

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  ));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function Link({ href, className, children, ...props }) {
  return (
    <a
      {...props}
      href={href}
      className={className}
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

function getGroupBySlug(groups, slug) {
  return Object.entries(groups).find(([key, group]) => group.slug === slug || key === slug)?.[1];
}

function getStateLabel(stateCode) {
  return STATES[stateCode]?.label || formatParam(stateCode || "");
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

function getCityPosition(city) {
  const lat = Number(city?.lat);
  const lng = Number(city?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return [lat, lng];
}

const cityMapMarkerOptions = {
  color: "#1a1208",
  fillColor: "#c9962a",
  fillOpacity: 0.82,
  opacity: 0.9,
  weight: 1.2,
};

function CitiesMap({ cityCodes, label = "Map of all cities" }) {
  const cities = cityCodes
    .map(cityCode => ({ cityCode, city: CITIES[cityCode], position: getCityPosition(CITIES[cityCode]) }))
    .filter(item => item.city && item.position);

  return (
    <section className="app-cities-map-section" aria-label={label}>
      <div className="app-cities-map-frame td-map-frame">
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
                    <Link href={`/cities/${cityCode}`} className="app-map-popup-title">
                      {city.city}
                    </Link>
                    <div className="app-map-popup-meta">
                      {getStateLabel(city.state)} · {formatParam(city.region)}
                    </div>

                    {categories.length > 0 && (
                      <div className="app-map-popup-group">
                        <div className="app-map-popup-label">Categories</div>
                        <div className="app-map-popup-chips">
                          {categories.map(category => (
                            <Link
                              key={category}
                              href={`/categories#category-${CATEGORIES[category]?.slug || category}`}
                              className="app-map-popup-chip"
                            >
                              {getCategoryLabel(category)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {accommodation.length > 0 && (
                      <div className="app-map-popup-group">
                        <div className="app-map-popup-label">Stay</div>
                        <div className="app-map-popup-chips">
                          {accommodation.map(stay => (
                            <Link
                              key={stay}
                              href={`/stay#${getAccommodationSlug(stay)}`}
                              className="app-map-popup-chip"
                            >
                              {getAccommodationLabel(stay)}
                            </Link>
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
      </div>
    </section>
  );
}

function TripCard({ trip, index, previewCount = 8 }) {
  const preview = trip.cities.slice(0, previewCount);
  const extra = trip.cities.length - preview.length;

  return (
    <Link href={getTripHref(index)} className="app-card trip-card">
      <div className="app-card-header">
        <div className="app-trip-num">{String(index + 1).padStart(2, "0")}</div>
        <div className="app-trip-name-wrap">
          <div className="app-trip-name">{trip.name}</div>
          <div className="app-trip-meta">{trip.cities.length} stops</div>
        </div>
      </div>

      <div className="app-route-strip hide-scroll">
        {preview.map((c, i) => (
          <span key={i} className="app-route-city-wrap">
            <span className="app-route-city">{c.city}</span>
            {i < preview.length - 1 && <span className="app-route-dot" />}
          </span>
        ))}
        {extra > 0 && (
          <span className="app-route-city-wrap app-route-city-wrap--extra">
            <span className="app-route-city--extra">+{extra} more</span>
          </span>
        )}
      </div>
    </Link>
  );
}

function HeroHeader() {
  return (
    <div className="app-hero">
      <div className="app-hero-pattern" />
      <div className="app-hero-inner">
        <h1 className="app-hero-title">
          <Link href="/" className="app-hero-title-link">
            Super<em className="app-hero-title-em">Trips</em>
          </Link>
        </h1>
        <p className="app-hero-sub">
          My routes across India, city by city. Kept for memory, sharing it with anyone planning to backpack through India.
        </p>
        <div className="app-hero-stats">
          {[
            ["10", "Trips"],
            [totalCities, "Cities"],
            [totalStops, "Total stops"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="app-hero-stat-n">{n}</div>
              <div className="app-hero-stat-l">{l}</div>
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
      <div className="app-breadcrumb-wrap">
        <div className="app-breadcrumb">
          <Link href="/" className="app-breadcrumb-home">SuperTrips</Link>
          <span className="app-breadcrumb-separator">/</span>
          <span className="app-breadcrumb-current">{title}</span>
        </div>
      </div>
    </>
  );
}

function CityListItem({ cityCode, isLast = false }) {
  const city = CITIES[cityCode];
  if (!city) return null;
  const tags = normalizeList(city.category).slice(0, 2);

  return (
    <li className={isLast ? "app-city-list-item app-city-list-item--last" : "app-city-list-item"}>
      <Link href={`/cities/${cityCode}`} className="app-city-list-link">
        <span>{city.city}</span>
        <span className="app-city-list-tags">
          {tags.map(tag => (
            <span key={tag} className="app-city-list-tag">
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
  const allCityCodes = sortCityCodes(Object.keys(CITIES));

  return (
    <div className="app-root">
      <PageHeader title="Cities" />

      <CitiesMap cityCodes={allCityCodes} />

      <main className="app-page-content">
        {regions.map((region, regionIndex) => {
          const regionCityCodes = sortCityCodes(region.cities);
          const stateCodes = sortStateCodes([
            ...new Set(regionCityCodes.map(cityCode => CITIES[cityCode].state)),
          ]);

          return (
            <section
              key={region.slug}
              id={`region-${region.slug}`}
              className={regionIndex === 0 ? "app-index-block app-index-block--first" : "app-index-block"}
            >
              <h2 className="app-index-heading">{region.label}</h2>

              {stateCodes.map(stateCode => {
                const stateCityCodes = sortCityCodes(
                  regionCityCodes.filter(cityCode => CITIES[cityCode].state === stateCode)
                );
                const stateSlug = STATES[stateCode]?.slug || stateCode;

                return (
                  <div
                    key={`${region.slug}-${stateCode}`}
                    id={`state-${stateSlug}`}
                    className="app-index-sub-block"
                  >
                    <h3 className="app-index-subheading">{getStateLabel(stateCode)}</h3>
                    <ul className="app-city-list">
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
  const categoryCityCodes = sortCityCodes([
    ...new Set(categories.flatMap(category => category.cities)),
  ]);

  return (
    <div className="app-root">
      <PageHeader title="Categories" />

      <CitiesMap cityCodes={categoryCityCodes} label="Map of cities by category" />

      <main className="app-page-content">
        {categories.map((category, categoryIndex) => {
          const cityCodes = sortCityCodes(category.cities);

          return (
            <section
              key={category.slug}
              id={`category-${category.slug}`}
              className={categoryIndex === 0 ? "app-index-block app-index-block--first" : "app-index-block"}
            >
              <h2 className="app-index-heading">{category.label}</h2>
              <ul className="app-city-list">
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

function StayIndexPage() {
  const stayGroups = Object.values(ACCOMMODATIONS);

  return (
    <div className="app-root">
      <PageHeader title="Stay" />

      <main className="app-page-content">
        {stayGroups.map((stay, stayIndex) => {
          const cityCodes = sortCityCodes(stay.cities);

          return (
            <section
              key={stay.slug}
              id={stay.slug}
              className={stayIndex === 0 ? "app-index-block app-index-block--first" : "app-index-block"}
            >
              <h2 className="app-index-heading">{stay.label}</h2>
              <ul className="app-city-list">
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

  return (
    <div className="app-root">
      <PageHeader title={group.label} />

      <main className="app-page-content">
        <ul className="app-city-list">
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
    <div className="app-root">
      <PageHeader title="Not found" />
    </div>
  );
}

function BackpackingSection() {
  return (
    <section className="app-backpacking-section">
      <h2 className="app-backpacking-title">Backpacking 101</h2>
      <p className="app-backpacking-intro">
        Few things I learned after and during my backpacking days.
      </p>

      <div className="app-backpacking-grid">
        {BACKPACKING_101.map(({ title, tips }) => (
          <div key={title} className="app-backpacking-card">
            <div className="app-backpacking-card-title">{title}</div>
            <ul className="app-backpacking-list">
              {tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const route = useCurrentRoute();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const tripCardPreviewCount = isMobile ? 3 : 8;

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
      <div className="app-root">
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

  if (route.name === "stay") {
    return <StayIndexPage />;
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
    <div className="app-root">
      <HeroHeader />

      <div className="app-section">
        {TRIPS.map((trip, i) => (
          <TripCard
            key={i}
            trip={trip}
            index={i}
            previewCount={tripCardPreviewCount}
          />
        ))}
      </div>

      <BackpackingSection />

      <section className="app-directory-section">
        <h2 className="app-directory-title">Plan your next itinerary</h2>
        <p className="app-directory-intro">
          Pick a region, a state, a travel style and build your own route from there.
        </p>

        {directoryGroups.map(group => (
          <div key={group.title} className="app-directory-group">
            <div className="app-directory-group-title">{group.title}</div>
            <div className="app-directory-links">
              {group.items.map(({ label, href, count }) => (
                <Link key={href} href={href} className="app-directory-link">
                  <span>{label}</span>
                  <span className="app-directory-count">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="app-footer">
        made by{' '}
        <a
          href="https://ahampriyanshu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer-link"
        >
          ahampriyanshu
        </a>
      </footer>
    </div>
  );
}
