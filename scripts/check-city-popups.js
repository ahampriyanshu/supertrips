import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { CITIES, TRIPS } from '../src/data.js';
import { CITY_INTRODUCTIONS } from '../src/cityIntroductions.js';

assert.deepEqual(Object.keys(CITY_INTRODUCTIONS).sort(), Object.keys(CITIES).sort(), 'Every city has its own introduction');
assert.equal(new Set(Object.values(CITY_INTRODUCTIONS).map(item => item.intro)).size, Object.keys(CITIES).length, 'Introductions are city specific');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });
try {
  const { default: CityMapPopup } = await vite.ssrLoadModule('/src/components/CityMapPopup.jsx');
  for (const [code, city] of Object.entries(CITIES)) {
    const introduction = CITY_INTRODUCTIONS[code];
    const sentences = introduction.intro.match(/[^.!?]+[.!?](?:\s|$)/g) || [];
    assert.ok(sentences.length >= 3 && sentences.length <= 4, `${code}: three or four short sentences`);
    assert.ok(introduction.intro.split(/\s+/).length <= 70, `${code}: introduction fits a map popup`);
    const wikipedia = new URL(introduction.wikipedia);
    assert.equal(wikipedia.protocol, 'https:');
    assert.equal(wikipedia.hostname, 'en.wikipedia.org');
    assert.ok(wikipedia.pathname.startsWith('/wiki/') && !wikipedia.pathname.startsWith('/wiki/Special:'), `${code}: direct article link`);

    const html = renderToStaticMarkup(React.createElement(CityMapPopup, { city, cityCode: code }));
    assert.ok(html.includes(`href="/cities/${code}"`), `${code}: city detail navigation remains available`);
    assert.ok(html.includes('class="td-map-popup-intro"'), `${code}: introduction renders`);
    assert.ok(html.includes(`href="${introduction.wikipedia}" target="_blank" rel="noopener noreferrer"`), `${code}: Wikipedia opens as an external link`);
    assert.doesNotMatch(html, /td-map-popup-meta|td-map-popup-chip|Categories|undefined/, `${code}: old popup contents are removed`);
  }

  for (const trip of TRIPS) {
    for (const city of trip.cities) assert.ok(CITY_INTRODUCTIONS[city.code], `${trip.name}: ${city.city} has popup content`);
  }
} finally {
  await vite.close();
}

console.log(`City popups: ${Object.keys(CITIES).length} introductions, Wikipedia links, city links and all ${TRIPS.length} trips pass.`);
