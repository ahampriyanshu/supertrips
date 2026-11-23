import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import '../Magazine.css';
import { getMagazine } from '../magazineData.js';
import { navigateTo } from '../nav.js';

const MagazineMapModal = lazy(() => import('./MagazineMapModal.jsx'));

export default function MagazinePage({ topic = 'forts', monumentId }) {
  const magazine = getMagazine(topic);
  const entries = magazine.entries;

  // Find initial index from monumentId or default to 0
  const findInitialIndex = () => {
    if (!monumentId) return 0;
    const idx = entries.findIndex(e => e.id === monumentId || e.slug === monumentId);
    return idx >= 0 ? idx : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(findInitialIndex);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const [outgoingIndex, setOutgoingIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const lastPropMonumentIdRef = useRef(monumentId);
  const animRef = useRef(null);
  const turbulenceRef = useRef(null);
  const maskCircleRef = useRef(null);
  const incomingPlateRef = useRef(null);

  // Animated Follower Cursor Engine
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorDown, setCursorDown] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'prev' | 'next' | 'read-more' | 'view-map' | 'progress' | 'back-home'

  useEffect(() => {
    // Only active on fine-pointer devices (desktop mouse/trackpad)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animId;
    const lerp = () => {
      const target = mousePos.current;
      const cur = currentPos.current;

      cur.x += (target.x - cur.x) * 0.22;
      cur.y += (target.y - cur.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }

      animId = requestAnimationFrame(lerp);
    };

    animId = requestAnimationFrame(lerp);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!cursorVisible && !mapOpen) setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
      setCursorState('default');
    };

    const handleMouseDown = () => setCursorDown(true);
    const handleMouseUp = () => setCursorDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorVisible, mapOpen]);

  // Clean up running animation frames on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const currentEntry = entries[currentIndex] || entries[0];
  const outgoingEntry = outgoingIndex !== null ? entries[outgoingIndex] : null;

  // Harry Potter Magical Map Ink Disclosure Transition:
  // - Interruptible & zero lockout: user can navigate fluidly at any time
  // - Incoming painting is disclosed from underneath, pops up from background and occupies full screen
  // - Organic randomized origin and fractal noise seed on every transition
  const goTo = useCallback((targetIndex, dir = 1) => {
    const cur = currentIndexRef.current;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    if (targetIndex === cur) return;

    // Interrupt previous animation immediately if active
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    const previousIndex = cur;
    const targetEntry = entries[targetIndex];
    currentIndexRef.current = targetIndex;
    lastPropMonumentIdRef.current = targetEntry.slug || targetEntry.id;

    // Sync browser URL cleanly without page reload
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `/forts/${targetEntry.slug}`);
    }

    setOutgoingIndex(previousIndex);
    setCurrentIndex(targetIndex);
    setIsTransitioning(true);

    // Randomize organic origin & fractal noise seed for unique magic ink disclosure
    const rx = dir > 0 ? (44 + Math.random() * 22) : (34 + Math.random() * 22);
    const ry = 38 + Math.random() * 24;
    const randomSeed = Math.floor(Math.random() * 999) + 1;
    const randomFreq = (0.024 + Math.random() * 0.008).toFixed(4);

    if (turbulenceRef.current) {
      turbulenceRef.current.setAttribute('seed', String(randomSeed));
      turbulenceRef.current.setAttribute('baseFrequency', String(randomFreq));
    }

    if (maskCircleRef.current) {
      maskCircleRef.current.setAttribute('cx', `${rx}%`);
      maskCircleRef.current.setAttribute('cy', `${ry}%`);
      maskCircleRef.current.setAttribute('r', '0');
    }

    // Calculate exact corner geometry so the disclosure sweeps cleanly past all 4 corners
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const cx_px = (rx / 100) * w;
    const cy_px = (ry / 100) * h;

    const dTL = Math.hypot(cx_px, cy_px);
    const dTR = Math.hypot(w - cx_px, cy_px);
    const dBL = Math.hypot(cx_px, h - cy_px);
    const dBR = Math.hypot(w - cx_px, h - cy_px);
    const maxCornerDist = Math.max(dTL, dTR, dBL, dBR);

    // Target radius ensures the rough displacement boundary sweeps briskly past the furthest corner
    // without decelerating inside the viewport
    const targetRadius = maxCornerDist * 1.22 + 90;

    const duration = 480; // ms: crisp, fluid, zero stalling in last quadrant
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fast organic emergence: sweeps across the furthest corner by ~70% progress with high momentum
      const ease = 1 - Math.pow(1 - progress, 2.2);
      const currentRadius = ease * targetRadius;

      if (maskCircleRef.current) {
        maskCircleRef.current.setAttribute('r', String(currentRadius));
      }

      // Pop-up from background: rises smoothly from 0.96 scale to 1.00 full screen
      if (incomingPlateRef.current) {
        const scaleEase = 1 - Math.pow(1 - progress, 2);
        const scale = 0.96 + 0.04 * scaleEase;
        incomingPlateRef.current.style.transform = `scale(${scale})`;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Transition complete: settle into idle state
        setIsTransitioning(false);
        setOutgoingIndex(null);
        animRef.current = null;
        if (incomingPlateRef.current) {
          incomingPlateRef.current.style.transform = 'scale(1)';
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [entries, topic]);

  // Sync index if monumentId prop changes externally from parent
  useEffect(() => {
    if (monumentId && monumentId !== lastPropMonumentIdRef.current) {
      lastPropMonumentIdRef.current = monumentId;
      const idx = entries.findIndex(e => e.id === monumentId || e.slug === monumentId);
      if (idx >= 0 && idx !== currentIndexRef.current) {
        goTo(idx);
      }
    }
  }, [monumentId, entries, goTo]);

  const goNext = useCallback(() => {
    const cur = currentIndexRef.current;
    if (cur < entries.length - 1) {
      goTo(cur + 1, 1);
    }
  }, [entries.length, goTo]);

  const goPrev = useCallback(() => {
    const cur = currentIndexRef.current;
    if (cur > 0) {
      goTo(cur - 1, -1);
    }
  }, [goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Damped horizontal wheel scroll
  useEffect(() => {
    let wheelAccum = 0;
    let wheelTimeout;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        wheelAccum += e.deltaX;
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (wheelAccum > 45) {
            goNext();
            wheelAccum = 0;
          } else if (wheelAccum < -45) {
            goPrev();
            wheelAccum = 0;
          }
        }, 60);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [goNext, goPrev]);

  // Update document title for active fort
  useEffect(() => {
    if (typeof document !== 'undefined' && currentEntry) {
      document.title = `${currentEntry.monument} · Forts of India | SuperTrips`;
    }
  }, [currentEntry]);

  const themeClass = `magazine-theme-${currentEntry.theme || 'warm-stone'}`;
  const quadrantClass = `magazine-quadrant--${currentEntry.textQuadrant || 'top-left'}`;

  return (
    <article className={`magazine-page ${themeClass}`} aria-labelledby="magazine-monument-title">
      {/* Invisible Back to Home Hit Zone (Top-Left) */}
      <div
        className="magazine-back-home-zone"
        onClick={(e) => {
          e.stopPropagation();
          navigateTo('/');
        }}
        onMouseEnter={() => setCursorState('back-home')}
        onMouseLeave={() => setCursorState('default')}
        aria-label="Back to home"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateTo('/');
          }
        }}
      />

      {/* SVG Definitions for Harry Potter Magical Ink Disclosure Mask */}
      <svg
        className="magazine-magic-defs"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <defs>
          <filter
            id="mag-ink-displace"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="userSpaceOnUse"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.024"
              numOctaves="3"
              seed="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="1.5" />
          </filter>

          <mask id="mag-disclosure-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <circle
              ref={maskCircleRef}
              className="magazine-mask-circle"
              cx="50%"
              cy="50%"
              r="0"
            />
          </mask>
        </defs>
      </svg>

      {/* Full-bleed illustration stage */}
      <div className="magazine-stage" aria-hidden="true">
        {/* Outgoing Fort Painting: remains underneath until disclosed */}
        {outgoingEntry && (
          <div className="magazine-plate magazine-plate--outgoing">
            <img
              src={outgoingEntry.artworkUrl}
              alt=""
              className="magazine-painting-img"
            />
          </div>
        )}

        {/* Incoming / Active Fort Painting: pops up from background and occupies screen */}
        <div
          ref={incomingPlateRef}
          className={`magazine-plate magazine-plate--incoming ${
            isTransitioning ? 'magazine-plate--disclosing' : 'magazine-plate--settled'
          }`}
        >
          <img
            src={currentEntry.artworkUrl}
            alt={`${currentEntry.monument} in ${currentEntry.location}`}
            className="magazine-painting-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Cold-press cotton rag paper tooth ground overlay */}
        <div className="magazine-paper-tooth" />
      </div>

      {/* Editorial Content: Title, Location & 2-3 Line Description */}
      {/* Outgoing Text Block: smoothly dissolves in its original quadrant without blinking */}
      {isTransitioning && outgoingEntry && (
        <section
          key={`text-outgoing-${outgoingEntry.id}`}
          className={`magazine-quadrant-text magazine-quadrant--${outgoingEntry.textQuadrant || 'top-left'} magazine-theme-${outgoingEntry.theme || 'warm-stone'} magazine-text--outgoing`}
          aria-hidden="true"
        >
          <h1 className="magazine-title">{outgoingEntry.monument}</h1>
          <p className="magazine-location">{outgoingEntry.location}</p>
          <p className="magazine-paragraph">{outgoingEntry.paragraph}</p>
        </section>
      )}

      {/* Active / Incoming Text Block: emerges smoothly in its proper quadrant with zero flash */}
      <section
        key={`text-active-${currentEntry.id}`}
        className={`magazine-quadrant-text ${quadrantClass} ${
          isTransitioning ? 'magazine-text--incoming' : 'magazine-text--settled'
        }`}
      >
        <h1 id="magazine-monument-title" className="magazine-title">
          {currentEntry.monument}
        </h1>

        <p className="magazine-location">
          {currentEntry.location}
        </p>

        {/* Description part: hovering prompts 'Read more' cursor and opens Wikipedia in new tab */}
        <a
          href={currentEntry.wikipediaUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(currentEntry.monument.replace(/ /g, '_'))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="magazine-paragraph-link"
          onMouseEnter={() => setCursorState('read-more')}
          onMouseLeave={() => setCursorState('default')}
          aria-label={`Read more about ${currentEntry.monument} on Wikipedia (opens in a new tab)`}
        >
          <p className="magazine-paragraph">
            {currentEntry.paragraph}
          </p>
        </a>
      </section>

      {/* Center Stage Zone: Hovering prompts 'View on map' and clicking opens interactive map modal */}
      <div
        className="magazine-center-stage"
        onClick={() => setMapOpen(true)}
        onMouseEnter={() => setCursorState('view-map')}
        onMouseLeave={() => setCursorState('default')}
        aria-label={`View map for ${currentEntry.monument}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setMapOpen(true);
          }
        }}
      />

      {/* Deckle-Edge Navigation Zones (Click left or right zone to navigate) */}
      <div
        className="magazine-edge-touch magazine-edge-touch--left"
        onClick={goPrev}
        onMouseEnter={() => {
          if (currentIndex > 0) setCursorState('prev');
        }}
        onMouseLeave={() => setCursorState('default')}
        aria-label="Previous spread"
        role="button"
        tabIndex={-1}
      />
      <div
        className="magazine-edge-touch magazine-edge-touch--right"
        onClick={goNext}
        onMouseEnter={() => {
          if (currentIndex < entries.length - 1) setCursorState('next');
        }}
        onMouseLeave={() => setCursorState('default')}
        aria-label="Next spread"
        role="button"
        tabIndex={-1}
      />

      {/* Minimal Monograph Progress Bar at the Bottom */}
      <div
        className="magazine-progress-bar"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={entries.length}
        aria-label={`Spread ${currentIndex + 1} of ${entries.length}`}
        onMouseEnter={() => setCursorState('progress')}
        onMouseLeave={() => setCursorState('default')}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetIndex = Math.min(entries.length - 1, Math.floor(ratio * entries.length));
          if (targetIndex !== currentIndex) {
            goTo(targetIndex, targetIndex > currentIndex ? 1 : -1);
          }
        }}
      >
        <div
          className="magazine-progress-fill"
          style={{ width: `${((currentIndex + 1) / entries.length) * 100}%` }}
        />
      </div>

      {/* Animated Follower Cursor - hidden when modal is open */}
      {!mapOpen && (
        <div
          ref={cursorRef}
          className={`magazine-custom-cursor magazine-cursor--${cursorState} ${
            cursorVisible ? 'magazine-cursor--visible' : ''
          } ${cursorDown ? 'magazine-cursor--down' : ''}`}
          aria-hidden="true"
        >
          <div className="magazine-cursor-inner">
            {cursorState === 'prev' && (
              <svg
                className="magazine-cursor-arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            )}

            {cursorState === 'next' && (
              <svg
                className="magazine-cursor-arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}

            {cursorState === 'view-map' && (
              <span className="magazine-cursor-badge magazine-cursor-badge--map">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                <span>View on map</span>
              </span>
            )}

            {cursorState === 'back-home' && (
              <span className="magazine-cursor-badge magazine-cursor-badge--back">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to home</span>
              </span>
            )}

            {cursorState === 'read-more' && (
              <span className="magazine-cursor-readmore">
                Read more <span className="magazine-cursor-arrow">↗</span>
              </span>
            )}

            {cursorState === 'default' && (
              <span className="magazine-cursor-dot" />
            )}
          </div>
        </div>
      )}

      {/* Centered Interactive Map Modal */}
      {mapOpen && (
        <Suspense fallback={null}>
          <MagazineMapModal
            entries={entries}
            entry={currentEntry}
            currentIndex={currentIndex}
            totalEntries={entries.length}
            onPrev={goPrev}
            onNext={goNext}
            onSelect={(idx) => {
              if (idx !== currentIndex) {
                goTo(idx, idx > currentIndex ? 1 : -1);
              }
            }}
            onClose={() => setMapOpen(false)}
          />
        </Suspense>
      )}
    </article>
  );
}
