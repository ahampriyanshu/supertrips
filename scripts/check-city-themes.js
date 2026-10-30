import assert from 'node:assert/strict';
import { CITIES, TRIPS } from '../src/data.js';
import { getCityTheme, getThemeStyle } from '../src/themes/cityThemes.js';
import { CITY_ILLUSTRATIONS } from '../src/themes/cityIllustrations.js';
import { CITY_LOCAL_NAMES, getCityTags } from '../src/themes/cityIdentity.js';

assert.deepEqual(Object.keys(CITY_ILLUSTRATIONS).sort(), Object.keys(CITIES).sort(), 'Every existing city gets an explicit illustration');
assert.deepEqual(Object.keys(CITY_LOCAL_NAMES).sort(), Object.keys(CITIES).sort(), 'Every city has an explicit local name');

const luminance = hex => {
  const channels = hex.slice(1).match(/../g).map(value => {
    const n = parseInt(value, 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

// Every existing URL and trip stop needs a valid, readable theme, including
// standalone city records (which do not carry a `code` field).
for (const [code, city] of Object.entries(CITIES)) {
  const theme = getCityTheme(city);
  assert.equal(theme.id, code);
  assert.deepEqual(theme, getCityTheme({ ...city, code }));
  assert.ok(theme.scene && theme.icon && theme.motion && theme.caption);
  assert.ok(theme.illustration.kind && theme.illustration.setting && theme.illustration.description);
  const localName = CITY_LOCAL_NAMES[code];
  assert.ok(localName.text.trim() && localName.lang && ['ltr', 'rtl'].includes(localName.dir), `${code}: local name and writing direction`);
  const tags = getCityTags(city, theme);
  assert.ok(tags.length >= 1 && tags.length <= 6, `${code}: one to six tags`);
  assert.equal(tags[0].icon, theme.icon, `${code}: original city symbol is retained below the artwork`);
  assert.equal(new Set(tags.map(tag => tag.id)).size, tags.length, `${code}: no duplicate tags`);
  assert.ok(tags.every(tag => tag.label && tag.icon), `${code}: tags have meaningful labels and symbols`);
  for (const text of ['ink', 'muted', 'accent']) {
    for (const surface of ['paper', 'card']) {
      assert.ok(contrast(theme[text], theme[surface]) >= 4.5, `${code}: ${text} on ${surface}`);
    }
  }
  assert.equal(getThemeStyle(theme)['--td-paper'], theme.paper);
}
for (const trip of TRIPS) {
  for (const city of trip.cities) assert.equal(getCityTheme(city).id, city.code);
}

const themeFor = code => getCityTheme(CITIES[code]);
assert.equal(themeFor('gurugram').scene, 'tech');
assert.equal(themeFor('mathura').scene, 'braj');
assert.equal(themeFor('varanasi').scene, 'ghats');
assert.equal(themeFor('kolkata').scene, 'tram');
assert.equal(themeFor('puri-konark').scene, 'temple-coast');
assert.equal(themeFor('noida').scene, 'towers');
assert.equal(themeFor('srinagar').motion, 'snow');
assert.equal(themeFor('jaisalmer').motion, 'sand');
assert.equal(themeFor('wayanad').motion, 'rain');
assert.equal(themeFor('wayanad-vyithri').motion, 'rain');
assert.equal(themeFor('coimbatore').illustration.kind, 'adiyogi');
assert.equal(CITY_LOCAL_NAMES.coimbatore.text, 'கோயம்புத்தூர்');
assert.equal(CITY_LOCAL_NAMES.srinagar.dir, 'rtl');
assert.equal(CITY_LOCAL_NAMES.kurseong.lang, 'ne');
assert.equal(getCityTags(CITIES.keylong, themeFor('keylong')).length, 1, 'A city without categories still has its character tag');
assert.equal(getCityTags(CITIES.kochi, themeFor('kochi')).length, 6, 'A city with many categories is capped at six tags');
assert.equal(themeFor('kutchh').illustration.kind, 'salt-rann');
assert.equal(themeFor('gulmarg').illustration.kind, 'gondola');
assert.equal(themeFor('srinagar').illustration.kind, 'shikara');
// These share a state but must keep their own character.
assert.notEqual(themeFor('mathura').paper, themeFor('noida').paper);
assert.notEqual(themeFor('varanasi').scene, themeFor('agra').scene);
// Distinct cities must never fall back to the same generic palace again.
for (const attribute of ['scene', 'paper', 'icon', 'motion', 'caption']) {
  assert.notEqual(themeFor('delhi')[attribute], themeFor('jaipur')[attribute], `Delhi and Jaipur: ${attribute}`);
}
assert.deepEqual(themeFor('delhi').landmarks, ['Lal Qila', 'Qutub Minar', 'Parliament', 'India Gate']);
assert.deepEqual(themeFor('jaipur').landmarks, ['Hawa Mahal', 'Amer Fort', 'Jaigarh’s hilltop walls']);
assert.notEqual(themeFor('udaipur').scene, themeFor('jaipur').scene);
assert.notEqual(getCityTheme({ city: 'Another Rajasthan stop', state: 'rajasthan' }).scene, 'jaipur');
assert.ok(!themeFor('mayapur').caption.includes('Yamuna'));
assert.equal(getCityTheme({ city: 'A new stop', state: 'kerala', category: [] }).scene, 'forest');
assert.ok(getCityTheme(null).paper);
assert.ok(getCityTheme({ city: 'Somewhere new', category: [] }).paper);
console.log(`City themes: all ${Object.keys(CITIES).length} cities and ${TRIPS.length} trips covered; text contrast passes.`);
