import { useEffect, useState, useSyncExternalStore } from "react";
import "./App.css";
import "./Home.css";

import TripDetails, { CityDetails } from "./TripDetails";
import { BACKPACKING_101, CITIES, TRIPS } from "./data.js";
import { navigateTo } from "./nav.js";
import RouteAtlas from "./components/RouteAtlas.jsx";
import CityScenery from "./components/CityScenery.jsx";
import JourneyFood from "./components/JourneyFood.jsx";
import JournalSelect from "./components/JournalSelect.jsx";
import BrandLogo from "./components/BrandLogo.jsx";
import { getCityTheme, getThemeStyle } from "./themes/cityThemes.js";
import { CITY_LOCAL_NAMES } from "./themes/cityIdentity.js";
import { JOURNEY_FOOD } from "./themes/journeyFood.js";
import { CITY_COLLECTION_VIEWS, getCityCollection } from "./cityCollection.js";
import { getTripDuration } from "./tripDuration.js";

import { getFindHref, getFindSelection, getLegacyFindHref } from "./findRoutes.js";

const journeyCities = TRIPS.flatMap(trip => trip.cities);
const journeyStats = [
  [TRIPS.length, 'journeys'],
  [new Set(journeyCities.map(city => city.state)).size, 'states & UTs'],
  [new Set(journeyCities.map(city => city.code)).size, 'cities'],
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
  return `/supertrips/${tripSlugs[index]}`;
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
    search: typeof window === "undefined" ? "" : window.location.search,
    state: typeof window === "undefined" ? null : window.history.state,
  };
}

function getInitialRoute(path, hash = "", state = null) {
  return {
    ...parseRoute(path || "/"),
    hash,
    search: "",
    state,
  };
}

function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { name: "home", path: "/" };
  if (parts.length === 1 && parts[0] === "supertrips") {
    return { name: "supertrips", path: "/supertrips" };
  }
  if (parts.length === 2 && ["supertrips", "routes"].includes(parts[0])) {
    return { name: "route", path: pathname, value: parts[1] };
  }
  if (parts.length === 1 && parts[0] === "find") {
    return { name: "find", path: "/find" };
  }
  const redirect = getLegacyFindHref(pathname);
  if (redirect) return { name: "find", path: pathname, redirect };
  if (parts.length === 2 && parts[0] === "cities") {
    return { name: "city", path: pathname, value: parts[1] };
  }

  return { name: "not-found", path: pathname };
}

function useCurrentRoute(initialRoute) {
  const [route, setRoute] = useState(() => initialRoute || getCurrentRoute());

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

function useClientReady() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const frame = requestAnimationFrame(onStoreChange);
      return () => cancelAnimationFrame(frame);
    },
    () => true,
    () => false
  );
}

function Link({ href, state, className, children, ...props }) {
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
        navigateTo(href, state);
      }}
    >
      {children}
    </a>
  );
}

function TripCard({ trip, index, previewCount = 8 }) {
  const preview = trip.cities.slice(0, previewCount);
  const extra = trip.cities.length - preview.length;
  const food = JOURNEY_FOOD[trip.name];
  const theme = getCityTheme(CITIES[food.city]);

  return (
    <Link href={getTripHref(index)} className="app-card" style={{ ...getThemeStyle(theme), '--food-paper': food.paper }}>
      <div className="app-route-art" aria-hidden="true"><JourneyFood art={food} /></div>
      <div className="app-card-body">
        <div className="app-card-header">
          <div className="app-trip-name-wrap">
            <h3 className="app-trip-name">{trip.name}</h3>
            <div className="app-trip-meta">
              {getTripDuration(trip.cities)} <span aria-hidden="true">·</span> {trip.cities.length} stops <span aria-hidden="true">·</span> {trip.distanceKm.toLocaleString('en-IN')} km
            </div>
          </div>
        </div>

        <div className="app-route-strip">
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
      </div>
    </Link>
  );
}

function Masthead() {
  return (
    <header className="app-masthead">
      <Link href="/" className="app-wordmark" aria-label="SuperTrips home"><BrandLogo /></Link>
      <span className="app-masthead-note">A personal travel journal</span>
      <nav className="app-nav" aria-label="Main navigation">
        <Link href="/#routes">Routes</Link>
        <Link href="/find">Find a city</Link>
        <Link href="/#field-notes">Field notes</Link>
      </nav>
    </header>
  );
}

function HeroHeader() {
  const isClientReady = useClientReady();
  return (
    <section className="app-hero" aria-labelledby="journal-title">
      <div className="app-hero-inner">
        <h1 id="journal-title" className="app-hero-title">
          <BrandLogo showMark={false} />
        </h1>
        <p className="app-hero-sub">
          My routes across India, city by city. Kept for the memories,
          shared for anyone planning to backpack through it.
        </p>
      </div>
      <RouteAtlas interactive={isClientReady} mobilePageScroll />
    </section>
  );
}

function PageHeader({ title }) {
  return (
    <>
      <Masthead />
      <div className="app-breadcrumb-wrap">
        <div className="app-breadcrumb">
          <Link href="/" className="app-breadcrumb-home">SuperTrips</Link>
          <span className="app-breadcrumb-separator">/</span>
          <span className="app-breadcrumb-current">{title}</span>
        </div>
      </div>
      <div className="app-page-title"><p className="app-eyebrow">The place index</p><h1>{title}</h1></div>
    </>
  );
}

function FindPage({ search, hash }) {
  const [mapOpen, setMapOpen] = useState(false);
  const isClientReady = useClientReady();
  // Static HTML always starts with all cities; apply the URL after hydration.
  const collection = getFindSelection(isClientReady ? search : '', isClientReady ? hash : '');

  return (
    <div className="app-root app-find-page">
      <nav className="app-breadcrumb-wrap" aria-label="Breadcrumb">
        <div className="app-breadcrumb">
          <Link href="/" className="app-breadcrumb-home">Home</Link>
          <span className="app-breadcrumb-separator" aria-hidden="true">/</span>
          <span className="app-breadcrumb-current" aria-current="page">Find</span>
        </div>
      </nav>
      <main>
        <CityCollection page collection={collection}
          onCollectionChange={({ groupBy, selectedGroup }) => navigateTo(getFindHref(groupBy, selectedGroup))}>
          <details className="app-collection-map" onToggle={event => setMapOpen(event.currentTarget.open)}>
            <summary>Explore on the map</summary>
            <RouteAtlas interactive={mapOpen} />
          </details>
        </CityCollection>
      </main>
      <JournalFooter />
    </div>
  );
}

function CityPage({ cityCode, fromFind }) {
  const city = CITIES[cityCode];

  if (!city) {
    return <NotFoundPage />;
  }

  return <CityDetails city={city} onBack={() => navigateTo(fromFind?.match(/^\/find(?:[?#]|$)/) ? fromFind : "/find")} />;
}

function NotFoundPage() {
  return (
    <div className="app-root">
      <PageHeader title="Not found" />
    </div>
  );
}

function CityCollection({ page = false, collection, onCollectionChange, children }) {
  const [localCollection, setLocalCollection] = useState({ groupBy: 'state', selectedGroup: 'all' });
  const { groupBy, selectedGroup } = collection || localCollection;
  const setCollection = onCollectionChange || setLocalCollection;
  const { view, groups, cityCount } = getCityCollection(groupBy, selectedGroup);
  const prefix = page ? 'find' : 'home';
  const Heading = page ? 'h1' : 'h2';
  const GroupHeading = page ? 'h2' : 'h3';

  return (
    <section id="places" className="app-city-collection" aria-labelledby="city-collection-title">
      <div className="app-city-collection-heading">
        <div className="app-section-intro">
          <Heading id="city-collection-title">Find your next stop.</Heading>
        </div>
        <div className="app-collection-controls">
          <JournalSelect id={`${prefix}-group-by`} label="Group by" value={groupBy}
            options={Object.entries(CITY_COLLECTION_VIEWS).map(([key, option]) => ({ value: key, label: option.label }))}
            onChange={next => setCollection({ groupBy: next, selectedGroup: 'all' })} />
          <JournalSelect key={groupBy} id={`${prefix}-group-filter`} label={view.filterLabel} value={selectedGroup}
            options={[{ value: 'all', label: view.allLabel }, ...view.groups.map(group => ({ value: group.slug, label: group.label }))]}
            onChange={next => setCollection({ groupBy, selectedGroup: next })} />
          <p className="app-collection-count" role="status" aria-atomic="true">{cityCount} {cityCount === 1 ? 'city' : 'cities'}{selectedGroup === 'all' ? ` across ${view.groups.length} ${view.plural}` : ` · ${groups[0].label}`}</p>
        </div>
      </div>

      {children}

      <div id={`${prefix}-city-groups`}>
        {groups.map(group => (
          <section key={`${groupBy}-${group.slug}`} id={page ? `${groupBy}-${group.slug}` : undefined} className="app-city-group" aria-labelledby={`${prefix}-${groupBy}-${group.slug}`}>
            <div className="app-city-group-heading">
              <GroupHeading id={`${prefix}-${groupBy}-${group.slug}`}>{group.label}</GroupHeading>
            </div>
            <ul className="app-city-postcards">
              {group.cities.map(code => {
                const city = CITIES[code];
                const theme = getCityTheme(city);
                const localName = CITY_LOCAL_NAMES[code];
                return (
                  <li key={code} className="app-city-postcard" style={getThemeStyle(theme)}>
                    <Link href={`/cities/${code}`} state={page ? { fromFind: getFindHref(groupBy, selectedGroup) } : null} className="app-city-postcard-link">
                      <div className="app-city-postcard-art" aria-hidden="true">
                        <div className="app-city-postcard-lettering">
                          <span className="place-native-name" lang={localName.lang} dir={localName.dir}>{localName.text}</span>
                        </div>
                        <CityScenery theme={theme} />
                      </div>
                      <span className="app-city-postcard-name">{city.city}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function BackpackingSection() {
  return (
    <div className="app-notebook-band"><section id="field-notes" className="app-backpacking-section">
      <div className="app-section-intro">
        <h2 className="app-backpacking-title">Backpacking 101</h2>
        <p className="app-backpacking-intro">
          A few things I learned during my backpacking days.
        </p>
      </div>

      <div className="app-backpacking-grid">
        {BACKPACKING_101.map(({ title, tips }) => (
          <div key={title} className="app-backpacking-card">
            <h3 className="app-backpacking-card-title">{title}</h3>
            <ul className="app-backpacking-list">
              {tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section></div>
  );
}

function JournalFooter() {
  return (
    <footer className="app-footer">
      <span>made by{' '}
        <a href="https://ahampriyanshu.com" target="_blank" rel="noopener noreferrer" className="app-footer-link">
          ahampriyanshu
        </a>
      </span>
      <span className="app-footer-note">India, city by city.</span>
    </footer>
  );
}

export default function App({ initialPath, initialHash = "", initialState = null } = {}) {
  const route = useCurrentRoute(
    initialPath ? getInitialRoute(initialPath, initialHash, initialState) : null
  );

  useEffect(() => {
    if (!route.redirect) return;
    const destination = getLegacyFindHref(route.path, route.search, route.hash);
    window.history.replaceState(window.history.state, "", destination);
    window.dispatchEvent(new Event("popstate"));
  }, [route.redirect, route.path, route.search, route.hash]);

  useEffect(() => {
    if (route.name !== "route" || !route.path.startsWith("/routes/")) return;
    const index = getTripIndexBySlug(route.value);
    if (index === -1) return;
    window.history.replaceState(window.history.state, "", `${getTripHref(index)}${window.location.search}${window.location.hash}`);
    window.dispatchEvent(new Event("popstate"));
  }, [route.name, route.path, route.value]);
  const tripCardPreviewCount = 8;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (route.name === "route") return;

    if (!route.hash) {
      window.scrollTo(0, 0);
      return;
    }

    requestAnimationFrame(() => {
      const targetId = route.hash.slice(1);
      const target = document.getElementById(targetId) || document.getElementById(targetId.replace(/_/g, '-'));
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

  if (route.name === "find") {
    return <FindPage search={route.search} hash={route.hash} />;
  }

  if (route.name === "city") {
    return <CityPage cityCode={route.value} fromFind={route.state?.fromFind} />;
  }

  if (route.name === "not-found") {
    return <NotFoundPage />;
  }

  return (
    <div className="app-root app-home">
      <HeroHeader />

      <main>
        <section id="routes" className="app-section" aria-labelledby="journeys-title">
          <div className="app-journey-heading">
            <h2 id="journeys-title"><s>Off</s> On the road</h2>
            <ul className="app-journey-stats" aria-label="Journey collection in numbers">
              {journeyStats.map(([count, label]) => (
                <li key={label}><span>{count}</span>{' '}{label}</li>
              ))}
            </ul>
          </div>
          <div className="app-trip-list">
            {TRIPS.map((trip, i) => (
              <TripCard
                key={i}
                trip={trip}
                index={i}
                previewCount={tripCardPreviewCount}
              />
            ))}
          </div>
        </section>

        <CityCollection />

        <BackpackingSection />

      </main>

      <JournalFooter />
    </div>
  );
}
