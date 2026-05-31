import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { CITIES as CITIES_DATA, CATEGORIES } from './data.js';

function navigateTo(href) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new Event('popstate'));
}

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// city display name → enrichment data (first match wins for duplicates)
const CITY_ENRICHMENT = Object.values(CITIES_DATA).reduce((acc, entry) => {
  if (!acc[entry.city]) acc[entry.city] = entry;
  return acc;
}, {});

function fmt(s) {
  if (!s) return '';
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function Stars({ n }) {
  return (
    <span style={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ ...styles.star, color: i <= n ? colors.gold : colors.darkLine }}>★</span>
      ))}
    </span>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div style={styles.badge}>
      <div style={styles.badgeLabel}>{label}</div>
      <div style={styles.badgeValue}>{value}</div>
    </div>
  );
}

function WikipediaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-.782.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.172-.346-.273-.857-.295l-.42-.016c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z"/>
    </svg>
  );
}

function ChatGPTIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-4.55-2.02 6.06 6.06 0 0 0-5.82 4.2 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .52 4.9 6.05 6.05 0 0 0 6.51 2.9 6.07 6.07 0 0 0 4.55 2.02 6.06 6.06 0 0 0 5.77-4.2 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.7-7.09zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68V11.2l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.42zm-9.66-4.12a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.9a4.5 4.5 0 0 1-6.14-1.6zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.97v5.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0L4.04 14.1A4.5 4.5 0 0 1 2.34 7.9zm16.6 3.86-5.82-3.35 2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.41-.69zm2.01-3.03-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.68zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.4.68v.01zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3z"/>
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
    </svg>
  );
}

function ExternalLinks({ cityName }) {
  const q = encodeURIComponent(`Tell me about ${cityName}, India`);
  const links = [
    { href: `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`, label: 'Wikipedia', Icon: WikipediaIcon },
    { href: `https://chatgpt.com/?q=${q}`, label: 'ChatGPT', Icon: ChatGPTIcon },
    { href: `https://claude.ai/new?q=${q}`, label: 'Claude', Icon: ClaudeIcon },
  ];
  return (
    <div style={styles.externalLinks}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          style={styles.externalLink}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = colors.gold; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.color = colors.muted; }}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}


// Fits the full route on first render only
function BoundsInit({ positions }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 11);
      done.current = true;
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    done.current = true;
  }, [positions, map]);
  return null;
}

// Pans smoothly to the active city whenever it changes
function CityFocuser({ position }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (!position) return;
    const key = position.join(',');
    if (prev.current === key) return;
    prev.current = key;
    map.panTo(position, { animate: true, duration: 0.5 });
  }, [position, map]);
  return null;
}

function MapColumn({ positions, activePosition }) {
  return (
    <div style={styles.mapColumn}>
      <div style={styles.mapFrame}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={false}
          zoomControl={false}
          style={styles.map}
        >
          {import.meta.env.VITE_MAPPLS_KEY ? (
            <TileLayer
              attribution='&copy; <a href="https://www.mappls.com/">MapmyIndia</a>'
              url={`https://apis.mappls.com/advancedmaps/v1/${import.meta.env.VITE_MAPPLS_KEY}/still_map/{z}/{x}/{y}.png`}
            />
          ) : (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          )}
          <BoundsInit positions={positions} />
          {activePosition && <CityFocuser position={activePosition} />}
          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={routeLineOptions}
            />
          )}
          {activePosition && (
            <Marker position={activePosition} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

function parseDurationDays(duration) {
  const d = duration.toLowerCase();
  if (d.includes('month')) return parseFloat(d) * 30;
  if (d.includes('week')) return parseFloat(d) * 7;
  if (d.includes('½') || d.includes('0.5')) return 0.5;
  return parseFloat(d) || 1;
}

function formatUnit(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

function formatDuration(days) {
  if (days >= 30) return formatUnit(Math.round(days / 30), 'month');
  if (days >= 7) return formatUnit(Math.round(days / 7), 'week');
  return formatUnit(Math.round(days), 'day');
}

const colors = {
  ink: '#1a1208',
  paper: '#f5f0e8',
  card: '#faf7f2',
  gold: '#c9962a',
  muted: '#8a7a65',
  softText: '#a09888',
  border: '#e0d8cc',
  borderStrong: '#d8d0c4',
  darkLine: '#3a3020',
};

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: colors.paper,
  },
  topBar: {
    background: colors.ink,
    color: colors.paper,
    flexShrink: 0,
    height: 68,
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    position: 'relative',
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,150,42,0.04) 40px, rgba(201,150,42,0.04) 41px)',
  },
  iconButton: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconButtonPadded: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.2s',
  },
  divider: {
    width: 1,
    height: 32,
    background: colors.darkLine,
    flexShrink: 0,
  },
  topDivider: {
    width: 1,
    height: 32,
    background: colors.darkLine,
    flexShrink: 0,
    position: 'relative',
  },
  titleBlock: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
  },
  tripTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.1rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.1,
  },
  tripMeta: {
    fontSize: 11,
    color: colors.softText,
    marginTop: 4,
  },
  tripSwitcher: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },
  tripNumber: {
    textAlign: 'center',
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: colors.paper,
  },
  tripNumberEm: {
    fontStyle: 'italic',
    color: colors.gold,
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  mapColumn: {
    width: '40%',
    flexShrink: 0,
    position: 'relative',
    padding: '1.25rem',
    background: colors.paper,
  },
  mapFrame: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 2px 16px rgba(26,18,8,0.06)',
  },
  map: {
    height: '100%',
    width: '100%',
    background: '#eae8e0',
  },
  detailScroll: {
    flex: 1,
    overflowY: 'auto',
    background: colors.paper,
    transition: 'opacity 0.15s ease',
  },
  detailInner: {
    padding: '1.75rem 2rem 2.5rem',
  },
  cityHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '0.35rem',
  },
  cityTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: colors.ink,
  },
  cityMeta: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: '0.9rem',
  },
  stars: {
    display: 'flex',
    gap: 2,
  },
  star: {
    fontSize: 13,
    lineHeight: 1,
  },
  externalLinks: {
    display: 'flex',
    gap: 10,
    marginBottom: '0.85rem',
  },
  externalLink: {
    display: 'flex',
    alignItems: 'center',
    color: colors.muted,
    textDecoration: 'none',
    opacity: 0.75,
    transition: 'opacity 0.15s, color 0.15s',
  },
  categoryLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: '1rem',
  },
  categoryLink: {
    fontSize: 12.5,
    color: colors.muted,
    textDecoration: 'none',
  },
  badgeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: '1.25rem',
  },
  badge: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    padding: '5px 12px',
  },
  badgeLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.ink,
    marginTop: 1,
  },
  detailSection: {
    marginBottom: '1.25rem',
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 7,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    fontSize: 12.5,
    padding: '5px 13px',
    borderRadius: 20,
    background: '#fff',
    color: colors.ink,
    border: `1px solid ${colors.borderStrong}`,
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  note: {
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    fontSize: 13,
    color: '#6a5a48',
    lineHeight: 1.8,
    margin: 0,
  },
  stackedSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  fallback: {
    color: colors.muted,
    fontSize: 13,
  },
  footerTape: {
    height: 72,
    background: colors.ink,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  footerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 1.25rem',
    flexShrink: 0,
  },
  footerCounter: {
    fontFamily: 'Georgia, serif',
    lineHeight: 1,
    minWidth: 42,
    textAlign: 'center',
  },
  footerCounterCurrent: {
    fontSize: '1.2rem',
    color: colors.gold,
  },
  footerCounterSlash: {
    fontSize: '0.8rem',
    color: colors.darkLine,
    margin: '0 3px',
  },
  footerCounterTotal: {
    fontSize: '0.85rem',
    color: '#6a6055',
  },
  tapeWindow: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
  },
  tapeFadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 72,
    background: `linear-gradient(to right, ${colors.ink} 40%, transparent)`,
    zIndex: 2,
    pointerEvents: 'none',
  },
  tapeFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 72,
    background: `linear-gradient(to left, ${colors.ink} 40%, transparent)`,
    zIndex: 2,
    pointerEvents: 'none',
  },
  tapeTrack: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
    willChange: 'transform',
  },
  tapeCity: {
    padding: '4px 14px',
    color: colors.paper,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'opacity 0.35s ease, font-size 0.35s ease, color 0.35s ease',
  },
};

const routeLineOptions = {
  color: colors.gold,
  weight: 3,
  opacity: 0.7,
  dashArray: '6, 14',
};

function DetailColumn({ city, cityIndex, total }) {
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState({ city, cityIndex });

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 0);
    const show = setTimeout(() => {
      setDisplayed({ city, cityIndex });
      setVisible(true);
    }, 150);
    return () => { clearTimeout(hide); clearTimeout(show); };
  }, [city, cityIndex]);

  const { city: c, cityIndex: ci } = displayed;
  const data = c ? CITY_ENRICHMENT[c.city] : null;

  return (
    <div
      data-detail-scroll=""
      style={{ ...styles.detailScroll, opacity: visible ? 1 : 0 }}
    >
      <div style={styles.detailInner}>

        {/* City name + rating */}
        <div style={styles.cityHeader}>
          <div style={styles.cityTitle}>
            {c?.city}
          </div>
          {data && <Stars n={data.rating} />}
        </div>

        {/* State · region */}
        {data && (
          <div style={styles.cityMeta}>
            {fmt(data.state)} &middot; {fmt(data.region)}
          </div>
        )}

        {/* External links */}
        {c && <ExternalLinks cityName={c.city} />}

        {/* Category chips */}
        {data && data.category.length > 0 && (
          <div style={styles.categoryLinks}>
            {data.category.map(cat => (
              <a
                key={cat}
                href={`/categories#category-${CATEGORIES[cat]?.slug || cat}`}
                onClick={e => { e.preventDefault(); navigateTo(`/categories#category-${CATEGORIES[cat]?.slug || cat}`); }}
                style={styles.categoryLink}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {CATEGORIES[cat]?.label || fmt(cat)}
              </a>
            ))}
          </div>
        )}

        {/* Stay badges */}
        <div style={styles.badgeRow}>
          {c?.dur && <InfoBadge label="stayed" value={c.dur} />}
          {data?.ideal_stay && <InfoBadge label="ideal stay" value={data.ideal_stay} />}
          {data?.ideal_season && <InfoBadge label="best time" value={fmt(data.ideal_season)} />}
        </div>

        {/* Getting Around */}
        {data?.mode_of_travel?.length > 0 && (
          <div style={styles.detailSection}>
            <div style={styles.sectionLabel}>
              Getting Around
            </div>
            <div style={styles.chipRow}>
              {data.mode_of_travel.map(m => (
                <span key={m} style={styles.chip}>
                  {fmt(m)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {data?.notes?.length > 0 && (
          <div style={styles.detailSection}>
            <div style={styles.sectionLabel}>
              Notes from the Road
            </div>
            <div style={styles.notesList}>
              {data.notes.map((note, i) => (
                <p key={i} style={styles.note}>
                  &ldquo;{note}&rdquo;
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Must Visit + Must Try — tag style, last */}
        {data && (data.must_visit?.length > 0 || data.must_try?.length > 0) && (
          <div style={styles.stackedSections}>
            {data.must_visit?.length > 0 && (
              <div>
                <div style={styles.sectionLabel}>Must Visit</div>
                <div style={styles.chipRow}>
                  {data.must_visit.slice(0, 6).map((item, i) => (
                    <span key={i} style={styles.chip}>{item}</span>
                  ))}
                </div>
              </div>
            )}
            {data.must_try?.length > 0 && (
              <div>
                <div style={styles.sectionLabel}>Must Try</div>
                <div style={styles.chipRow}>
                  {data.must_try.slice(0, 6).map((item, i) => (
                    <span key={i} style={styles.chip}>{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fallback when no enrichment data */}
        {!data && (
          <div style={styles.fallback}>
            City {ci + 1} of {total}
          </div>
        )}

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
    <div style={styles.footerTape}>
      {/* City navigation — left panel */}
      <div style={styles.footerControls}>
        <button onClick={onPrev} style={{ ...styles.iconButtonPadded, opacity: currentIndex === 0 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={styles.footerCounter}>
          <span style={styles.footerCounterCurrent}>{currentIndex + 1}</span>
          <span style={styles.footerCounterSlash}>/</span>
          <span style={styles.footerCounterTotal}>{cities.length}</span>
        </div>
        <button onClick={onNext} style={{ ...styles.iconButtonPadded, opacity: currentIndex === cities.length - 1 ? 0.2 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* City tape */}
      <div style={styles.tapeWindow}>
        <div style={styles.tapeFadeLeft} />
        <div style={styles.tapeFadeRight} />

        <div
          ref={tapeRef}
          style={styles.tapeTrack}
        >
          {cities.map((city, i) => {
            const dist = Math.abs(i - currentIndex);
            const isActive = dist === 0;
            const opacity = isActive ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.28 : 0.1;
            const fontSize = isActive ? 22 : dist === 1 ? 14 : dist === 2 ? 11 : 9;

            return (
              <span
                key={i}
                ref={el => cityRefs.current[i] = el}
                style={{
                  ...styles.tapeCity,
                  fontSize,
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: isActive ? "Georgia, 'Times New Roman', serif" : 'inherit',
                  fontStyle: isActive ? 'italic' : 'normal',
                  color: isActive ? colors.gold : colors.paper,
                  opacity,
                  letterSpacing: isActive ? 0.2 : 0.1,
                }}
              >
                {city.city}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CityDetails({ city, onBack }) {
  const position = city?.lat && city?.lng ? [city.lat, city.lng] : null;

  return (
    <div style={styles.root}>
      <div style={styles.topBar}>
        <div style={styles.pattern} />

        <button onClick={onBack} style={styles.iconButton}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div style={styles.topDivider} />

        <div style={styles.titleBlock}>
          <div style={styles.tripTitle}>
            {city.city}
          </div>
          <div style={styles.tripMeta}>
            {fmt(city.state)} · {fmt(city.region)}
          </div>
        </div>

      </div>

      <div style={styles.main}>
        <MapColumn
          positions={position ? [position] : []}
          activePosition={position}
        />
        <DetailColumn city={city} cityIndex={0} total={1} />
      </div>
    </div>
  );
}

export default function TripDetails({ trip, index, initialCityIndex = 0, onBack, onPrevTrip, onNextTrip }) {
  const [currentIndex, setCurrentIndex] = useState(initialCityIndex);

  const cities = trip.cities;
  const activeCity = cities[currentIndex];
  const totalDuration = formatDuration(cities.reduce((s, c) => s + parseDurationDays(c.dur), 0));

  const currentIndexRef = useRef(initialCityIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const prevTripRef = useRef(onPrevTrip);
  const nextTripRef = useRef(onNextTrip);
  useEffect(() => { prevTripRef.current = onPrevTrip; }, [onPrevTrip]);
  useEffect(() => { nextTripRef.current = onNextTrip; }, [onNextTrip]);

  const advance = useCallback((dir) => {
    const next = currentIndexRef.current + dir;
    if (next < 0) {
      prevTripRef.current(true);
      return;
    }
    if (next >= cities.length) {
      nextTripRef.current();
      return;
    }
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, [cities.length]);

  useEffect(() => {
    let acc = 0;
    let idleTimer = null;
    const THRESHOLD = 400;

    const onWheel = (e) => {
      // Let the detail column scroll its own content naturally
      if (e.target.closest('[data-detail-scroll]')) return;
      e.preventDefault();
      acc += e.deltaY;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { acc = 0; }, 200);

      while (Math.abs(acc) >= THRESHOLD) {
        advance(acc > 0 ? 1 : -1);
        acc -= acc > 0 ? THRESHOLD : -THRESHOLD;
      }
    };

    let swipeStart = null;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    };

    const onPointerUp = (e) => {
      if (!swipeStart) return;
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      const dt = Date.now() - swipeStart.t;
      swipeStart = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (dt < 500 && absX > 60 && absX > absY * 2) {
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
    document.addEventListener('pointerdown',   onPointerDown);
    document.addEventListener('pointerup',     onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('keydown',       onKey);

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('wheel',         onWheel);
      document.removeEventListener('pointerdown',   onPointerDown);
      document.removeEventListener('pointerup',     onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('keydown',       onKey);
    };
  }, [advance]);

  return (
    <div style={styles.root}>
      {/* ── HEADER ── */}
      <div style={styles.topBar}>
        <div style={styles.pattern} />

        <button onClick={onBack} style={styles.iconButton}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 17L8 11L14 5" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div style={styles.topDivider} />

        <div style={styles.titleBlock}>
          <div style={styles.tripTitle}>
            {trip.name}
          </div>
          <div style={styles.tripMeta}>
            {totalDuration} · {cities.length} stops · {trip.distanceKm.toLocaleString()} km
          </div>
        </div>

        <div style={styles.tripSwitcher}>
          <button onClick={onPrevTrip} style={styles.iconButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke={colors.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={styles.tripNumber}>
            Super<em style={styles.tripNumberEm}>Trip </em>{index + 1}
          </div>
          <button onClick={onNextTrip} style={styles.iconButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke={colors.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={styles.main}>
        <MapColumn
          positions={cities.filter(c => c.lat && c.lng).map(c => [c.lat, c.lng])}
          activePosition={activeCity?.lat && activeCity?.lng ? [activeCity.lat, activeCity.lng] : null}
        />
        <DetailColumn city={activeCity} cityIndex={currentIndex} total={cities.length} />
      </div>

      {/* ── FOOTER TAPE ── */}
      <FooterTape cities={cities} currentIndex={currentIndex} onPrev={() => advance(-1)} onNext={() => advance(1)} />
    </div>
  );
}
