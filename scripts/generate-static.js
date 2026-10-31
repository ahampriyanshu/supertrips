import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

import { CATEGORIES, CITIES, STATES, TRIPS } from '../src/data.js';
import { LEGACY_FIND_ROUTES } from '../src/findRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

const siteName = 'SuperTrips';
const authorName = 'Priyanshu';
const defaultDescription = 'My routes across India, city by city. Kept for memory, shared if you plan to backpack around India too.';
const defaultImagePath = '/og-image.svg';

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
      path: '/find',
      type: 'find',
      heading: 'Find your next stop',
      title: 'Find a city | SuperTrips',
      description: `Browse ${Object.keys(CITIES).length} Indian cities by state, region, or travel style.`,
      priority: '0.9',
    },
  ];

  TRIPS.forEach((trip) => {
    routes.push({
      path: `/supertrips/${slugify(trip.name)}`,
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

  const seen = new Set();
  return routes
    .map(route => ({ ...route, path: normalizeRoute(route.path) }))
    .filter((route) => {
      if (seen.has(route.path)) return false;
      seen.add(route.path);
      return true;
    });
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

  if (route.type === 'find') cityCodes = sortCityCodes(Object.keys(CITIES));

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
        url: absoluteUrl(siteUrl, `/supertrips/${slugify(trip.name)}`),
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

function injectMeta(template, route, siteUrl, appHtml) {
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

  html = html.replace('</head>', `  ${meta}\n</head>`);

  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

async function writeRoute(route, html) {
  const outputPath = route.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.path.slice(1), 'index.html');

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

function buildTripRedirect(route, siteUrl) {
  const destination = escapeHtml(route.path);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(route.title)}</title>
  <link rel="canonical" href="${escapeHtml(absoluteUrl(siteUrl, route.path))}" />
  <meta name="robots" content="noindex, follow" />
  <script>window.location.replace(${escapeJsonForHtml(route.path)} + window.location.search + window.location.hash);</script>
  <noscript><meta http-equiv="refresh" content="0; url=${destination}" /></noscript>
</head>
<body><a href="${destination}">Continue to ${escapeHtml(route.heading)}</a></body>
</html>
`;
}

function buildFindRedirect(destination, siteUrl) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Find a city | SuperTrips</title>
  <link rel="canonical" href="${escapeHtml(absoluteUrl(siteUrl, '/find'))}" />
  <meta name="robots" content="noindex, follow" />
  <script>
    const target = new URL(${escapeJsonForHtml(destination)}, window.location.href);
    for (const [key, value] of new URLSearchParams(window.location.search)) {
      if (!target.searchParams.has(key)) target.searchParams.append(key, value);
    }
    target.hash = window.location.hash;
    window.location.replace(target.pathname + target.search + target.hash);
  </script>
  <noscript><meta http-equiv="refresh" content="0; url=${escapeHtml(destination)}" /></noscript>
</head>
<body><a href="${escapeHtml(destination)}">Find a city</a></body>
</html>
`;
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
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

    await Promise.all(routes.map((route) => {
      const appHtml = renderToString(React.createElement(App, { initialPath: route.path }));
      return writeRoute(route, injectMeta(template, route, siteUrl, appHtml));
    }));
    await Promise.all(routes.filter(route => route.type === 'trip').map(route =>
      writeRoute({ path: route.path.replace('/supertrips/', '/routes/') }, buildTripRedirect(route, siteUrl))
    ));
    await Promise.all(LEGACY_FIND_ROUTES.map(route =>
      writeRoute(route, buildFindRedirect(route.destination, siteUrl))
    ));
    await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(routes, siteUrl));
    await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  } finally {
    await vite.close();
  }

  try {
    const cname = await readFile(path.join(rootDir, 'CNAME'), 'utf8');
    if (cname.trim()) {
      await writeFile(path.join(distDir, 'CNAME'), `${cname.trim()}\n`);
    }
  } catch {
    // Custom domains are optional.
  }

  console.log(`Generated ${routes.length} static route files, ${TRIPS.length} legacy trip redirects, ${LEGACY_FIND_ROUTES.length} browse redirects and sitemap.xml`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
