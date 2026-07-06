import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const html = await readFile(path.join(rootDir, 'dist', 'index.html'), 'utf8');

assert.match(html, /<html[^>]*class="no-js"/, 'document starts in no-js mode');
assert.match(html, /document\.documentElement\.classList\.replace\('no-js', 'js'\)/, 'document switches to js mode before paint');
assert.match(html, /<div id="root">\s*<div class="app-root">/, 'static HTML contains the React app shell');
assert.doesNotMatch(html, /data-ssg-fallback/, 'static HTML is not a disposable fallback shell');

const mainBundle = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)?.[1];
assert.ok(mainBundle, 'built HTML references a module bundle');

const js = await readFile(path.join(rootDir, 'dist', mainBundle), 'utf8');
assert.match(js, /hydrateRoot/, 'client hydrates the static shell instead of remounting it');
