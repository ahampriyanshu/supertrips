import assert from 'node:assert/strict';
import { CATEGORIES, CITIES } from '../src/data.js';
import { CITY_COLLECTION_VIEWS, getCityCollection } from '../src/cityCollection.js';

assert.deepEqual(Object.keys(CITY_COLLECTION_VIEWS), ['state', 'region', 'category']);
for (const mode of ['state', 'region', 'category']) {
  const collection = getCityCollection(mode);
  assert.equal(collection.cityCount, 128, `${mode}: the complete collection counts each city once`);
  assert.deepEqual([...new Set(collection.groups.flatMap(group => group.cities))].sort(), Object.keys(CITIES).sort(), `${mode}: every city remains discoverable`);
  assert.equal(new Set(collection.groups.map(group => group.slug)).size, collection.groups.length, `${mode}: filters are unambiguous`);
}

assert.equal(getCityCollection('state', 'kerala').cityCount, 12);
assert.equal(getCityCollection('region', 'western').cityCount, 16);
const coastal = getCityCollection('category', 'coastal');
assert.equal(coastal.groups.length, 1);
assert.ok(coastal.groups[0].cities.includes('kochi') && coastal.groups[0].cities.includes('puri-konark'));
assert.ok(!coastal.groups[0].cities.includes('jaipur'));
assert.ok(getCityCollection('category', 'other-stops').groups[0].cities.includes('keylong'), 'Uncategorised cities remain available');
const categories = getCityCollection('category');
assert.equal(getCityCollection('category', 'in-transit').cityCount, 64, 'Transit includes the merged categories and both Kashmir transit stops without duplicates');
assert.equal(getCityCollection('category', 'heritage').cityCount, 67, 'Heritage includes the union of forts, palaces, monuments and museums');
assert.equal(getCityCollection('category', 'nature').cityCount, 41, 'Nature includes Qazigund, formerly stored as scenic');
assert.equal(CATEGORIES.nature.label, 'Nature');
for (const code of ['backpacker', 'base_camp', 'forts_palaces', 'monuments_museums']) {
  assert.ok(!Object.hasOwn(CATEGORIES, code), `${code}: no separate filter remains`);
  assert.ok(Object.values(CITIES).every(city => !city.category.includes(code)), `${code}: city tags use the merged category`);
}
assert.ok(categories.groups.reduce((total, group) => total + group.cities.length, 0) > categories.cityCount, 'Overlapping categories do not inflate the city count');
console.log('City collection: all three grouping modes, specific filters and unique destination counts pass.');
