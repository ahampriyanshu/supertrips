import '../themes/journeyFood.css';

function Plate({ x = 315, y = 250, width = 420, height = 112, children }) {
  return <g>
    <ellipse className="food-shadow" cx={x + 5} cy={y + 20} rx={width / 2} ry={height / 2} />
    <ellipse className="food-ceramic" cx={x} cy={y} rx={width / 2} ry={height / 2} />
    <ellipse className="food-fine" cx={x} cy={y - 2} rx={width / 2 - 13} ry={height / 2 - 10} />
    {children}
  </g>;
}

function Bowl({ x, y, width = 104, height = 45, clay = false, filling = 'food-curry', children }) {
  const radius = width / 2;
  return <g transform={`translate(${x} ${y})`}>
    <path className={clay ? 'food-clay' : 'food-ceramic'} d={`M-${radius} 0Q-${radius - 8} ${height} 0 ${height}Q${radius - 8} ${height} ${radius} 0Z`} />
    <path className="food-fine" d={`M-${radius - 11} 18Q0 ${height + 8} ${radius - 11} 18`} />
    <ellipse className={clay ? 'food-clay' : 'food-ceramic'} rx={radius} ry={width * .19} />
    <ellipse className={filling} cy="-1" rx={radius - 5} ry={width * .15} />
    {children}
  </g>;
}

function Steam({ x, y }) {
  return <g className="food-steam" transform={`translate(${x} ${y})`}>
    <path d="M-13 0c-13-15 14-19 1-36M8-6c-12-13 12-19 2-31" />
  </g>;
}

function Chai({ x, y }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse className="food-shadow" cy="82" rx="46" ry="12" />
    <path className="food-clay" d="M-39 0l10 73q28 17 57 0L39 0Z" />
    <path className="food-fine" d="M-35 19q35 14 70 0M-33 35q33 12 66 0M-31 56q31 12 62 0M-27 70q27 10 54 0" />
    <ellipse className="food-clay" rx="39" ry="13" />
    <ellipse className="food-tea" cy="-1" rx="33" ry="9" />
    <path className="food-highlight" d="M-24-3q12-6 27-3" />
    <Steam x={0} y={-28} />
  </g>;
}

function BananaLeaf() {
  return <g>
    <path className="food-shadow" d="M83 207q223-71 477-7l-22 97q-225 47-431-9Z" />
    <path className="food-leaf" d="M80 186q217-64 480-8l-23 109q-224 39-432-11Z" />
    <path className="food-leaf-vein" d="M91 229q230-22 458 6M149 223l-11-48m20 48-27 59m88-62-9-56m17 57-25 72m80-74-1-59m7 61-21 77m75-76 4-61m3 63-15 74m67-72 8-58m1 60-10 67m59-61 8-58m2 61-7 48" />
  </g>;
}

function Baati({ x, y, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path className="food-bread" d="M-43 7c-8-32 10-52 42-53 31-1 53 20 47 46-5 26-28 37-53 32-20-1-32-10-36-25Z" />
    <path className="food-toast" d="M-30-14q4-19 23-20l-6 10Zm41 31q17-3 23-18l-1 13-16 12Z" />
    <path className="food-fine" d="m-19-24 16 15-8 12m8-12 23-10m-23 10 7 21m-32-7 4 3m43-31 4 4M-20 14l4 2" />
  </g>;
}

function Jalebi({ x, y, scale = 1, rotation = 0 }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    <path className="food-jalebi-outline" d="M-23 8C-42-7-20-30-3-15 13 0-13 19-20 4-29-13-4-35 14-21 36-3 2 24-3 7-8-10 22-25 32-6 45 17 13 37-3 25-20 13-8-8 7-5 26-2 20 26 2 28-25 32-42 15-23 8Z" />
    <path className="food-jalebi" d="M-23 8C-42-7-20-30-3-15 13 0-13 19-20 4-29-13-4-35 14-21 36-3 2 24-3 7-8-10 22-25 32-6 45 17 13 37-3 25-20 13-8-8 7-5 26-2 20 26 2 28-25 32-42 15-23 8Z" />
  </g>;
}

function Chickpeas({ dark = false }) {
  return <g className={dark ? 'food-chickpea-dark' : 'food-chickpea'}>
    {[[-30, -4], [-17, 6], [-9, -9], [4, 2], [20, -7], [30, 5], [7, 12]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6" ry="4.5" />)}
    <path className="food-herb-line" d="m-13-10 8-4 8 5m-8-5 1 9m17-2 7-4 4 6" />
  </g>;
}

function BedaiBreakfast() {
  return <>
    <path className="food-cloth" d="m102 220 201-81 111 117-181 71Z" />
    <path className="food-fine" d="m116 222 119 93m-97-103 123 90" />
    <Plate x={278} y={244} width={366} height={111} />
    <g transform="translate(236 206) scale(1.6 .85)"><Baati x={0} y={0} /></g>
    <g transform="translate(182 240) scale(1.25 .82)"><Baati x={0} y={0} /></g>
    <Jalebi x={329} y={222} scale={1.05} rotation={-8} />
    <Jalebi x={359} y={253} scale={.95} rotation={17} />
    <Chai x={478} y={146} />
    <path className="food-fine" d="m389 284 5-2m-15 8 3 1m26-17 3 2" />
  </>;
}

function KhandviRoll({ x, y, rotation = 0 }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <path className="food-khandvi" d="M0-19 61-41c25 4 30 34 6 46L0 27Z" />
    <path className="food-khandvi-fold" d="m7-11 57-24m-48 47 51-21" />
    <ellipse className="food-khandvi-face" cy="4" rx="18" ry="23" />
    <path className="food-khandvi-fold" d="M-7 17C-22 2-4-21 10-10 26 7 3 26-4 14-10 5 2-3 7 2q5 8-3 9" />
    <path className="food-coconut" d="m23-17 8 4m8-15 6 4m7-10 7 2m-27 13 5-3" />
    <g className="food-mustard"><circle cx="18" cy="-8" r="2" /><circle cx="42" cy="-20" r="2.2" /><circle cx="57" cy="-12" r="1.8" /></g>
  </g>;
}

function Khandvi() {
  return <>
    <path className="food-shadow" d="m100 233 304-88 138 107-316 79Z" />
    <path className="food-steel" d="m99 216 302-83q9-2 16 4l118 93q8 8-4 14l-303 77q-8 2-16-4L95 231q-8-8 4-15Z" />
    <path className="food-tray-inset" d="m118 222 285-77 109 90-286 72Z" />
    <KhandviRoll x={195} y={203} rotation={-5} />
    <KhandviRoll x={275} y={184} rotation={-2} />
    <KhandviRoll x={356} y={184} rotation={9} />
    <KhandviRoll x={223} y={255} rotation={-4} />
    <KhandviRoll x={306} y={247} rotation={4} />
    <KhandviRoll x={391} y={246} rotation={10} />
    <path className="food-herb" d="M300 191q-29 4-29-15 23-8 29 15Zm0 0q6-24 25-19-2 19-25 19Zm69 53q-27 3-25-15 22-5 25 15Zm0 0q9-23 26-14-7 17-26 14Z" />
    <path className="food-herb-line" d="m289 185 22 12m47 41 22 12" />
    <path className="food-chilli-green" d="M450 267q28 4 41-29 1 37-35 38Z" />
    <path className="food-herb-line" d="m450 269-9-3" />
    <path className="food-coconut" d="m185 258 9 3m85 30 8-4m149-28 7 3m-197-45 8 2" />
    <g className="food-mustard"><circle cx="204" cy="278" r="2" /><circle cx="288" cy="288" r="2.2" /><circle cx="426" cy="280" r="2" /></g>
  </>;
}

function KulchaLassi() {
  return <>
    <g transform="translate(457 104)">
      <ellipse className="food-shadow" cy="139" rx="47" ry="11" />
      <path className="food-steel" d="M-36 0l9 128q27 12 54 0L36 0Z" />
      <path className="food-fine" d="m-23 25 5 88m9-89 2 95m11-95-2 95m12-96-5 93" />
      <ellipse className="food-cream" rx="36" ry="12" />
      <path className="food-cream" d="M-22-4q7-15 19-9 14-9 24 8" />
      <path className="food-fine" d="m-10-7 3 2m10-4 4 2" />
    </g>
    <Plate x={285} y={260} width={394} height={104} />
    <Bowl x={153} y={196} width={116} filling="food-curry"><Chickpeas /></Bowl>
    <path className="food-bread" d="M205 216q20-52 86-50 72-6 115 38 23 24-1 48-43 41-121 33-84-4-79-69Z" />
    <path className="food-toast" d="M232 209q14-20 34-21l-11 14Zm55 52q24 9 39 0l-6 10-21 1Zm67-52q16-10 29 4l-14 5Z" />
    <path className="food-herb-line" d="m260 229 6-6 7 4m-7-4 1 11m53-39 5 6 8-3m-8 3-2 7m36 41 7-5 4 5m-7-5 1 10" />
    <path className="food-spice" d="m281 206 2 2m22 30 3-2m35-14 2 2m-71 14 2 1m64 34 2-1m-99-26 2 3m67-81 2 2" />
    <path className="food-cream" d="m292 213 26-7 7 16-27 7Z" />
  </>;
}

function Appam({ x, y, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path className="food-cream" d="M-113-1C-118-50-57-75 1-72c64-3 115 28 111 67-5 43-62 63-121 60-62 2-99-22-104-56Z" />
    <ellipse className="food-appam-centre" cx="-2" cy="1" rx="58" ry="37" />
    {Array.from({ length: 36 }, (_, i) => {
      const angle = i * 2.39996;
      const radius = .7 + (i % 3) * .1;
      return <ellipse className="food-pore" key={i} cx={Math.cos(angle) * 105 * radius} cy={Math.sin(angle) * 60 * radius - 5} rx={i % 2 ? 2.3 : 3.3} ry="1.8" />;
    })}
  </g>;
}

function AppamStew() {
  return <>
    <BananaLeaf />
    <Appam x={258} y={205} scale={1.05} />
    <Appam x={229} y={247} scale={.91} />
    <Bowl x={449} y={216} width={141} height={63} clay filling="food-cream">
      <path className="food-vegetable" d="m-29-8 12-4 8 8-14 7Zm39 12 13-5 10 6-13 7Z" />
      <path className="food-herb" d="M-6-4q-10-12 5-13 7 9-5 13Zm13-1q5-14 16-9-2 12-16 9Z" />
      <path className="food-fine" d="m-34 8 6 3m30 0 6 1m28-17 8 2" />
    </Bowl>
    <Steam x={448} y={173} />
  </>;
}

function Gundruk() {
  return <>
    <path className="food-cloth" d="m88 243 283-85 166 113-288 57Z" />
    <path className="food-woven-line" d="m115 244 133 72m-119-79 132 75m-111-82 131 77m-94-68 262-60m-246 73 261-62m-244 76 260-65" />
    <Bowl x={449} y={188} width={139} height={58} filling="food-cream">
      <path className="food-steamed-rice" d="M-61-5q3-19 18-21 9-18 28-16 18-18 33-5 24-4 31 17 17 4 17 25-63 25-127 0Z" />
      <path className="food-rice-detail" d="m-41-18 5-2m7-11 5 2m6-9 4 2m13-1 6 2m9 8 5 3m10 3 5 2m-66 6 5 2m10-4 6 2m10-9 5 1m2 14 6-1m-37 6 5 1m24 1 4 1" />
    </Bowl>
    <ellipse className="food-shadow" cx="273" cy="285" rx="145" ry="24" />
    <path className="food-earthen" d="M137 186q7 89 81 105 58 16 118-5 57-23 70-100Z" />
    <path className="food-pot-line" d="M151 222q117 57 240-1m-216 38q96 39 191-1m-172 17q79 24 151-3" />
    <ellipse className="food-earthen" cx="272" cy="185" rx="135" ry="48" />
    <ellipse className="food-broth" cx="272" cy="183" rx="121" ry="38" />
    <g className="food-fermented-leaf">
      <path d="M185 182q5-14 19-13l10 7-7 9 15 7-10 9-19-7 3-9Zm43-22 20 1 8 10-13 6 10 11-17 2-10-11 6-8Zm45 24 16-9 13 6-4 10 14 8-15 9-21-8 6-9Zm42-24 18 5-5 10 14 7-9 10-20-8 6-9-11-5Zm34 34 11-13 12 5-8 9 3 12-15-2Zm-112 4 15-6 11 9-10 9-20-5Z" />
    </g>
    <path className="food-leaf-stem" d="m192 175 16 20m28-29 9 17m35 2 17 17m23-36 10 20m-91 14 14 5m101-15 6 11" />
    <path className="food-chilli" d="M266 158q15-2 26 9-20 4-26-9Zm57 39q16-3 27 6-19 8-27-6Z" />
    <path className="food-broth-light" d="M169 180q-7 10 8 14m84 12 10 2m73-44 11 4m-109-14 11-1" />
    <path className="food-wood" d="M419 271c-19 5-23 18-9 24 14 6 32-4 34-13l88-32q8-5 3-10-4-4-11 0l-89 31q-7-2-16 0Z" />
    <path className="food-fine" d="M413 283q10-8 23-4m13-6 75-28" />
    <Steam x={265} y={119} />
  </>;
}

function Biryani() {
  return <>
    <path className="food-cloth" d="m119 235 319-49 95 95-325 39Z" />
    <path className="food-fine" d="m140 241 74 68m-53-73 72 70" />
    <ellipse className="food-shadow" cx="316" cy="288" rx="152" ry="26" />
    <path className="food-clay" d="M193 174c-31 35-18 109 42 118 62 10 137 10 167-20 22-23 29-69 9-98Z" />
    <path className="food-fine" d="M200 247q104 52 211-3m-195 30q93 36 178-2M190 192q-41-22-39 11 5 25 33 24m230-35q39-22 39 10-5 23-29 24" />
    <ellipse className="food-clay" cx="302" cy="175" rx="119" ry="42" />
    <path className="food-rice" d="M192 174q3-20 23-26 18-26 46-24 33-25 64-7 44-3 57 24 29 3 33 31-112 64-223 2Z" />
    <g transform="translate(303 160)">
      {Array.from({ length: 74 }, (_, i) => {
        const angle = i * 2.39996, radius = Math.sqrt((i + .5) / 74);
        const x = Math.cos(angle) * 103 * radius, y = Math.sin(angle) * 30 * radius;
        return <path className={i % 4 ? 'food-rice-grain' : 'food-saffron'} key={i} d={`M${x} ${y}q4-4 8-1`} />;
      })}
    </g>
    <path className="food-onion" d="M237 154q14-19 28-3t24-2m-21 31q16-20 28-6t28-4m-7-23q19-20 33-2" />
    <path className="food-herb" d="M309 134q-26-4-22-20 22-3 22 20Zm2 0q1-24 20-20 4 18-20 20Z" />
    <Bowl x={472} y={261} width={97} height={38} filling="food-cream">
      <path className="food-herb-line" d="m-21-4 7 3m7-8 5 4m9 10 6-3m12-7 5 2" />
    </Bowl>
    <Steam x={283} y={94} />
  </>;
}

function PuttuKadala() {
  return <>
    <BananaLeaf />
    <g transform="translate(265 107) rotate(-4)">
      <path className="food-rice" d="M-43 0v144q42 25 86 0V0Z" />
      <ellipse className="food-cream" rx="43" ry="17" />
      <path className="food-coconut-band" d="M-43 31q43 20 86 0v13q-43 20-86 0Zm0 53q43 20 86 0v13q-43 20-86 0Zm0 49q43 20 86 0v12q-43 24-86 0Z" />
      <path className="food-fine" d="m-25 16 3 2m17 3 3 1m20-7 3 1m-41 43 3 1m16 5 3 1m20-5 2 2m-43 48 3 2m16 5 3-1m18-6 3 1" />
    </g>
    <Bowl x={424} y={229} width={135} height={53} clay filling="food-brown-curry"><Chickpeas dark /></Bowl>
    <path className="food-banana" d="M133 241q12 50 84 41 20-1 28-16-65 17-103-32Z" />
    <path className="food-fine" d="M141 247q32 30 91 28m-96-40-5-9m110 42 7-3" />
  </>;
}

function Dabeli() {
  return <>
    <path className="food-paper" d="m113 200 323-39 70 123-302 39Z" />
    <path className="food-fine" d="m125 206 79 104 278-32M153 211l42 55m-26-59 22 29" />
    <g transform="translate(301 214)">
      <path className="food-bread" d="M-108 11q-10 36 15 52 101 37 196-7 19-17 7-45Z" />
      <path className="food-potato" d="M-101-3q20-19 38-10l35-5 35 7 28-8 31 11 31-2 11 34q-104 38-207-3Z" />
      <path className="food-chutney-line" d="M-96 17q25 12 49 4t48 4 48-4 48-2" />
      {[-85, -63, -34, -5, 22, 51, 81].map((x, i) => <g key={x}>
        <circle className="food-pomegranate" cx={x} cy={i % 2 ? 14 : 5} r="4.5" />
        <ellipse className="food-peanut" cx={x + 9} cy={i % 2 ? 5 : 19} rx="5.5" ry="3.5" />
        <path className="food-sev" d={`m${x - 4} 25 8 4m-6-10 2 8m6-6 5-4`} />
      </g>)}
      <path className="food-bread" d="M-111-5c-5-66 41-101 107-100 68-4 125 37 117 101-71-27-151-24-224-1Z" />
      <path className="food-toast" d="M-84-49q22-33 61-37l-7 11q-29 7-54 26Zm113-33q36 8 56 35l-24-12Z" />
      <path className="food-cream-line" d="m-51-53 5 2m18-17 5 2m23 4 4-3m24 13 5 1m-47 14 4-1m-45 5 4-1m107 3 5 2" />
    </g>
    <path className="food-chilli-green" d="M451 284q-6-27 35-45-16 22-35 45Z" />
    <path className="food-herb-line" d="m484 240 12-5" />
    <circle className="food-pomegranate" cx="164" cy="283" r="4" /><circle className="food-pomegranate" cx="178" cy="291" r="3" />
  </>;
}

function Dosa() {
  return <>
    <Plate x={302} y={246} width={431} height={124} />
    <Bowl x={409} y={180} width={95} height={33} filling="food-curry" />
    <Bowl x={464} y={232} width={85} height={32} filling="food-cream"><path className="food-herb-line" d="m-13-4 9 4 12-6m-12 6 4 8" /></Bowl>
    <path className="food-bread" d="M141 223Q250 182 371 126l48 61Q309 246 191 282Z" />
    <path className="food-toast" d="M155 233q102-29 210-90l22 28q-108 64-215 89Z" />
    <path className="food-fine" d="M151 223q28-6 44 19 16 28-4 40m-33-50q24-1 29 26m20-28 137-61m-123 79 127-61m-105 58 96-43M371 126q39 10 48 61" />
    <path className="food-cream-line" d="m200 223 16-6m17-6 25-11m16-8 21-11m21-9 24-13m-103 75 21-8m28-13 28-13" />
    <g transform="translate(516 119)">
      <ellipse className="food-steel" cy="72" rx="45" ry="14" />
      <path className="food-steel" d="M-28 0l6 60q23 12 45 0L29 0Z" />
      <path className="food-fine" d="m-16 19 3 34m27-34-3 34" />
      <ellipse className="food-tea" rx="28" ry="10" />
      <Steam x={0} y={-20} />
    </g>
  </>;
}

function Sandesh({ x, y, rotation = 0 }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <path className="food-cream" d="M-35 0q-5-18 3-26l31-19 34 20q8 6 4 22L0 20Z" />
    <path className="food-fine" d="m-32-25 32 21 33-21M0-4v22m-17-37 17-11 18 11L0-7Z" />
    <path className="food-herb" d="M-5-20q5-12 13-9-1 11-13 9Z" />
  </g>;
}

function MishtiDoi() {
  return <>
    <path className="food-cloth" d="m119 203 110-60 237 114-109 68Z" />
    <path className="food-fine" d="m129 205 224 109m-207-120 223 109" />
    <ellipse className="food-shadow" cx="249" cy="266" rx="98" ry="23" />
    <g transform="translate(245 163)">
      <path className="food-clay" d="M-89 0q-10 49 25 91 60 30 123-1 37-37 29-90Z" />
      <path className="food-fine" d="M-83 30q82 42 166 0M-76 58q76 36 150 0M-63 84q63 28 125-1" />
      <ellipse className="food-clay" rx="90" ry="32" />
      <ellipse className="food-doi" cy="-2" rx="80" ry="24" />
      <path className="food-cream-line" d="M-43-7C-27-25 47-20 50-1 52 17-27 18-27 1c0-11 46-9 42 0" />
      <path className="food-spice" d="m-10-4 9 2m12-7 7 3m-2 12 6-1" />
    </g>
    <Plate x={427} y={270} width={207} height={67} />
    <Sandesh x={445} y={228} rotation={14} />
    <Sandesh x={385} y={266} rotation={-12} />
    <Sandesh x={465} y={279} rotation={8} />
  </>;
}

const dishes = {
  'bedai-jalebi': BedaiBreakfast, khandvi: Khandvi, 'kulcha-lassi': KulchaLassi,
  'appam-stew': AppamStew, gundruk: Gundruk, biryani: Biryani,
  'puttu-kadala': PuttuKadala, dabeli: Dabeli, dosa: Dosa, 'mishti-doi': MishtiDoi,
};

export default function JourneyFood({ art }) {
  const Dish = dishes[art.dish];
  return <figure className="journey-food" data-dish={art.dish}>
    <svg viewBox="0 0 640 360" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={art.description}>
      <Dish />
    </svg>
  </figure>;
}
