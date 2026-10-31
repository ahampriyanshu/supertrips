import { getFindHref } from '../findRoutes.js';
import { CATEGORIES } from '../data.js';

// City-level spellings, rather than a transliteration based only on the state.
// Roman-script local names are intentional. See city-identity-sources.md.
export const CITY_LOCAL_NAMES = {};
function names(lang, entries, dir = 'ltr') {
  for (const [code, text] of Object.entries(entries)) CITY_LOCAL_NAMES[code] = { text, lang, dir };
}

names('hi', {
  gurugram: 'गुरुग्राम', mathura: 'मथुरा', agra: 'आगरा', varanasi: 'वाराणसी',
  noida: 'नोएडा', delhi: 'दिल्ली', keylong: 'केलांग', manali: 'मनाली', kullu: 'कुल्लू',
  indore: 'इंदौर', omkareshwar: 'ओंकारेश्वर', orchha: 'ओरछा', jhansi: 'झाँसी',
  khajuraho: 'खजुराहो', prayagraj: 'प्रयागराज', ayodhya: 'अयोध्या', lucknow: 'लखनऊ',
  'bodh-gaya': 'बोधगया', deoghar: 'देवघर', gwalior: 'ग्वालियर', bhopal: 'भोपाल',
  dalhousie: 'डलहौज़ी', 'dharamshala-mcleod-ganj': 'धर्मशाला · मैक्लोडगंज', bir: 'बीड़', patna: 'पटना',
  itanagar: 'ईटानगर',
});
names('raj', {
  jaipur: 'जयपुर', chittorgarh: 'चित्तौड़गढ़', udaipur: 'उदयपुर', kumbhalgarh: 'कुम्भलगढ़',
  bikaner: 'बीकानेर', sam: 'सम', jaisalmer: 'जैसलमेर', jodhpur: 'जोधपुर', 'ajmer-pushkar': 'अजमेर · पुष्कर',
});
names('gu', {
  kevadiya: 'કેવડિયા', surat: 'સુરત', vadodara: 'વડોદરા', somnath: 'સોમનાથ', dwarka: 'દ્વારકા',
  rajkot: 'રાજકોટ', 'ahmedabad-gandhinagar': 'અમદાવાદ · ગાંધીનગર', bhuj: 'ભુજ', kutchh: 'કચ્છ',
});
names('pa', { ludhiana: 'ਲੁਧਿਆਣਾ', jalandhar: 'ਜਲੰਧਰ', amritsar: 'ਅੰਮ੍ਰਿਤਸਰ', pathankot: 'ਪਠਾਨਕੋਟ', chandigarh: 'ਚੰਡੀਗੜ੍ਹ' });
names('doi', { katra: 'कटड़ा', jammu: 'जम्मू', 'banihal-udhampur': 'उधमपुर' });
names('ks-Arab', { srinagar: 'سِریٖنَگَر' }, 'rtl');
names('ur', { 'banihar-qazigund': 'قاضی گنڈ', gulmarg: 'گلمرگ', sonmarg: 'سونہ مرگ', baltal: 'بال تل', kargil: 'کرگل' }, 'rtl');
names('lbj', { leh: 'གླེ་' });
names('bo', { tawang: 'རྟ་དབང་' });
names('mr', { nashik: 'नाशिक', shirdi: 'शिर्डी', sambhajinagar: 'संभाजीनगर', pune: 'पुणे', mumbai: 'मुंबई', nagpur: 'नागपूर' });
names('kok', { goa: 'गोंय' });
names('ml', {
  kochi: 'കൊച്ചി', alleppey: 'ആലപ്പുഴ', varkala: 'വർക്കല', trivandrum: 'തിരുവനന്തപുരം', vagamon: 'വാഗമൺ',
  wayanad: 'വയനാട്', munnar: 'മൂന്നാർ', thrissur: 'തൃശ്ശൂർ', palakkad: 'പാലക്കാട്',
  kannur: 'കണ്ണൂർ', kozhikode: 'കോഴിക്കോട്', 'wayanad-vyithri': 'വയനാട് · വൈത്തിരി',
});
names('ta', {
  coimbatore: 'கோயம்புத்தூர்', ooty: 'உதகமண்டலம்', rameshwaram: 'இராமேஸ்வரம்', madurai: 'மதுரை',
  kanchipuram: 'காஞ்சிபுரம்', pondicherry: 'புதுச்சேரி', chennai: 'சென்னை', kodaikanal: 'கொடைக்கானல்',
  poombarai: 'பூம்பாறை', theni: 'தேனி', mahabalipuram: 'மாமல்லபுரம்', thanjavur: 'தஞ்சாவூர்',
  tiruchirappalli: 'திருச்சிராப்பள்ளி', kanyakumari: 'கன்னியாகுமரி',
});
names('kn', {
  mysore: 'ಮೈಸೂರು', bengaluru: 'ಬೆಂಗಳೂರು', shivamogga: 'ಶಿವಮೊಗ್ಗ', coorg: 'ಕೊಡಗು', chikkamagaluru: 'ಚಿಕ್ಕಮಗಳೂರು',
  hampi: 'ಹಂಪಿ', gokarna: 'ಗೋಕರ್ಣ', udupi: 'ಉಡುಪಿ', mangalore: 'ಮಂಗಳೂರು',
});
names('te', { tirupati: 'తిరుపతి', srisailam: 'శ్రీశైలం', hyderabad: 'హైదరాబాద్', visakhapatnam: 'విశాఖపట్నం', araku: 'అరకు' });
names('as', { guwahati: 'গুৱাহাটী', tinsukia: 'তিনিচুকীয়া' });
names('bn', { silchar: 'শিলচর', kolkata: 'কলকাতা', siliguri: 'শিলিগুড়ি', digha: 'দিঘা', kharagpur: 'খড়্গপুর', mayapur: 'মায়াপুর' });
names('or', { 'puri-konark': 'ପୁରୀ · କୋଣାର୍କ', cuttack: 'କଟକ' });
names('ne', { darjeeling: 'दार्जिलिङ', pelling: 'पेलिङ', gangtok: 'गान्तोक', mirik: 'मिरिक', kurseong: 'खरसाङ', ghoom: 'घुम', kalimpong: 'कालिम्पोङ' });
names('kha', { shillong: 'Shillong', dawki: 'Dawki' });
names('nag', { dimapur: 'Dimapur' });
names('njm', { kohima: 'Kewhira' });

const categoryIcons = {
  coastal: 'shell', desert: 'sun', food: 'food', heritage: 'arch',
  hill_station: 'mountain', metro: 'building', in_transit: 'train',
  nature: 'leaf', pilgrimage: 'bell', border_town: 'flag',
};
const familyTags = {
  tech: ['Technology', 'metro'], braj: ['Braj', 'pilgrimage'], marble: ['Architecture', 'heritage'],
  ghats: ['Ghats', 'pilgrimage'], bengal: ['Culture', 'heritage'], templeCoast: ['Temple coast', 'coastal'],
  towers: ['City life', 'metro'], desert: ['Desert', 'desert'], snow: ['Himalayas', 'hill_station'],
  forest: ['Nature', 'nature'], coast: ['Coastal', 'coastal'], hills: ['Hill country', 'hill_station'],
  monastery: ['Mountains', 'hill_station'], palace: ['Heritage', 'heritage'], river: ['Waterways', 'nature'],
  temple: ['Pilgrimage', 'pilgrimage'], city: ['City life', 'metro'], delhi: ['Capital', 'metro'], jaipur: ['Pink City', 'heritage'],
};
const cityTags = { coimbatore: ['Yoga', null], kutchh: ['Salt desert', 'desert'], hampi: ['Ruins', 'heritage'], siliguri: ['In Transit', 'in_transit'] };

export function getCityTags(city, theme) {
  const cityCode = city?.code || theme.id;
  // Use the same membership as Find, so a tag always leads back to this city.
  const categories = Object.keys(CATEGORIES).filter(code => CATEGORIES[code].cities.includes(cityCode));
  const [label, primaryCategory] = cityTags[theme.id] || familyTags[theme.family] || ['A place to wander', null];
  if (!categories.length) {
    return [{ id: 'other-stops', label: 'Other stops', icon: 'pin', href: getFindHref('category', 'other-stops') }];
  }
  const ordered = categories.includes(primaryCategory)
    ? [primaryCategory, ...categories.filter(code => code !== primaryCategory)]
    : categories;
  return ordered.slice(0, 6).map(code => ({
    id: code,
    label: code === primaryCategory ? label : CATEGORIES[code].label,
    icon: code === primaryCategory && theme.icon !== 'tea' ? theme.icon : categoryIcons[code],
    href: getFindHref('category', code),
  }));
}
