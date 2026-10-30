import { CATEGORIES, CITIES, REGIONS, STATES } from './data.js';

function collectionGroups(source) {
  const groups = Object.values(source).map(group => ({
    ...group,
    cities: [...new Set(group.cities)].filter(code => CITIES[code])
      .sort((a, b) => CITIES[a].city.localeCompare(CITIES[b].city)),
  })).filter(group => group.cities.length).sort((a, b) => a.label.localeCompare(b.label));
  const included = new Set(groups.flatMap(group => group.cities));
  const remaining = Object.keys(CITIES).filter(code => !included.has(code))
    .sort((a, b) => CITIES[a].city.localeCompare(CITIES[b].city));
  if (remaining.length) groups.push({ label: 'Other stops', slug: 'other-stops', cities: remaining });
  return groups;
}

export const CITY_COLLECTION_VIEWS = {
  state: { label: 'State', filterLabel: 'State or territory', allLabel: 'Every state & territory', plural: 'states & territories', groups: collectionGroups(STATES) },
  region: { label: 'Region', filterLabel: 'Region', allLabel: 'Every region', plural: 'regions', groups: collectionGroups(REGIONS) },
  category: { label: 'Category', filterLabel: 'Category', allLabel: 'Every category', plural: 'categories', groups: collectionGroups(CATEGORIES) },
};

export function getCityCollection(groupBy, selectedGroup = 'all') {
  const view = CITY_COLLECTION_VIEWS[groupBy];
  const groups = selectedGroup === 'all' ? view.groups : view.groups.filter(group => group.slug === selectedGroup);
  // Categories overlap, so count destinations rather than cards.
  const cityCount = new Set(groups.flatMap(group => group.cities)).size;
  return { view, groups, cityCount };
}
