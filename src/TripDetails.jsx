import { lazy, Suspense, useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { CITIES as CITIES_DATA } from './data.js';
import './TripDetails.css';
import { navigateTo } from './nav.js';
import { getFindHref } from './findRoutes.js';
import { getTripDuration } from './tripDuration.js';
import { getCityTheme, getThemeStyle } from './themes/cityThemes.js';
import usePlaceMotion from './themes/usePlaceMotion.js';
import CityScenery from './components/CityScenery.jsx';
import CityTags from './components/CityTags.jsx';
import LocalEssentials from './components/LocalEssentials.jsx';
import { CITY_LOCAL_NAMES } from './themes/cityIdentity.js';
import PlaceAtmosphere from './components/PlaceAtmosphere.jsx';
import './themes/cityThemes.css';

const TripLeafletMap = lazy(() => import('./components/TripLeafletMap.jsx'));

const CITY_ENRICHMENT = Object.values(CITIES_DATA).reduce((acc, entry) => {
  if (!acc[entry.city]) acc[entry.city] = entry;
  return acc;
}, {});

function fmt(s) {
  if (!s) return '';
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function StayFact({ label, value }) {
  return (
    <div className="td-stay-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
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

function MapPlaceholder() {
  return <div className="app-map-placeholder" aria-hidden="true" />;
}

function MapColumn({ cities = [], positions, activePosition, theme, motionPaused }) {
  const isClientReady = useClientReady();

  return (
    <div className="td-map-column">
      <div className="td-map-frame">
        {isClientReady ? (
          <Suspense fallback={<MapPlaceholder />}>
            <TripLeafletMap cities={cities} positions={positions} activePosition={activePosition} theme={theme} motionPaused={motionPaused} />
          </Suspense>
        ) : (
          <MapPlaceholder />
        )}
      </div>
    </div>
  );
}

function MapModal({
  cities = [],
  positions,
  activePosition,
  title,
  cityName,
  currentIndex,
  theme,
  motionPaused,
  onPrevCity,
  onNextCity,
  onClose,
}) {
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < cities.length - 1;
  const isClientReady = useClientReady();

  return (
    <div className="td-map-modal">
      <div className="td-map-modal-header">
        <span className="td-map-modal-title">{title}</span>
        <button className="td-map-modal-close" onClick={onClose} aria-label="Close map">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="td-map-modal-body">
        {isClientReady ? (
          <Suspense fallback={<MapPlaceholder />}>
            <TripLeafletMap cities={cities} positions={positions} activePosition={activePosition} theme={theme} motionPaused={motionPaused} />
          </Suspense>
        ) : (
          <MapPlaceholder />
        )}
      </div>
      <div className="td-map-modal-footer">
        <button
          className="td-map-modal-nav"
          onClick={onPrevCity}
          disabled={!canGoPrev}
          aria-label="Previous city"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="td-map-modal-city">{cityName}</span>
        <button
          className="td-map-modal-nav"
          onClick={onNextCity}
          disabled={!canGoNext}
          aria-label="Next city"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function DetailColumn({ city, cityIndex, total, onOpenMap, motion }) {
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState({ city, cityIndex });
  const scrollRef = useRef(null);
  const pausedRef = useRef(motion.paused);
  useEffect(() => { pausedRef.current = motion.paused; }, [motion.paused]);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 0);
    const show = setTimeout(() => {
      setDisplayed({ city, cityIndex });
      scrollRef.current?.scrollTo({ top: 0 });
      setVisible(true);
    }, pausedRef.current ? 0 : 150);
    return () => { clearTimeout(hide); clearTimeout(show); };
  }, [city, cityIndex]);

  const { city: c, cityIndex: ci } = displayed;
  const theme = getCityTheme(c);
  const localName = CITY_LOCAL_NAMES[theme.id];
  const data = c ? CITY_ENRICHMENT[c.city] : null;
  const notes = Array.isArray(data?.notes)
    ? data.notes.map(note => String(note).trim()).filter(Boolean)
    : [];

  return (
    <div ref={scrollRef} data-detail-scroll="" className="td-detail-scroll" style={{ opacity: visible ? 1 : 0 }}>
      <div className="td-detail-inner">

        {onOpenMap && (
          <div className="place-toolbar td-mobile-only">
            <button className="td-map-widget td-mobile-only" onClick={onOpenMap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              View on map
            </button>
          </div>
        )}

        <div className="place-heading">
          <div className="td-city-title-row">
            <h1 className="td-city-title">{c?.city}</h1>
            {localName && <span className="place-native-name" lang={localName.lang} dir={localName.dir} aria-hidden="true">{localName.text}</span>}
          </div>
          {data && (
            <div className="td-city-meta">
              <a href={getFindHref('state', data.state)} onClick={e => { e.preventDefault(); navigateTo(getFindHref('state', data.state)); }}>
                {fmt(data.state)}
              </a>
              {' '}&middot;{' '}
              <a href={getFindHref('region', data.region)} onClick={e => { e.preventDefault(); navigateTo(getFindHref('region', data.region)); }}>
                {fmt(data.region)}
              </a>
            </div>
          )}
        </div>

        <CityTags city={data || c} theme={theme} />

        <CityScenery theme={theme} animated />

        {(c?.dur || data?.ideal_stay || data?.ideal_season) && (
          <dl className="td-stay-facts">
            {c?.dur && <StayFact label="My stay" value={c.dur} />}
            {data?.ideal_stay && <StayFact label="Ideal stay" value={data.ideal_stay} />}
            {data?.ideal_season && <StayFact label="Ideal time" value={fmt(data.ideal_season)} />}
          </dl>
        )}

        <LocalEssentials city={data} />

        {data?.must_visit?.length > 0 && (
          <section className="td-journal-section" aria-labelledby="td-visit-heading">
            <h2 id="td-visit-heading" className="td-section-label">Must Visit</h2>
            <ul className="td-journal-list td-places-list" role="list">
              {data.must_visit.slice(0, 6).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        {data?.must_try?.length > 0 && (
          <section className="td-journal-section" aria-labelledby="td-try-heading">
            <h2 id="td-try-heading" className="td-section-label">Must Try</h2>
            <ul className="td-journal-list" role="list">
              {data.must_try.slice(0, 6).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        {notes.length > 0 && (
          <section className="td-journal-section" aria-labelledby="td-notes-heading">
            <h2 id="td-notes-heading" className="td-section-label">My Notes</h2>
            <ul className="td-journal-list td-notes-list" role="list">
              {notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </section>
        )}

        {!data && <div className="td-fallback">City {ci + 1} of {total}</div>}
      </div>
    </div>
  );
}

function FooterTape({ cities, currentIndex, onPrev, onNext }) {
  const tapeRef = useRef(null);
  const cityRefs = useRef([]);

  useEffect(() => {
    const tape = tapeRef.current;
    const activeEl = cityRefs.current[currentIndex];
    if (!tape || !activeEl) return;
    const container = tape.parentElement;
    const containerWidth = container.offsetWidth;
    const offset = activeEl.offsetLeft - containerWidth / 2 + activeEl.offsetWidth / 2;
    tape.style.transform = `translateX(${-offset}px)`;
  }, [currentIndex]);

  return (
    <div className="td-footer-tape">
      <div className="td-tape-window">
        <div className="td-tape-fade-left" />
        <div className="td-tape-fade-right" />
        <div ref={tapeRef} className="td-tape-track">
          {cities.map((city, i) => {
            const dist = Math.abs(i - currentIndex);
            const isActive = dist === 0;
            return (
              <span
                key={i}
                ref={el => cityRefs.current[i] = el}
                className="td-tape-city"
                style={{
                  fontSize: isActive ? 22 : dist === 1 ? 14 : dist === 2 ? 11 : 9,
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: 'var(--font-brand)',
                  fontStyle: 'normal',
                  color: 'var(--td-paper)',
                  opacity: isActive ? 1 : dist === 1 ? 0.7 : dist === 2 ? 0.45 : 0.25,
                  letterSpacing: isActive ? 0.2 : 0.1,
                }}
              >
                {city.city}
              </span>
            );
          })}
        </div>
      </div>

      <div className="td-divider" />

      <div className="td-footer-controls">
        <button aria-label="Previous stop" onClick={onPrev} className="td-icon-btn-padded" style={{ opacity: currentIndex === 0 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-footer-counter">
          <span className="td-footer-counter-current">{currentIndex + 1}</span>
          <span className="td-footer-counter-slash">/</span>
          <span className="td-footer-counter-total">{cities.length}</span>
        </div>
        <button aria-label="Next stop" onClick={onNext} className="td-icon-btn-padded" style={{ opacity: currentIndex === cities.length - 1 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export function CityDetails({ city, onBack }) {
  const position = city?.lat && city?.lng ? [city.lat, city.lng] : null;
  const theme = getCityTheme(city);
  const motion = usePlaceMotion();
  return (
    <div className="td-root td-themed" style={getThemeStyle(theme)} data-place={theme.scene} data-motion={motion.paused ? 'paused' : 'running'}>
      <PlaceAtmosphere theme={theme} />
      <div className="td-topbar">
        <button aria-label="Back to index" onClick={onBack} className="td-icon-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-divider" />
        <div className="td-title-block">
          <div className="td-trip-title">{city.city}</div>
          <div className="td-trip-meta">{fmt(city.state)} · {fmt(city.region)}</div>
        </div>
      </div>
      <div className="td-main">
        <MapColumn cities={[city]} positions={position ? [position] : []} activePosition={position} theme={theme} motionPaused={motion.paused} />
        <DetailColumn city={city} cityIndex={0} total={1} motion={motion} />
      </div>
    </div>
  );
}

export default function TripDetails({ trip, index, initialCityIndex = 0, onBack, onPrevTrip, onNextTrip }) {
  const [currentIndex, setCurrentIndex] = useState(initialCityIndex);
  const [mapOpen, setMapOpen] = useState(false);

  const cities = trip.cities;
  const activeCity = cities[currentIndex];
  const theme = getCityTheme(activeCity);
  const motion = usePlaceMotion();
  const totalDuration = getTripDuration(cities);

  const currentIndexRef = useRef(initialCityIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const prevTripRef = useRef(onPrevTrip);
  const nextTripRef = useRef(onNextTrip);
  useEffect(() => { prevTripRef.current = onPrevTrip; }, [onPrevTrip]);
  useEffect(() => { nextTripRef.current = onNextTrip; }, [onNextTrip]);

  const advance = useCallback((dir) => {
    const next = currentIndexRef.current + dir;
    if (next < 0) { prevTripRef.current(true); return; }
    if (next >= cities.length) { nextTripRef.current(); return; }
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, [cities.length]);

  const moveCity = useCallback((dir) => {
    const next = currentIndexRef.current + dir;
    if (next < 0 || next >= cities.length) return;
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, [cities.length]);

  useEffect(() => {
    let acc = 0;
    let idleTimer = null;
    const THRESHOLD = 400;

    const onWheel = (e) => {
      const detailScroll = e.target.closest?.('[data-detail-scroll]');

      if (detailScroll) {
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const maxScrollTop = detailScroll.scrollHeight - detailScroll.clientHeight;
        const canScrollDown = detailScroll.scrollTop < maxScrollTop - 1;
        const canScrollUp = detailScroll.scrollTop > 1;

        if ((scrollingDown && canScrollDown) || (scrollingUp && canScrollUp)) {
          return;
        }
      }

      e.preventDefault();
      acc += e.deltaY;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { acc = 0; }, 200);
      while (Math.abs(acc) >= THRESHOLD) {
        advance(acc > 0 ? 1 : -1);
        acc -= acc > 0 ? THRESHOLD : -THRESHOLD;
      }
    };

    let touchScrollStart = null;
    const onTouchStart = (e) => {
      const detailScroll = e.target.closest?.('[data-detail-scroll]');
      const touch = e.touches?.[0];
      if (!detailScroll || !touch) {
        touchScrollStart = null;
        return;
      }

      const maxScrollTop = detailScroll.scrollHeight - detailScroll.clientHeight;
      touchScrollStart = {
        x: touch.clientX,
        y: touch.clientY,
        t: Date.now(),
        atTop: detailScroll.scrollTop <= 1,
        atBottom: detailScroll.scrollTop >= maxScrollTop - 1,
      };
    };
    const onTouchEnd = (e) => {
      if (!touchScrollStart) return;
      const touch = e.changedTouches?.[0];
      if (!touch) return;

      const dx = touch.clientX - touchScrollStart.x;
      const dy = touch.clientY - touchScrollStart.y;
      const dt = Date.now() - touchScrollStart.t;
      const isVerticalSwipe = dt < 900 && Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx) * 1.5;
      const startedAtTop = touchScrollStart.atTop;
      const startedAtBottom = touchScrollStart.atBottom;
      touchScrollStart = null;

      if (!isVerticalSwipe) return;
      if (dy > 0 && startedAtTop) advance(-1);
      if (dy < 0 && startedAtBottom) advance(1);
    };
    const onTouchCancel = () => { touchScrollStart = null; };

    let swipeStart = null;
    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      swipeStart = {
        x: e.clientX,
        y: e.clientY,
        t: Date.now(),
        inMapModal: Boolean(e.target.closest?.('.td-map-modal')),
        inDesktopMap: Boolean(e.target.closest?.('.td-map-column')),
      };
    };
    const onPointerUp = (e) => {
      if (!swipeStart) return;
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      const dt = Date.now() - swipeStart.t;
      const inMapModal = swipeStart.inMapModal;
      const inDesktopMap = swipeStart.inDesktopMap;
      swipeStart = null;
      if (dt < 500 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (inMapModal) {
          return;
        }

        if (inDesktopMap) {
          advance(dx > 0 ? -1 : 1);
          return;
        }

        dx > 0 ? prevTripRef.current() : nextTripRef.current();
      }
    };
    const onPointerCancel = () => { swipeStart = null; };
    const onKey = (e) => {
      if (e.key === 'ArrowDown')  advance(1);
      if (e.key === 'ArrowUp')    advance(-1);
      if (e.key === 'ArrowRight') nextTripRef.current();
      if (e.key === 'ArrowLeft')  prevTripRef.current();
    };

    document.addEventListener('wheel',         onWheel,       { passive: false });
    document.addEventListener('touchstart',    onTouchStart,  { passive: true });
    document.addEventListener('touchend',      onTouchEnd,    { passive: true });
    document.addEventListener('touchcancel',   onTouchCancel);
    document.addEventListener('pointerdown',   onPointerDown);
    document.addEventListener('pointerup',     onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('keydown',       onKey);

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('wheel',         onWheel);
      document.removeEventListener('touchstart',    onTouchStart);
      document.removeEventListener('touchend',      onTouchEnd);
      document.removeEventListener('touchcancel',   onTouchCancel);
      document.removeEventListener('pointerdown',   onPointerDown);
      document.removeEventListener('pointerup',     onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('keydown',       onKey);
    };
  }, [advance]);

  return (
    <div className="td-root td-themed" style={getThemeStyle(theme)} data-place={theme.scene} data-motion={motion.paused ? 'paused' : 'running'}>
      <PlaceAtmosphere theme={theme} />
      <div className="td-topbar">

        <button aria-label="Back to index" onClick={onBack} className="td-icon-btn td-desktop-only">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="td-divider td-desktop-only" />

        <div className="td-title-block td-desktop-only">
          <div className="td-trip-title">{trip.name}</div>
          <div className="td-trip-meta">{totalDuration} · {cities.length} stops · {trip.distanceKm.toLocaleString()} km</div>
        </div>

        <button aria-label="Back to index" onClick={onBack} className="td-icon-btn td-mobile-back">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="td-title-block td-mobile-only">
          <div className="td-trip-title">{trip.name}</div>
          <div className="td-trip-meta">{currentIndex + 1} of {cities.length}</div>
        </div>

        <div className="td-trip-switcher td-desktop-only">
          <button aria-label="Previous trip" onClick={onPrevTrip} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="td-trip-number">Supertrip {String(index + 1).padStart(2, '0')}</div>
          <button aria-label="Next trip" onClick={onNextTrip} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="td-trip-switcher td-mobile-only">
          <button aria-label="Previous stop" onClick={() => advance(-1)} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button aria-label="Next stop" onClick={() => advance(1)} className="td-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="td-main">
        <MapColumn
          cities={cities}
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
          theme={theme}
          motionPaused={motion.paused}
        />
        <DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} motion={motion} onOpenMap={() => setMapOpen(true)} />
      </div>

      <FooterTape cities={cities} currentIndex={currentIndex} onPrev={() => advance(-1)} onNext={() => advance(1)} />

      {mapOpen && (
        <MapModal
          cities={cities}
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
          theme={theme}
          motionPaused={motion.paused}
          title={trip.name}
          cityName={activeCity?.city}
          currentIndex={currentIndex}
          onPrevCity={() => moveCity(-1)}
          onNextCity={() => moveCity(1)}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
}
