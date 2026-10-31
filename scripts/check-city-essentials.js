import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { BACKPACKING_101, CITIES } from '../src/data.js';
import { getCityEssentials } from '../src/cityEssentials.js';

const core = ['hostels', 'app_cabs', 'metro', 'public_transport'];
assert.deepEqual(BACKPACKING_101.map(section => section.title), ['Stuff', 'Stay', 'Travel', 'Hacks'], 'The notebook retains all four advice sections');
for (const [code, city] of Object.entries(CITIES)) {
  assert.ok(!('accommodation' in city), `${code}: no lodging brands remain in the data`);
  const essentials = getCityEssentials(city);
  assert.deepEqual(essentials.slice(0, 4).map(item => item.key), core, `${code}: all core services are shown`);
  assert.ok(Object.values(city.essentials).every(value => value === null || typeof value === 'boolean'), `${code}: availability is explicit`);
  const html = await readFile(new URL(`../dist/cities/${code}/index.html`, import.meta.url), 'utf8');
  assert.match(html, /Local essentials/, `${code}: the section is in the generated page`);
  assert.doesNotMatch(html, /href="\/stay(?:[#/"?])|>Accommodation</, `${code}: no lodging promotion remains`);
}

assert.ok(getCityEssentials(CITIES.hyderabad).slice(0, 4).every(item => item.status === 'available'));
assert.ok(getCityEssentials(CITIES.kurseong).every(item => item.status === 'unknown'), 'Underlying unknown availability is preserved');
assert.equal(getCityEssentials({ essentials: { metro: false } }).find(item => item.key === 'metro').description, 'Not available');
assert.ok(getCityEssentials().every(item => item.description === 'Not available'));
assert.ok(getCityEssentials({ category: ['metro'] }).find(item => item.key === 'metro').status === 'unknown', 'A metropolitan city category does not prove a metro service exists');

const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const directory = await readFile(new URL('../dist/find/index.html', import.meta.url), 'utf8');
for (const html of [home, directory]) {
  assert.doesNotMatch(html, /value="stay"|href="\/stay(?:[#/"?])|place to stay/, 'The directory has no stay filter or links');
}
const trip = await readFile(new URL('../dist/supertrips/braj-kashi-and-kalinga/index.html', import.meta.url), 'utf8');
assert.match(trip, /Local essentials/, 'The section is also present on supertrip pages');
assert.ok(!existsSync(new URL('../dist/stay', import.meta.url)), 'No stay page is generated');
const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
assert.doesNotMatch(sitemap, /\/stay(?:\/|<)/, 'Stay is absent from the sitemap');
console.log('Local essentials: all 128 cities, unknown/unavailable states, trip pages and removal of stay browsing pass.');
