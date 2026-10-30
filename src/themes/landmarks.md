# City postcard references

These are original, simplified SVG drawings, arranged as travel-journal
compositions. Their relative positions and sizes are not a map. No downloaded
photographs, fonts or animation libraries are required at runtime.

## Delhi

The palette combines red sandstone, pale winter light and garden greens. The
bookplate includes all of the following, each with its own silhouette:

- **Lal Qila:** the Lahori Gate's paired towers, chhatris, battlements and pointed
  central entrance. [Delhi Tourism](https://www.delhitourism.gov.in/heritage/world_heritage_monuments.html).
- **Qutub Minar:** a tapering, fluted shaft, five storeys and projecting balconies.
  [Delhi Tourism](https://www.delhitourism.gov.in/tourist_place/qutab_minar.html).
- **Parliament:** the low, triangular **current Sansad Bhavan**, shown obliquely
  with a courtyard. This is not the circular former Parliament (Samvidhan Sadan).
  [Tata Projects, the building's contractor](https://www.tata.com/newsroom/business/ode-to-india-new-parliament-tata-projects).
- **India Gate:** the broad arch, tall piers and stepped cornice.
  [Delhi Tourism](https://www.delhitourism.gov.in/tourist_place/india_gate.html).

Only the birds move. The buildings and national flags remain still.

## Jaipur

Terracotta pink and ochre distinguish the city's façade and hill forts. Hawa
Mahal has five tiers of projecting, arched jharokhas with a rising central crown.
Amer Fort is rendered as a separate ochre courtyard complex, with Jaigarh's
fortifications following a higher ridge behind it.

- [Rajasthan Tourism — Jaipur](https://www.tourism.rajasthan.gov.in/jaipur.html)
- [Incredible India — Hawa Mahal](https://www.incredibleindia.gov.in/en/rajasthan/jaipur/hawa-mahal)
- [Incredible India — Amer Fort](https://www.incredibleindia.gov.in/en/rajasthan/jaipur/amber-fort)

The window pattern is an illustration, not a literal count of all 953 openings.
A small kite and a few breeze strokes provide the motion; the architecture
stays still. All scenery respects the device's reduced-motion preference.
There are no visible illustration captions or motion controls. SVG alternative
descriptions remain available to screen readers.

Keep these named scenes on their explicit city overrides. Do not use Delhi's
landmarks for all of Delhi state or Jaipur's landmarks for other Rajasthan stops.
Landscape fallbacks are intentionally separate from named landmark artwork.

## The rest of the collection

`cityIllustrations.js` gives every one of the 128 current cities an explicit
subject and landscape. The existing city index supplies the place associations.
Architecture and terrain are simplified, original drawings: shared drawing
primitives do not imply that two places have the same building. There are no
remote image requests, generated raster assets, or additional runtime packages.

Coimbatore uses Adiyogi at Isha, with a dark bust, closed eyes, flowing hair,
crescent and Velliangiri backdrop. Reference:
[Isha Yoga Center — Adiyogi](https://isha.sadhguru.org/en/center/consecrated-spaces/112-feet-adiyogi).

Amritsar's domes and sarovar follow
[Incredible India — Harmandir Sahib](https://www.incredibleindia.gov.in/en/punjab/amritsar/sri-harmandir-sahib-golden-temple).
Other deliberate distinctions include Kutch's flat salt landscape, Gulmarg's
gondola, Srinagar's shikara, the different temple roof forms of Tamil Nadu and
Kerala, and separate boat and net scenes for Alleppey and Kochi.

`npm run check:themes` checks city coverage and text contrast. After a build,
`npm run check:artwork` checks that every subject rendered and that no visible
caption or old motion control returns.
