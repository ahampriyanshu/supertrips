import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { TRIPS } from '../src/data.js';

const readBuilt = file => readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const home = await readBuilt('index.html');
const sitemap = await readBuilt('sitemap.xml');
const tripPaths = [...home.matchAll(/<a\b[^>]*href="(\/supertrips\/[^"#?]+)"/g)].map(match => match[1]);

assert.equal(tripPaths.length, TRIPS.length, 'Every journey card uses a supertrips URL');
assert.equal(new Set(tripPaths).size, TRIPS.length, 'Every trip has a distinct URL');
assert.equal(tripPaths[0], '/supertrips/braj-kashi-and-kalinga');
assert.doesNotMatch(home, /\/routes\//, 'Homepage links and structured data use the new URLs');
assert.doesNotMatch(sitemap, /\/routes\//, 'Legacy URLs are excluded from the sitemap');

for (const [index, tripPath] of tripPaths.entries()) {
  assert.match(tripPath, /^\/supertrips\/[a-z0-9-]+$/);
  const html = await readBuilt(`${tripPath.slice(1)}/index.html`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).pathname, tripPath, 'Trip canonical uses the new URL');
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), 'New trip URL is indexed');
  assert.ok(html.replace(/<!--.*?-->/g, '').includes(`Supertrip ${String(index + 1).padStart(2, '0')}`), 'Navbar uses the new label');
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(jsonLd['@graph'].find(item => item['@type'] === 'Trip').url, canonical);

  const legacyPath = tripPath.replace('/supertrips/', '/routes/');
  const redirect = await readBuilt(`${legacyPath.slice(1)}/index.html`);
  assert.ok(redirect.includes(`content="0; url=${tripPath}"`), 'Legacy page has a no-JavaScript redirect');
  assert.ok(redirect.includes(`href="${canonical}"`), 'Legacy page points to the new canonical');
  let destination;
  runInNewContext(redirect.match(/<script>(.*?)<\/script>/s)[1], {
    window: { location: { search: '?source=bookmark', hash: '#stop', replace: value => { destination = value; } } },
  });
  assert.equal(destination, `${tripPath}?source=bookmark#stop`, 'Redirect preserves query and fragment');
}

console.log(`Trip URLs: all ${TRIPS.length} pages, links, navbar labels, metadata and legacy redirects pass.`);
