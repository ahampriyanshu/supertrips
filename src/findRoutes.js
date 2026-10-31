import { CATEGORIES, REGIONS, STATES } from './data.js';
import { CITY_COLLECTION_VIEWS } from './cityCollection.js';

const sources = { state: STATES, region: REGIONS, category: CATEGORIES };
const directories = { state: 'states', region: 'regions', category: 'categories' };

// Old category codes, URLs and bookmarks still open the merged collection.
const categoryAliases = {
  backpacker: 'in_transit',
  base_camp: 'in_transit',
  'base-camp': 'in_transit',
  forts_palaces: 'heritage',
  'forts-and-palaces': 'heritage',
  monuments_museums: 'heritage',
  'monuments-and-museums': 'heritage',
  scenic: 'nature',
  'temple-tour': 'pilgrimage',
  temple_tour: 'pilgrimage',
};

function normalizeSelection(groupBy = 'state', value = 'all') {
  if (!Object.hasOwn(CITY_COLLECTION_VIEWS, groupBy)) groupBy = 'state';
  if (groupBy === 'category' && Object.hasOwn(categoryAliases, value)) value = categoryAliases[value];
  const slug = sources[groupBy][value]?.slug || value.replace(/_/g, '-');
  const selectedGroup = CITY_COLLECTION_VIEWS[groupBy].groups.some(group => group.slug === slug) ? slug : 'all';
  return { groupBy, selectedGroup };
}

export function getFindSelection(search = '', hash = '') {
  const params = new URLSearchParams(search);
  const anchor = hash.match(/^#(state|region|category)-(.+)$/);
  return normalizeSelection(anchor?.[1] || params.get('by') || 'state', anchor?.[2] || params.get('place') || 'all');
}

export function getFindHref(groupBy = 'state', selectedGroup = 'all') {
  const selection = normalizeSelection(groupBy, selectedGroup);
  const params = new URLSearchParams();
  if (selection.groupBy !== 'state' || selection.selectedGroup !== 'all') params.set('by', selection.groupBy);
  if (selection.selectedGroup !== 'all') params.set('place', selection.selectedGroup);
  return `/find${params.size ? `?${params}` : ''}`;
}

export const LEGACY_FIND_ROUTES = [
  { path: '/cities', destination: '/find' },
  ...Object.entries(sources).flatMap(([groupBy, groups]) => [
    { path: `/${directories[groupBy]}`, destination: getFindHref(groupBy) },
    ...Object.entries(groups).flatMap(([code, group]) => [...new Set([code, group.slug])].map(value => ({
      path: `/${directories[groupBy]}/${value}`,
      destination: getFindHref(groupBy, group.slug),
    }))),
  ]),
  ...Object.entries(categoryAliases).map(([alias, category]) => ({
    path: `/categories/${alias}`,
    destination: getFindHref('category', category),
  })),
];

export function getLegacyFindHref(pathname, search = '', hash = '') {
  const legacy = LEGACY_FIND_ROUTES.find(route => route.path === pathname.replace(/\/+$/, ''));
  if (!legacy) return null;
  const [path, query = ''] = legacy.destination.split('?');
  const params = new URLSearchParams(query);
  for (const [key, value] of new URLSearchParams(search)) {
    if (!params.has(key)) params.append(key, value);
  }
  return `${path}${params.size ? `?${params}` : ''}${hash}`;
}
