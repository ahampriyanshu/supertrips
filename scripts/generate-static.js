import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ACCOMMODATIONS, CATEGORIES, CITIES, REGIONS, STATES, TRIPS } from '../src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

const siteName = 'SuperTrips';
const authorName = 'Priyanshu';
const defaultDescription = 'My routes across India, city by city. Kept for memory, shared if you plan to backpack around India too.';
const defaultImagePath = '/og-image.svg';
const totalCities = new Set(TRIPS.flatMap(trip => trip.cities.map(city => city.city))).size;
const totalStops = TRIPS.reduce((total, trip) => total + trip.cities.length, 0);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeRoute(route) {
  if (!route || route === '/') return '/';
  return `/${route.replace(/^\/+|\/+$/g, '')}`;
}

async function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/g, '');

  try {
    const cname = await readFile(path.join(rootDir, 'CNAME'), 'utf8');
    const host = cname.trim();
    if (host) return `https://${host}`;
  } catch {
    // Fall back below.
  }

  return 'https://supertrips.ahampriyanshu.com';
}

function absoluteUrl(siteUrl, route) {
  return `${siteUrl}${route === '/' ? '/' : route}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function textList(items, limit = 3) {
  return items.slice(0, limit).map(item => item.city || item.label || item.name || item).join(', ');
}

function formatParam(value) {
  return String(value || '')
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatAccommodation(value) {
  return ACCOMMODATIONS[value]?.label || formatParam(value);
}

function getAccommodationSlug(value) {
  return ACCOMMODATIONS[value]?.slug || String(value || '').replace(/_/g, '-');
}

function getStateLabel(stateCode) {
  return STATES[stateCode]?.label || formatParam(stateCode);
}

function getCategoryLabel(categoryCode) {
  return CATEGORIES[categoryCode]?.label || formatParam(categoryCode);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function sortCityCodes(cityCodes) {
  return [...cityCodes]
    .filter(cityCode => CITIES[cityCode])
    .sort((a, b) => CITIES[a].city.localeCompare(CITIES[b].city));
}

function buildRoutes() {
  const routes = [
    {
      path: '/',
      type: 'home',
      heading: 'SuperTrips',
      title: 'SuperTrips',
      description: defaultDescription,
      priority: '1.0',
    },
    {
      path: '/supertrips',
      type: 'home',
      heading: 'SuperTrips',
      title: 'SuperTrips',
      description: defaultDescription,
      priority: '0.9',
    },
    {
      path: '/cities',
      type: 'cities',
      heading: 'Cities',
      title: 'Cities | SuperTrips',
      description: `Browse ${Object.keys(CITIES).length} Indian cities by region and state.`,
      priority: '0.9',
    },
    {
      path: '/categories',
      type: 'categories',
      heading: 'Categories',
      title: 'Categories | SuperTrips',
      description: 'Browse destinations by travel style, from forts and museums to mountains, coastlines, temples, and food.',
      priority: '0.9',
    },
    {
      path: '/stay',
      type: 'stay',
      heading: 'Stay',
      title: 'Stay | SuperTrips',
      description: 'Browse destinations by accommodation options, from hostel chains and Bloom to homestays and hotels.',
      priority: '0.8',
    },
  ];

  TRIPS.forEach((trip) => {
    routes.push({
      path: `/routes/${slugify(trip.name)}`,
      type: 'trip',
      heading: trip.name,
      trip,
      title: `${trip.name} | SuperTrips`,
      description: `${trip.name}: ${trip.cities.length} stops including ${textList(trip.cities)}.`,
      priority: '0.8',
    });
  });

  Object.entries(CITIES).forEach(([code, city]) => {
    const stateLabel = getStateLabel(city.state);

    routes.push({
      path: `/cities/${code}`,
      type: 'city',
      heading: city.city,
      cityCode: code,
      city,
      title: `${city.city} | SuperTrips`,
      description: `${city.city}, ${stateLabel}: places to visit, food to try, travel notes, and map.`,
      priority: '0.7',
    });
  });

  Object.values(REGIONS).forEach((region) => {
    routes.push({
      path: `/regions/${region.slug}`,
      type: 'group',
      group: region,
      groupType: 'region',
      heading: `${region.label} India`,
      title: `${region.label} India | SuperTrips`,
      description: `${region.cities.length} destinations from ${region.label.toLowerCase()} India.`,
      priority: '0.6',
    });
  });

  Object.values(STATES).forEach((state) => {
    routes.push({
      path: `/states/${state.slug}`,
      type: 'group',
      group: state,
      groupType: 'state',
      heading: state.label,
      title: `${state.label} | SuperTrips`,
      description: `${state.cities.length} destinations from ${state.label}.`,
      priority: '0.6',
    });
  });

  Object.values(CATEGORIES).forEach((category) => {
    routes.push({
      path: `/categories/${category.slug}`,
      type: 'group',
      group: category,
      groupType: 'category',
      heading: `${category.label} Destinations`,
      title: `${category.label} Destinations | SuperTrips`,
      description: `${category.cities.length} ${category.label.toLowerCase()} destinations from these routes.`,
      priority: '0.6',
    });
  });

  const seen = new Set();
  return routes
    .map(route => ({ ...route, path: normalizeRoute(route.path) }))
    .filter((route) => {
      if (seen.has(route.path)) return false;
      seen.add(route.path);
      return true;
    });
}

function renderAnchor(href, label) {
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function renderCityLink(cityCode) {
  const city = CITIES[cityCode];
  if (!city) return '';

  const tags = normalizeList(city.category).slice(0, 3).map(getCategoryLabel).join(', ');

  return [
    '<li class="ssg-city">',
    renderAnchor(`/cities/${cityCode}`, city.city),
    tags ? `<span>${escapeHtml(tags)}</span>` : '',
    '</li>',
  ].join('');
}

function renderCityList(cityCodes) {
  const items = sortCityCodes(cityCodes).map(renderCityLink).join('');
  return `<ul class="ssg-list">${items}</ul>`;
}

function renderTextList(items, limit = 8) {
  const normalized = normalizeList(items).slice(0, limit);
  if (normalized.length === 0) return '';

  return `<ul class="ssg-list">${normalized.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderMainHeader(isHome = false) {
  const titleTag = isHome ? 'h1' : 'div';
  const stats = [
    ['10', 'Trips'],
    [totalCities, 'Cities'],
    [totalStops, 'Total stops'],
  ].map(([value, label]) => [
    '<div>',
    `  <div class="ssg-hero-stat-value">${escapeHtml(value)}</div>`,
    `  <div class="ssg-hero-stat-label">${escapeHtml(label)}</div>`,
    '</div>',
  ].join('')).join('');

  return [
    '      <header class="ssg-main-hero">',
    '        <div class="ssg-hero-pattern"></div>',
    '        <div class="ssg-hero-inner">',
    `          <${titleTag} class="ssg-hero-title"><a href="/">Super<em>Trips</em></a></${titleTag}>`,
    `          <p class="ssg-hero-sub">${escapeHtml(defaultDescription)}</p>`,
    `          <div class="ssg-hero-stats">${stats}</div>`,
    '        </div>',
    '      </header>',
  ].join('\n');
}

function renderRouteCrumb(route) {
  if (route.path === '/') return '';

  return [
    '      <nav class="ssg-breadcrumb" aria-label="Breadcrumb">',
    `        ${renderAnchor('/', siteName)}`,
    '        <span>/</span>',
    `        <h1>${escapeHtml(route.heading)}</h1>`,
    '      </nav>',
    `      <p class="ssg-page-intro">${escapeHtml(route.description)}</p>`,
  ].join('\n');
}

function renderStaticShell(route, content) {
  return [
    '    <main class="ssg-page">',
    renderMainHeader(route.path === '/'),
    '      <div class="ssg-content">',
    renderRouteCrumb(route),
    content,
    '      </div>',
    '    </main>',
  ].join('\n');
}

function renderHomeRoute(route) {
  const tripItems = TRIPS.map((trip) => [
    '<li class="ssg-city">',
    renderAnchor(`/routes/${slugify(trip.name)}`, trip.name),
    `<span>${escapeHtml(`${trip.cities.length} stops: ${textList(trip.cities, 4)}`)}</span>`,
    '</li>',
  ].join('')).join('');

  const content = [
    '      <section class="ssg-section">',
    '        <h2>Routes</h2>',
    `        <ul class="ssg-list">${tripItems}</ul>`,
    '      </section>',
    '      <section class="ssg-grid">',
    `        ${renderAnchor('/cities', 'Cities by region and state')}`,
    `        ${renderAnchor('/categories', 'Cities by category')}`,
    `        ${renderAnchor('/stay', 'Cities by stay')}`,
    '      </section>',
  ].join('\n');

  return renderStaticShell(route, content);
}

function renderTripRoute(route) {
  const items = route.trip.cities.map((city) => [
    '<li class="ssg-city">',
    `<span>${escapeHtml(city.city)}</span>`,
    `<span>${escapeHtml(city.dur || city.duration || city.ideal_stay || 'Stop')}</span>`,
    '</li>',
  ].join('')).join('');

  const content = [
    '      <section class="ssg-section">',
    '        <h2>Stops</h2>',
    `        <ul class="ssg-list">${items}</ul>`,
    '      </section>',
  ].join('\n');

  return renderStaticShell(route, content);
}

function renderCityRoute(route) {
  const { city } = route;
  const categories = normalizeList(city.category).map(getCategoryLabel).join(', ');
  const accommodation = normalizeList(city.accommodation)
    .map(item => renderAnchor(`/stay#${getAccommodationSlug(item)}`, formatAccommodation(item)))
    .join(', ');
  const travelModes = normalizeList(city.mode_of_travel).map(formatParam).join(', ');

  const content = [
    '      <section class="ssg-grid">',
    `<span>State: ${escapeHtml(getStateLabel(city.state))}</span>`,
    `<span>Region: ${escapeHtml(formatParam(city.region))}</span>`,
    categories ? `<span>Category: ${escapeHtml(categories)}</span>` : '',
    accommodation ? `<span>Accommodation: ${accommodation}</span>` : '',
    travelModes ? `<span>Travel: ${escapeHtml(travelModes)}</span>` : '',
    '      </section>',
    '      <section class="ssg-section">',
    '        <h2>Must visit</h2>',
    `        ${renderTextList(city.must_visit)}`,
    '      </section>',
    '      <section class="ssg-section">',
    '        <h2>Must try</h2>',
    `        ${renderTextList(city.must_try)}`,
    '      </section>',
  ].join('\n');

  return renderStaticShell(route, content);
}

function renderCitiesRoute(route) {
  const regions = Object.values(REGIONS).sort((a, b) => a.label.localeCompare(b.label));
  const content = regions.map((region) => {
    const regionCityCodes = sortCityCodes(region.cities);
    const stateCodes = [...new Set(regionCityCodes.map(cityCode => CITIES[cityCode].state))]
      .sort((a, b) => getStateLabel(a).localeCompare(getStateLabel(b)));

    const states = stateCodes.map((stateCode) => {
      const stateCityCodes = regionCityCodes.filter(cityCode => CITIES[cityCode].state === stateCode);
      const stateSlug = STATES[stateCode]?.slug || stateCode;

      return [
        '        <div class="ssg-subsection">',
        `          <h3>${renderAnchor(`/states/${stateSlug}`, getStateLabel(stateCode))}</h3>`,
        `          ${renderCityList(stateCityCodes)}`,
        '        </div>',
      ].join('\n');
    }).join('\n');

    return [
      '      <section class="ssg-section">',
      `        <h2>${renderAnchor(`/regions/${region.slug}`, region.label)}</h2>`,
      states,
      '      </section>',
    ].join('\n');
  }).join('\n');

  return renderStaticShell(route, content);
}

function renderCategoriesRoute(route) {
  const categories = Object.values(CATEGORIES).sort((a, b) => a.label.localeCompare(b.label));
  const content = categories.map(category => [
    '      <section class="ssg-section">',
    `        <h2>${renderAnchor(`/categories/${category.slug}`, category.label)}</h2>`,
    `        ${renderCityList(category.cities)}`,
    '      </section>',
  ].join('\n')).join('\n');

  return renderStaticShell(route, content);
}

function renderStayRoute(route) {
  const content = Object.values(ACCOMMODATIONS).map(stay => [
    '      <section class="ssg-section">',
    `        <h2 id="${escapeHtml(stay.slug)}">${escapeHtml(stay.label)}</h2>`,
    `        ${renderCityList(stay.cities)}`,
    '      </section>',
  ].join('\n')).join('\n');

  return renderStaticShell(route, content);
}

function renderGroupRoute(route) {
  const content = [
    '      <section class="ssg-section">',
    '        <h2>Destinations</h2>',
    `        ${renderCityList(route.group.cities)}`,
    '      </section>',
  ].join('\n');

  return renderStaticShell(route, content);
}

function renderStaticRoute(route) {
  if (route.type === 'home') return renderHomeRoute(route);
  if (route.type === 'trip') return renderTripRoute(route);
  if (route.type === 'city') return renderCityRoute(route);
  if (route.type === 'cities') return renderCitiesRoute(route);
  if (route.type === 'categories') return renderCategoriesRoute(route);
  if (route.type === 'stay') return renderStayRoute(route);
  if (route.type === 'group') return renderGroupRoute(route);
  return renderStaticShell(route, '');
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function getRouteKeywords(route) {
  const base = ['India travel', 'backpacking India', 'Indian cities', 'travel routes', siteName];

  if (route.type === 'city') {
    return uniqueList([
      route.city.city,
      getStateLabel(route.city.state),
      formatParam(route.city.region),
      ...normalizeList(route.city.category).map(getCategoryLabel),
      ...base,
    ]).slice(0, 18).join(', ');
  }

  if (route.type === 'trip') {
    return uniqueList([
      route.trip.name,
      ...route.trip.cities.map(city => city.city),
      ...base,
    ]).slice(0, 18).join(', ');
  }

  if (route.type === 'group') {
    return uniqueList([
      route.group.label,
      ...sortCityCodes(route.group.cities).slice(0, 8).map(cityCode => CITIES[cityCode].city),
      ...base,
    ]).slice(0, 18).join(', ');
  }

  return base.join(', ');
}

function getImageAlt(route) {
  if (route.type === 'city') return `${route.city.city} travel notes on ${siteName}`;
  if (route.type === 'trip') return `${route.trip.name} route on ${siteName}`;
  return `${siteName} travel routes across India`;
}

function buildBreadcrumb(route, siteUrl) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: siteName,
      item: absoluteUrl(siteUrl, '/'),
    },
  ];

  if (route.path !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: route.heading,
      item: absoluteUrl(siteUrl, route.path),
    });
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(siteUrl, route.path)}#breadcrumb`,
    itemListElement: items,
  };
}

function buildItemList(route, siteUrl) {
  let cityCodes = [];

  if (route.type === 'group') cityCodes = sortCityCodes(route.group.cities);
  if (route.type === 'cities') cityCodes = sortCityCodes(Object.keys(CITIES));
  if (route.type === 'categories') {
    cityCodes = sortCityCodes(uniqueList(Object.values(CATEGORIES).flatMap(category => category.cities)));
  }
  if (route.type === 'stay') {
    cityCodes = sortCityCodes(uniqueList(Object.values(ACCOMMODATIONS).flatMap(stay => stay.cities)));
  }

  if (cityCodes.length > 0) {
    return {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(siteUrl, route.path)}#destinations`,
      name: route.heading,
      numberOfItems: cityCodes.length,
      itemListElement: cityCodes.map((cityCode, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: CITIES[cityCode].city,
        url: absoluteUrl(siteUrl, `/cities/${cityCode}`),
      })),
    };
  }

  if (route.type === 'home') {
    return {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(siteUrl, route.path)}#routes`,
      name: 'Travel routes',
      numberOfItems: TRIPS.length,
      itemListElement: TRIPS.map((trip, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: trip.name,
        url: absoluteUrl(siteUrl, `/routes/${slugify(trip.name)}`),
      })),
    };
  }

  return null;
}

function buildJsonLd(route, siteUrl) {
  const url = absoluteUrl(siteUrl, route.path);
  const graph = [
    {
      '@type': 'Person',
      '@id': 'https://ahampriyanshu.com/#person',
      name: authorName,
      url: 'https://ahampriyanshu.com/',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      description: defaultDescription,
      inLanguage: 'en-IN',
      publisher: { '@id': 'https://ahampriyanshu.com/#person' },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${siteUrl}/#website` },
      author: { '@id': 'https://ahampriyanshu.com/#person' },
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    buildBreadcrumb(route, siteUrl),
  ];

  const itemList = buildItemList(route, siteUrl);
  if (itemList) graph.push(itemList);

  if (route.type === 'city') {
    graph.push({
      '@type': 'TouristDestination',
      '@id': `${url}#destination`,
      name: route.city.city,
      url,
      address: {
        '@type': 'PostalAddress',
        addressRegion: getStateLabel(route.city.state),
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: route.city.lat,
        longitude: route.city.lng,
      },
      touristType: normalizeList(route.city.category).map(getCategoryLabel),
    });
  }

  if (route.type === 'trip') {
    graph.push({
      '@type': 'Trip',
      '@id': `${url}#trip`,
      name: route.trip.name,
      url,
      description: route.description,
      itinerary: route.trip.cities.map(city => ({
        '@type': 'Place',
        name: city.city,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng,
        },
      })),
    });
  }

  return `<script type="application/ld+json">${escapeJsonForHtml({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function buildRouteSpecificMeta(route) {
  if (route.type !== 'city') return [];

  return [
    `<meta name="geo.placename" content="${escapeHtml(route.city.city)}" />`,
    `<meta name="geo.position" content="${route.city.lat};${route.city.lng}" />`,
    `<meta name="ICBM" content="${route.city.lat}, ${route.city.lng}" />`,
  ];
}

const staticStyles = [
  '<style data-ssg-fallback>',
  '.ssg-page{min-height:100vh;background:#f5f0e8;color:#1a1208;font-family:DM Sans,Segoe UI,sans-serif}',
  '.ssg-page a{color:inherit;text-decoration-color:#c9962a;text-underline-offset:3px}',
  '.ssg-main-hero{background:#1a1208;color:#f5f0e8;padding:3rem 2rem 2.5rem;position:relative;overflow:hidden}',
  '.ssg-hero-pattern{position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(201,150,42,.04) 40px,rgba(201,150,42,.04) 41px)}',
  '.ssg-hero-inner{position:relative;max-width:720px;margin:0 auto}',
  '.ssg-hero-title{font-family:Georgia,serif;font-size:clamp(2.4rem,6vw,3.8rem);line-height:1.1;margin:0 0 1rem;font-weight:700}',
  '.ssg-hero-title a{text-decoration:none}',
  '.ssg-hero-title em{font-style:italic;color:#c9962a}',
  '.ssg-hero-sub{font-size:14px;color:#a09888;max-width:480px;line-height:1.7;margin:0 0 2rem}',
  '.ssg-hero-stats{display:flex;gap:2rem;flex-wrap:wrap}',
  '.ssg-hero-stat-value{font-family:Georgia,serif;font-size:2rem;color:#c9962a;line-height:1}',
  '.ssg-hero-stat-label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9e8e7a;margin-top:3px}',
  '.ssg-content{max-width:720px;margin:0 auto;padding:1.45rem 2rem 3rem;box-sizing:border-box}',
  '.ssg-breadcrumb{display:flex;align-items:center;flex-wrap:wrap;gap:10px;color:#8a7a65;font-size:14px;line-height:1.4;margin:0 0 .5rem}',
  '.ssg-breadcrumb a{font-weight:700;text-decoration:none}',
  '.ssg-breadcrumb span{color:#c9962a}',
  '.ssg-breadcrumb h1{font:inherit;font-weight:700;color:#1a1208;margin:0}',
  '.ssg-page-intro{font-size:14px;line-height:1.7;color:#6a5a48;max-width:560px;margin:0 0 1.5rem}',
  '.ssg-section{margin-top:34px}',
  '.ssg-section h2{font-family:Georgia,serif;font-size:30px;margin:0 0 14px}',
  '.ssg-subsection{margin-top:22px}',
  '.ssg-subsection h3{font-size:16px;margin:0 0 8px;color:#6a5a48}',
  '.ssg-list{list-style:none;margin:0;padding:0}',
  '.ssg-city{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px dashed #d8d0c4}',
  '.ssg-city:last-child{border-bottom:0}',
  '.ssg-city span:last-child{color:#8a7a65;text-align:right}',
  '.ssg-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}',
  '.ssg-grid>*{border:1px solid #e0d8cc;border-radius:4px;background:#faf7f2;padding:8px 12px}',
  '</style>',
].join('\n  ');

function injectMeta(template, route, siteUrl) {
  const canonical = absoluteUrl(siteUrl, route.path);
  const imageUrl = absoluteUrl(siteUrl, defaultImagePath);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const imageAlt = escapeHtml(getImageAlt(route));
  const keywords = escapeHtml(getRouteKeywords(route));
  const jsonLd = buildJsonLd(route, siteUrl);

  const meta = [
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="en-IN" href="${canonical}" />`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}" />`,
    `<link rel="sitemap" type="application/xml" href="${siteUrl}/sitemap.xml" />`,
    `<meta name="keywords" content="${keywords}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:secure_url" content="${imageUrl}" />`,
    `<meta property="og:image:type" content="image/svg+xml" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    ...buildRouteSpecificMeta(route),
    jsonLd,
  ].join('\n  ');

  let html = template
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${description}" />`
    );

  html = html.replace('</head>', `  ${meta}\n  ${staticStyles}\n</head>`);

  return html.replace('<div id="root"></div>', `<div id="root">\n${renderStaticRoute(route)}\n  </div>`);
}

async function writeRoute(route, html) {
  const outputPath = route.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.path.slice(1), 'index.html');

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

function buildSitemap(routes, siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes.map(route => [
    '  <url>',
    `    <loc>${absoluteUrl(siteUrl, route.path)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${route.priority}</priority>`,
    '  </url>',
  ].join('\n')).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function main() {
  const [template, siteUrl] = await Promise.all([
    readFile(templatePath, 'utf8'),
    getSiteUrl(),
  ]);

  const routes = buildRoutes();

  await Promise.all(routes.map(route => writeRoute(route, injectMeta(template, route, siteUrl))));
  await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(routes, siteUrl));
  await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

  try {
    const cname = await readFile(path.join(rootDir, 'CNAME'), 'utf8');
    if (cname.trim()) {
      await writeFile(path.join(distDir, 'CNAME'), `${cname.trim()}\n`);
    }
  } catch {
    // Custom domains are optional.
  }

  console.log(`Generated ${routes.length} static route files and sitemap.xml`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
