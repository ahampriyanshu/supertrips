import { CITIES } from '../data.js';
import { CITY_ILLUSTRATIONS } from './cityIllustrations.js';

// These are memories of a place, not a live weather report. City choices win
// over landscape and state fallbacks, so two stops in one state can feel distinct.
const palettes = {
  circuit: { paper: '#e9eef4', card: '#f5f7fa', ink: '#293e58', accent: '#365c92', muted: '#566579', wash: '#bdccdf', secondary: '#688fab' },
  marigold: { paper: '#f6ecd8', card: '#fff9eb', ink: '#57432f', accent: '#96501f', muted: '#756044', wash: '#e9c37f', secondary: '#7c8970' },
  marble: { paper: '#f2e9e6', card: '#fcf7f3', ink: '#574546', accent: '#8a4f51', muted: '#756264', wash: '#d8c4bf', secondary: '#a78775' },
  lamplight: { paper: '#f1e4d8', card: '#fbf2e8', ink: '#543c3a', accent: '#884d35', muted: '#745d51', wash: '#d8b497', secondary: '#747f88' },
  bengal: { paper: '#f0e8e2', card: '#faf4ed', ink: '#523a38', accent: '#873d40', muted: '#75615b', wash: '#d7b8ac', secondary: '#597a6d' },
  sea: { paper: '#e7f0ed', card: '#f5faf6', ink: '#244c51', accent: '#306768', muted: '#526e6b', wash: '#b5d5cf', secondary: '#b78c52' },
  concrete: { paper: '#e9ebee', card: '#f6f7f8', ink: '#3a404a', accent: '#59616e', muted: '#626977', wash: '#cbd0d8', secondary: '#939caa' },
  sand: { paper: '#f2e2c6', card: '#fcf2de', ink: '#60452c', accent: '#8d4d24', muted: '#786044', wash: '#d7b27c', secondary: '#b78a4d' },
  winter: { paper: '#e7eff4', card: '#f7fafc', ink: '#334e63', accent: '#3c647e', muted: '#546a77', wash: '#b5cad9', secondary: '#819eaf' },
  moss: { paper: '#e4ece3', card: '#f4f7ee', ink: '#294f41', accent: '#36674a', muted: '#566e5b', wash: '#b8cdb5', secondary: '#80957a' },
  tea: { paper: '#e9ede2', card: '#f7f8ef', ink: '#43523c', accent: '#586b35', muted: '#646e53', wash: '#c1cbaa', secondary: '#8da4a5' },
  mountain: { paper: '#eee9e2', card: '#faf6f0', ink: '#51484b', accent: '#83504a', muted: '#716667', wash: '#cfc1b9', secondary: '#899b9c' },
  rose: { paper: '#f3e5df', card: '#fff5ed', ink: '#63473e', accent: '#9b503d', muted: '#7c6255', wash: '#deb5a1', secondary: '#a68562' },
  indigo: { paper: '#e7eaf1', card: '#f5f6fa', ink: '#3f4962', accent: '#4d5f8d', muted: '#626a7c', wash: '#bdc7de', secondary: '#8992b5' },
  delhi: { paper: '#eeeee4', card: '#f9f9f1', ink: '#374438', accent: '#874b3b', muted: '#626b58', wash: '#cea58c', secondary: '#78866a' },
  jaipur: { paper: '#f5e5dd', card: '#fff6ee', ink: '#603f35', accent: '#934632', muted: '#7b5c4f', wash: '#d8967a', secondary: '#b29157' },
  granite: { paper: '#e7ece7', card: '#f5f8f1', ink: '#354442', accent: '#446157', muted: '#59695f', wash: '#b1bfb0', secondary: '#8b9d79' },
  gold: { paper: '#f2ecdc', card: '#fff9eb', ink: '#59472f', accent: '#876027', muted: '#73644c', wash: '#d7b665', secondary: '#91a9a1' },
  salt: { paper: '#f1efe7', card: '#fcfbf5', ink: '#504b43', accent: '#78614b', muted: '#72695c', wash: '#d7c9b1', secondary: '#a6b7b6' },
};

const families = {
  tech: { palette: 'circuit', scene: 'tech', icon: 'laptop', motion: 'signal', caption: 'Glass towers & late-night lights', duration: 420 },
  braj: { palette: 'marigold', scene: 'braj', icon: 'flute', motion: 'petals', caption: 'Temple bells by the Yamuna', duration: 800 },
  marble: { palette: 'marble', scene: 'dome', icon: 'arch', motion: 'sun', caption: 'A little time, held in stone', duration: 700 },
  ghats: { palette: 'lamplight', scene: 'ghats', icon: 'lamp', motion: 'lamps', caption: 'Kashi evenings, Sarnath stillness', duration: 900 },
  bengal: { palette: 'bengal', scene: 'tram', icon: 'tram', motion: 'tram', caption: 'Tram lines & unhurried afternoons', duration: 850 },
  templeCoast: { palette: 'sea', scene: 'temple-coast', icon: 'wheel', motion: 'waves', caption: 'Temple bells & the sea', duration: 950 },
  towers: { palette: 'concrete', scene: 'towers', icon: 'building', motion: 'haze', caption: 'Tall windows. A quiet skyline.', duration: 600 },
  desert: { palette: 'sand', scene: 'dunes', icon: 'sun', motion: 'sand', caption: 'Sand, sandstone & a slower sun', duration: 1100 },
  snow: { palette: 'winter', scene: 'lake', icon: 'snow', motion: 'snow', caption: 'Snowfall, softly remembered', duration: 1000 },
  forest: { palette: 'moss', scene: 'forest', icon: 'leaf', motion: 'rain', caption: 'Rain on the leaves', duration: 950 },
  coast: { palette: 'sea', scene: 'coast', icon: 'shell', motion: 'waves', caption: 'Salt in the air, time to spare', duration: 950 },
  hills: { palette: 'tea', scene: 'hills', icon: 'tea', motion: 'mist', caption: 'A little mist, another cup', duration: 1100 },
  monastery: { palette: 'mountain', scene: 'monastery', icon: 'mountain', motion: 'wind', caption: 'Mountains & a moment of quiet', duration: 1000 },
  palace: { palette: 'rose', scene: 'palace', icon: 'arch', motion: 'sun', caption: 'Old walls, warm afternoon light', duration: 750 },
  river: { palette: 'sea', scene: 'river', icon: 'boat', motion: 'ripples', caption: 'A quiet bend in the river', duration: 1000 },
  temple: { palette: 'marigold', scene: 'temple', icon: 'bell', motion: 'petals', caption: 'Stone steps & temple bells', duration: 850 },
  city: { palette: 'indigo', scene: 'city', icon: 'window', motion: 'haze', caption: 'Another city, another chapter', duration: 650 },
  delhi: {
    palette: 'delhi', scene: 'delhi', icon: 'india-gate', motion: 'birds', duration: 850,
    caption: 'Red sandstone & winter afternoons',
    landmarks: ['Lal Qila', 'Qutub Minar', 'Parliament', 'India Gate'],
    sceneDescription: 'An illustrated Delhi skyline: the ramparts of Lal Qila, the five tiers of Qutub Minar, the triangular new Parliament and the arch of India Gate.',
  },
  jaipur: {
    palette: 'jaipur', scene: 'jaipur', icon: 'jharokha', motion: 'breeze', duration: 1100,
    caption: 'Jharokhas, hill forts & an evening breeze',
    landmarks: ['Hawa Mahal', 'Amer Fort', 'Jaigarh’s hilltop walls'],
    sceneDescription: 'An illustrated Jaipur postcard: Hawa Mahal’s five tiers of small arched jharokhas, Amer Fort on an ochre hillside and the ramparts of Jaigarh following the ridge. A kite moves gently overhead.',
  },
};

const cityChoices = {};
function assign(codes, family, extra = {}) {
  for (const code of codes.split(' ')) cityChoices[code] = { family, ...extra };
}
assign('gurugram', 'tech');
assign('bengaluru', 'tech', { palette: 'moss', caption: 'Garden shade & late-night lights' });
assign('mathura', 'braj');
assign('mayapur', 'braj', { caption: 'Temple bells & unhurried mornings' });
assign('agra', 'marble');
assign('varanasi', 'ghats');
assign('kolkata', 'bengal');
assign('puri-konark', 'templeCoast');
assign('noida', 'towers');
assign('jaisalmer sam bikaner bhuj kutchh', 'desert');
assign('srinagar gulmarg sonmarg baltal banihar-qazigund', 'snow');
assign('wayanad wayanad-vyithri coorg chikkamagaluru shillong dawki vagamon palakkad shivamogga', 'forest');
assign('darjeeling mirik kurseong ghoom kalimpong ooty munnar kodaikanal poombarai araku theni', 'hills');
assign('leh kargil keylong tawang pelling gangtok dharamshala-mcleod-ganj bir', 'monastery');
assign('manali kullu dalhousie banihal-udhampur', 'hills', { palette: 'winter' });
// Named landmark compositions belong to the city, never the whole state.
assign('delhi', 'delhi');
assign('jaipur', 'jaipur');
assign('udaipur kumbhalgarh chittorgarh mysore orchha gwalior lucknow hyderabad sambhajinagar vadodara', 'palace');
assign('jodhpur', 'palace', { palette: 'indigo', caption: 'Blue lanes & sandstone walls' });
assign('hampi', 'palace', { palette: 'sand', caption: 'Boulders, ruins & afternoon light' });
assign('alleppey kochi', 'river', { palette: 'moss', caption: 'Waterways & slow afternoons' });
assign('guwahati silchar tinsukia', 'river', { palette: 'tea' });
assign('bodh-gaya', 'monastery', { palette: 'marigold', caption: 'A pause beneath the leaves' });
assign('amritsar', 'temple', { caption: 'Golden light, quiet reflections' });
assign('somnath dwarka rameshwaram gokarna udupi kanyakumari mahabalipuram', 'templeCoast');
assign('prayagraj ayodhya', 'temple', { palette: 'lamplight' });
assign('madurai kanchipuram thanjavur tiruchirappalli tirupati srisailam thrissur deoghar shirdi nashik omkareshwar katra jammu ajmer-pushkar', 'temple');
assign('mumbai goa varkala trivandrum pondicherry chennai digha visakhapatnam mangalore kannur kozhikode', 'coast');
assign('coimbatore', 'forest', { palette: 'granite', scene: 'adiyogi', icon: 'crescent', motion: 'mist' });
assign('amritsar', 'temple', { palette: 'gold', motion: 'ripples' });
assign('bodh-gaya', 'temple', { palette: 'moss', motion: 'wind' });
assign('kutchh', 'desert', { palette: 'salt', motion: 'haze' });
assign('bikaner', 'palace', { palette: 'rose' });
assign('bhuj', 'palace', { palette: 'sand' });
assign('siliguri', 'hills', { icon: 'train' });
assign('kharagpur', 'city');
assign('mayapur', 'temple', { palette: 'indigo', motion: 'ripples' });
assign('khajuraho', 'temple', { palette: 'sand' });
assign('patna', 'river');

const stateChoices = {
  haryana: 'tech', uttar_pradesh: 'palace', west_bengal: 'bengal', odisha: 'templeCoast',
  delhi: 'palace', rajasthan: 'desert', gujarat: 'palace', punjab: 'city',
  jammu_kashmir: 'snow', ladakh: 'monastery', himachal_pradesh: 'hills', chandigarh: 'city',
  madhya_pradesh: 'palace', maharashtra: 'city', goa: 'coast', kerala: 'forest',
  tamil_nadu: 'temple', karnataka: 'forest', assam: 'river', meghalaya: 'forest',
  nagaland: 'hills', arunachal_pradesh: 'monastery', sikkim: 'monastery',
  andhra_pradesh: 'temple', telangana: 'palace', pondicherry: 'coast',
  bihar: 'palace', jharkhand: 'forest',
};
const codesByName = new Map(Object.entries(CITIES).map(([code, city]) => [city.city, code]));

function fallbackFamily(city) {
  const categories = city?.category || [];
  if (categories.includes('desert')) return 'desert';
  if (categories.includes('coastal')) return categories.includes('pilgrimage') ? 'templeCoast' : 'coast';
  if (categories.includes('hill_station')) return 'hills';
  if (categories.includes('pilgrimage')) return 'temple';
  if (categories.includes('metro')) return 'city';
  return stateChoices[city?.state] || 'city';
}

export function getCityTheme(city) {
  const code = city?.code || codesByName.get(city?.city);
  const choice = cityChoices[code] || { family: fallbackFamily(city) };
  const family = families[choice.family];
  const palette = palettes[choice.palette || family.palette];
  return { ...family, ...choice, ...palette, illustration: CITY_ILLUSTRATIONS[code], id: code || city?.state || 'traveller' };
}

export function getThemeStyle(theme) {
  return {
    '--td-paper': theme.paper,
    '--td-card': theme.card,
    '--td-ink': theme.ink,
    '--td-accent': theme.accent,
    '--td-muted': theme.muted,
    '--td-soft-text': theme.muted,
    '--td-border': `color-mix(in srgb, ${theme.ink} 18%, ${theme.paper})`,
    '--td-border-strong': `color-mix(in srgb, ${theme.ink} 30%, ${theme.paper})`,
    '--td-dark-line': `color-mix(in srgb, ${theme.paper} 30%, ${theme.ink})`,
    '--place-wash': theme.wash,
    '--place-secondary': theme.secondary,
    '--place-duration': `${theme.duration}ms`,
    '--place-easing': theme.scene === 'tech' ? 'cubic-bezier(.22,.7,.3,1)' : 'cubic-bezier(.4,0,.2,1)',
  };
}
