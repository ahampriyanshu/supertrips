import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CITIES, STATES, TRIPS } from '../src/data.js';
import { JOURNEY_FOOD } from '../src/themes/journeyFood.js';
import { CITY_ILLUSTRATIONS } from '../src/themes/cityIllustrations.js';
import { CITY_LOCAL_NAMES } from '../src/themes/cityIdentity.js';

for (const code of Object.keys(CITIES)) {
  const html = await readFile(new URL(`../dist/cities/${code}/index.html`, import.meta.url), 'utf8');
  const { kind } = CITY_ILLUSTRATIONS[code];
  const figure = html.match(/<figure class="place-postcard[\s\S]*?<\/figure>/)?.[0];
  assert.ok(figure, `${code}: illustration is present in the static page`);
  assert.match(figure, /role="img" aria-label="[^"]+"/, `${code}: illustration has a text alternative`);
  assert.doesNotMatch(figure, /<figcaption|<text[\s>]/, `${code}: artwork has no visible caption or labels`);
  assert.doesNotMatch(html, /Pause motion|Pause animations|Resume animations|Still moments/, `${code}: removed motion control stays absent`);
  if (!['delhi', 'jaipur'].includes(kind)) {
    assert.ok(figure.includes(`data-subject="${kind}"`), `${code}: its subject actually rendered, not just a background`);
  }
  assert.doesNotMatch(figure, /NaN|undefined/, `${code}: valid illustration geometry`);
  assert.doesNotMatch(html, /class="place-emblem"/, `${code}: old emblem is removed from the heading`);
  assert.doesNotMatch(html, /class="journey-food"/, `${code}: food covers are confined to the homepage journeys`);
  assert.equal((html.match(/place-postcard--alive/g) || []).length, 1, `${code}: city detail thumbnail opts into motion`);
  assert.match(figure, /class="scenery-weather scenery-weather--[a-z]+" aria-hidden="true" pointer-events="none"/, `${code}: ambient motion is decorative and does not intercept clicks`);
  assert.ok(html.includes(CITY_LOCAL_NAMES[code].text), `${code}: local name appears in the page`);
  const tags = html.match(/<ul class="place-tags"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(tags, `${code}: icon tags render`);
  const tagCount = (tags.match(/<li>/g) || []).length;
  assert.ok(tagCount >= 1 && tagCount <= 6, `${code}: rendered tag count stays in bounds`);
  assert.ok(html.indexOf('class="place-native-name"') < html.indexOf('class="place-postcard') && html.indexOf('class="place-tags"') < html.indexOf('class="place-postcard'), `${code}: native name and tags appear above the illustration`);
}
for (const [code, landmarks] of Object.entries({
  delhi: ['Qutub Minar', 'Lal Qila', 'Parliament', 'India Gate'],
  jaipur: ['Hawa Mahal', 'Amer Fort', 'Jaigarh’s hilltop walls'],
})) {
  const html = await readFile(new URL(`../dist/cities/${code}/index.html`, import.meta.url), 'utf8');
  for (const landmark of landmarks) assert.ok(html.includes(`data-landmark="${landmark}"`), `${code}: ${landmark} rendered`);
}
const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(home, /place-postcard--alive|class="scenery-weather/, 'Homepage thumbnails do not opt into detail-page motion');
const directory = await readFile(new URL('../dist/find/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(directory, /place-postcard--alive|class="scenery-weather/, 'City directory thumbnails do not opt into detail-page motion');
const tripPaths = [...home.matchAll(/<a\b[^>]*href="(\/supertrips\/[^"#?]+)"/g)].map(match => match[1]);
for (const tripPath of tripPaths) {
  const html = await readFile(new URL(`../dist${tripPath}/index.html`, import.meta.url), 'utf8');
  assert.equal((html.match(/place-postcard--alive/g) || []).length, 1, `${tripPath}: only the active city thumbnail opts into motion`);
  assert.match(html, /class="scenery-weather scenery-weather--[a-z]+" aria-hidden="true" pointer-events="none"/, `${tripPath}: ambient motion is decorative and does not intercept clicks`);
}
assert.match(home, /class="app-hero"[\s\S]*?class="app-atlas"[\s\S]*?<\/section>/, 'Homepage hero includes the India city map');
assert.equal((home.match(/class="app-atlas"/g) || []).length, 1, 'The homepage has one combined hero map');
assert.doesNotMatch(home, /Every stop, on the map\.|Pick a dot\. See where it takes you\.|class="app-cities-map-section"/, 'The separate bottom map section is removed');
assert.ok(home.indexOf('id="routes"') < home.indexOf('id="places"') && home.indexOf('id="places"') < home.indexOf('id="field-notes"'), 'City collection follows the routes and precedes field notes');
assert.match(home, /id="home-group-by"/, 'Homepage offers a grouping selector');
assert.match(home, /id="home-group-filter"/, 'Homepage offers a group filter');
assert.doesNotMatch(home, /app-directory-section|Make it your own|Where to next\?|Places, state by state\./, 'The redundant directory and state-only introduction are removed');
assert.equal((home.match(/class="app-city-postcard"/g) || []).length, Object.keys(CITIES).length, 'Every city has artwork in the homepage collection');
for (const [card] of home.matchAll(/<li class="app-city-postcard"[\s\S]*?<\/li>/g)) {
  const code = card.match(/href="\/cities\/([^"]+)"/)?.[1];
  assert.ok(CITIES[code], 'Each homepage postcard links to its city');
  const localName = CITY_LOCAL_NAMES[code];
  assert.ok(card.includes(`lang="${localName.lang}" dir="${localName.dir}">${localName.text}</span>`), `${code}: homepage uses its local name, language and direction`);
  assert.doesNotMatch(card, /class="place-tags"/, `${code}: homepage thumbnails have no icon tags`);
  assert.ok(card.indexOf('class="place-native-name"') < card.indexOf('<figure'), `${code}: local lettering above the image`);
  assert.doesNotMatch(card, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/, `${code}: city and category links are independent`);
}
for (const state of Object.values(STATES)) {
  const group = home.split(`aria-labelledby="home-state-${state.slug}"`)[1]?.split('</section>')[0];
  assert.ok(group, `${state.label}: homepage has a state group`);
  for (const code of state.cities) assert.ok(group.includes(`href="/cities/${code}"`), `${code}: linked under its state`);
}
assert.equal((home.match(/class="app-route-art"/g) || []).length, 10, 'Every journey has an illustrated cover');
assert.deepEqual(Object.keys(JOURNEY_FOOD).sort(), TRIPS.map(trip => trip.name).sort(), 'Every journey has an explicit food cover');
assert.equal(new Set(Object.values(JOURNEY_FOOD).map(art => art.dish)).size, 10, 'The ten journeys have distinct food illustrations');
const foodCovers = [...home.matchAll(/<figure class="journey-food"[\s\S]*?<\/figure>/g)];
assert.equal(foodCovers.length, 10, 'All ten food illustrations render on the homepage');
for (const [index, trip] of TRIPS.entries()) {
  const art = JOURNEY_FOOD[trip.name];
  assert.ok(trip.cities.some(city => city.code === art.city), `${trip.name}: its food comes from a stop on the route`);
  assert.ok(foodCovers[index][0].includes(`data-dish="${art.dish}"`), `${trip.name}: the correct food illustration renders`);
  assert.match(foodCovers[index][0], /role="img" aria-label="[^"]+"/, `${trip.name}: food art has a description`);
  assert.doesNotMatch(foodCovers[index][0], /NaN|undefined|place-postcard|<figcaption|<text[\s>]/, `${trip.name}: food art has no scenery, captions or invalid geometry`);
}
for (const figure of home.matchAll(/<figure class="place-postcard[\s\S]*?<\/figure>/g)) {
  assert.doesNotMatch(figure[0], /<figcaption|<text[\s>]/, 'Homepage artwork has no visible captions or labels');
}
assert.doesNotMatch(home, /Pause motion|Pause animations|Resume animations/, 'Homepage has no motion control');
console.log('Artwork: all 128 cities and the homepage render their scenes; captions and motion controls are absent.');
