import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { CITIES } from '../src/data.js';
import { LEGACY_FIND_ROUTES, getFindHref, getFindSelection, getLegacyFindHref } from '../src/findRoutes.js';

const readBuilt = file => readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const directory = await readBuilt('find/index.html');
const sitemap = await readBuilt('sitemap.xml');
assert.match(directory, /<h1[^>]*>Find your next stop\.<\/h1>/);
assert.doesNotMatch(directory, /class="app-masthead"|aria-label="Main navigation"/, 'Find has no main navbar');
assert.equal((directory.match(/class="app-city-postcard"/g) || []).length, Object.keys(CITIES).length);
assert.match(directory, /id="find-group-by"/);
assert.match(directory, /id="find-group-filter"/);
assert.match(directory, /Explore on the map/);
assert.match(sitemap, /\/find<\/loc>/);
assert.doesNotMatch(sitemap, /\/(?:categories|states|regions)(?:\/|<)|\/cities<\/loc>/, 'Only the unified browse page is indexed');

assert.equal(getFindHref(), '/find');
assert.equal(getFindHref('state', 'tamil_nadu'), '/find?by=state&place=tamil-nadu');
assert.equal(getFindHref('category', 'forts_palaces'), '/find?by=category&place=forts-and-palaces');
assert.deepEqual(getFindSelection('?by=category&place=coastal'), { groupBy: 'category', selectedGroup: 'coastal' });
assert.deepEqual(getFindSelection('', '#state-tamil_nadu'), { groupBy: 'state', selectedGroup: 'tamil-nadu' });
assert.deepEqual(getFindSelection('?by=region&place=western'), { groupBy: 'region', selectedGroup: 'western' });
assert.deepEqual(getFindSelection('?by=unknown&place=missing'), { groupBy: 'state', selectedGroup: 'all' });
assert.deepEqual(getFindSelection('?by=category&place=missing'), { groupBy: 'category', selectedGroup: 'all' });
assert.deepEqual(getFindSelection('?by=__proto__&place=constructor'), { groupBy: 'state', selectedGroup: 'all' });
assert.equal(getLegacyFindHref('/cities/kurseong'), null, 'City detail URLs remain unchanged');
assert.equal(getLegacyFindHref('/supertrips/braj-kashi-and-kalinga'), null, 'Trip detail URLs remain unchanged');
assert.equal(getLegacyFindHref('/xyz'), null, 'Unknown URLs still reach the not-found page');

for (const { path, destination } of LEGACY_FIND_ROUTES) {
  const redirect = await readBuilt(`${path.slice(1)}/index.html`);
  assert.match(redirect, /name="robots" content="noindex, follow"/);
  assert.ok(redirect.includes(`content="0; url=${destination.replaceAll('&', '&amp;')}"`), `${path}: no-script fallback`);
  assert.equal(getLegacyFindHref(`${path}/`), destination, `${path}: client redirect`);
  for (const hash of ['', '#region-western', '#category-coastal', '#state-tamil_nadu']) {
    let actual;
    runInNewContext(redirect.match(/<script>(.*?)<\/script>/s)[1], {
      URL, URLSearchParams,
      window: { location: {
        href: `https://supertrips.example${path}?source=bookmark${hash}`,
        search: '?source=bookmark', hash, replace: value => { actual = value; },
      } },
    });
    assert.equal(actual, getLegacyFindHref(path, '?source=bookmark', hash), `${path}: static and client redirects agree`);
    const url = new URL(actual, 'https://supertrips.example');
    assert.equal(url.pathname, '/find');
    assert.equal(url.searchParams.get('source'), 'bookmark');
    if (hash) assert.deepEqual(getFindSelection(url.search, url.hash), getFindSelection('', hash));
  }
}

for (const code of Object.keys(CITIES)) {
  const html = await readBuilt(`cities/${code}/index.html`);
  assert.doesNotMatch(html, /href="\/(?:cities#|categories|states|regions)/, `${code}: metadata and tags use Find`);
  assert.match(html, /href="\/find\?by=state(?:&amp;place=|"|&place=)/, `${code}: state links open Find`);
}
console.log(`Find: all cities, navbar removal, filters, ${LEGACY_FIND_ROUTES.length} legacy redirects, links and sitemap pass.`);
