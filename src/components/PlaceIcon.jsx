// Small line drawings keep each place recognisable without turning navigation
// into a different interface at every stop.
const drawings = {
  pin: <><path d="M26 12c0 8-10 18-10 18S6 20 6 12a10 10 0 0 1 20 0Z"/><circle cx="16" cy="12" r="3"/></>,
  backpack: <><path d="M7 29V13c0-9 18-9 18 0v16Zm4-21V5c0-4 10-4 10 0v3M7 17H4v10h3m18-10h3v10h-3"/><rect x="11" y="18" width="10" height="7" rx="2"/><path d="M12 12h8"/></>,
  food: <><path d="M7 3v9m-4-9v6q0 5 4 5t4-5V3M7 14v16M24 3v27m0-27q-9 7-6 14h6"/></>,
  train: <><rect x="7" y="3" width="18" height="23" rx="5"/><path d="M7 15h18M16 6v9M11 21h1m8 0h1M10 26l-4 5m16-5 4 5M9 29h14"/></>,
  museum: <><path d="M3 10 16 3l13 7H3Zm2 3v12m7-12v12m8-12v12m7-12v12M3 26h26M1 30h30"/></>,
  flag: <><path d="M6 30V3m0 2q6-5 12 0t11 0v14q-5 5-11 0t-12 0M2 30h9"/></>,
  tent: <><path d="m2 28 14-23 14 23H2Zm8 0 6-13 6 13M13 2l3 3 3-3M1 31h30"/></>,
  crescent: <><path d="M22 3C10 6 11 23 25 23 14 35-1 19 7 8c-1 11 10 18 18 15M16 10c-5 7-5 10 0 10s5-3 0-10Z" /></>,
  'india-gate': <><path d="M5 29V12h2V7h18v5h2v17M4 12h24M6 7V4h20v3M11 29V19a5 5 0 0 1 10 0v10M2 29h28M11 9h10" /><path d="M8 15v10m16-10v10" /></>,
  jharokha: <><path d="M3 29V15h4v-5h5V6h3V3h2v3h3v4h5v5h4v14H3ZM3 22h26M7 15h18M12 10h8M7 29v-4q2-3 4 0v4m3 0v-4q2-3 4 0v4m3 0v-4q2-3 4 0v4M9 19v-2m7 2v-2m7 2v-2M16 13v-1" /></>,
  laptop: <><rect x="5" y="5" width="22" height="17" rx="2" /><path d="M5 22 2 27h28l-3-5M12 25h8M12 11l-3 3 3 3m8-6 3 3-3 3" /></>,
  flute: <><path d="m5 24 22-13 2 4L7 28zM17 14C9 12 10 4 16 3c7 3 7 10 1 11Z" /><path d="M16 7c-3 2-2 5 1 4M11 22h.1m5-3h.1m5-3h.1M7 25l-4 2" /></>,
  lamp: <><path d="M5 21h22c-2 6-7 8-11 8S7 27 5 21Zm11-3c-7-3-2-8 0-13 1 5 7 9 0 13Z" /><path d="M2 29h28" /></>,
  tram: <><rect x="7" y="8" width="18" height="19" rx="4" /><path d="M11 8 15 3h8M7 18h18m-9-10v10m-5 5h1m8 0h1M10 27l-2 4m14-4 2 4M3 4h26" /></>,
  wheel: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="3" /><path d="M16 5v8m0 6v8M5 16h8m6 0h8M8 8l6 6m4 4 6 6M8 24l6-6m4-4 6-6" /></>,
  building: <><path d="M5 29V11h10v18m2 0V3h10v26M2 29h28M8 15h4m-4 5h4m8-12h4m-4 5h4m-4 5h4m-4 5h4" /></>,
  sun: <><circle cx="16" cy="13" r="6" /><path d="M16 2v2m0 18v2M5 13H2m28 0h-3M6 3l3 3m14 0 3-3M2 29c8-7 15-7 28-2" /></>,
  snow: <><path d="M16 2v28M4 9l24 14M4 23 28 9M12 5l4 4 4-4m-8 22 4-4 4 4M5 14l6-2-1-6m17 12-6 2 1 6M5 18l6 2-1 6m17-12-6-2 1-6" /></>,
  leaf: <><path d="M7 25C-1 10 16 9 27 3c1 17-7 28-20 22Zm0 0L23 8M14 18l-1-7m1 7 8 1M7 25l-4 5" /></>,
  shell: <><path d="M12 28 3 14C1 1 30 1 29 14L20 28Zm-7-16 9 16M11 7l4 21M21 7l-4 21m10-16-9 16M12 28h8" /></>,
  tea: <><path d="M5 13h18v6c0 11-18 11-18 0Zm18 1h3c7 0 4 9-3 9M2 29h26M10 2c-4 3 4 4 0 7m8-7c-4 3 4 4 0 7" /></>,
  mountain: <><path d="m2 27 11-21 7 13 4-7 7 15H2Zm7-13 4 3 4-3M21 4h.1" /><circle cx="24" cy="5" r="2" /></>,
  arch: <><path d="M4 29V13c0-10 24-10 24 0v16M10 29V17c0-8 12-8 12 0v12M2 29h28M4 8h24M16 2v3" /></>,
  boat: <><path d="M2 22h28l-6 6H9l-7-6Zm14 0V3L5 18h11m3-12 8 12h-8M2 31h28" /></>,
  bell: <><path d="M7 23h18l-3-6v-5c0-9-12-9-12 0v5l-3 6Zm6 4c2 4 5 3 6 0M16 2v3M3 10l3 1m20 0 3-1" /></>,
  window: <><rect x="6" y="4" width="20" height="24" rx="9" /><path d="M16 4v24M6 16h20M3 28h26" /></>,
};

export default function PlaceIcon({ kind, className = '' }) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[kind] || drawings.window}</svg>;
}
