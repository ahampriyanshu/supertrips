import RegionalLandmark from './RegionalLandmarks.jsx';
import PellingScenery from './PellingScenery.jsx';
import { Bicycle, Boat, Gopuram, HillHouse, Train, Tree, Water } from './IllustrationParts.jsx';

const waterSettings = new Set(['river', 'coast', 'river-coast', 'lake', 'snow-lake', 'backwaters']);
const mountainSettings = new Set(['snow', 'snow-lake', 'bare-mountains', 'mountains', 'pine', 'tea-mountains']);
const natureKinds = new Set(['cyber-city','empty-towers','mountain-rail','mountain-shrine','shikara','gondola','mountain-village','valley','dune-camp','fishing-nets','houseboat','cliff-beach','meadows','toy-train','rainforest','pamban','waterfall','river-bridge','wetland','arch-bridge','marina','glacier','mountain-camp','beach','station','submarine','coffee-hills','pillar-rocks','terrace-village','tea-hills','cove','salt-rann','paraglider','lake-bridge']);

function Backdrop({ setting }) {
  const snow = setting.includes('snow') || setting === 'tea-mountains';
  return <g className="art-backdrop">
    {!snow && setting !== 'forest-hills' && <circle className="art-sun" cx="577" cy="66" r="27" />}
    {mountainSettings.has(setting) && <><path className="place-fill-soft" d="M0 202 92 72l60 67L262 25l109 116L455 61l95 110 76-78 94 105v70H0Z" /><path className="art-ridge" d="m0 202 92-130 60 67L262 25l109 116L455 61l95 110 76-78 94 105" />{snow && <path className="art-snowcap" d="m62 114 30-42 38 44-25-10-14 11-8-13Zm161-47 39-42 43 46-31-13-14 18-16-15Zm204 26 28-32 30 34-23-9-9 13-10-13Z" />}</>}
    {['forest-hills','tea','dry-hills','pine-hills'].includes(setting) && <><path className="place-fill-soft" d="M0 177q68-88 153-56T313 72q74-62 153 22t160 16 94 13v145H0Z" /><path className="art-ridge" d="M0 177q68-88 153-56T313 72q74-62 153 22t160 16 94 13" /><path className="place-fill-soft" d="M0 220q94-79 183-18t190-25 184-14 163-4v109H0Z" /></>}
    {setting==='desert' && <><g className="place-dunes-back"><path className="place-fill-soft" d="M-40 229Q90 108 255 199t505-35v116H-40Z" /><path className="art-ridge" d="M-40 229Q90 108 255 199t505-35" /></g><g className="place-dunes-front"><path className="place-fill" d="M-40 263Q167 179 364 244t396-29v75H-40Z" /><path className="art-ridge" d="M-40 263Q167 179 364 244t396-29" /></g></>}
    {setting==='salt' && <><path className="art-salt" d="M0 184h720v96H0Z" /><path className="art-ridge" d="M0 184h720M42 249l34-21 31 14 38-23 41 20 36-10 44 30m-191-31-12-20m44 34-7 38m45-61 5-17m36 37-15 41m51-51 10-21m34 51 47-12 40 17 43-22 49 17m-89 7 3 16m37-37 3-19m49 36 33-26 39 16 42-19 46 16m-127 3-7 26m88-29 13 30" /></>}
    {setting==='boulders' && <g className="place-fill-soft"><path d="M25 241q-19-41 22-51-24-31 15-48 30-18 42 18 39-17 46 15 46 0 35 66Zm503 0q-16-40 17-57-9-38 27-40-7-48 34-48 40 0 33 42 40-8 52 28 36 18 14 75Z" /><path className="art-ridge" d="M29 224h153m-128-32 77-9m-65-22 39 4m438 37 146 1m-133-21 71-6m-37-38 54-1" /></g>}
    {setting==='fields' && <><path className="place-fill-soft" d="M0 194h720v86H0Z" /><path className="art-ridge" d="M0 194h720M70 280l160-86m30 86 66-86m134 86-38-86m268 86-210-86M0 230h720M0 257h720" /></>}
    {waterSettings.has(setting) && <><path className="art-water-fill" d="M0 233q154-20 321-5t399-7v59H0Z" /><Water y={245} /></>}
    {setting==='garden' && <path className="place-garden" d="M0 252q120-34 216-9t192 0 312 7v30H0Z" />}
    {['pine','pine-hills','forest-hills','backwaters','garden','coast','tea'].includes(setting) && <><Tree x={65} y={245} scale={.8} pine={['pine','pine-hills'].includes(setting)} palm={['backwaters','coast'].includes(setting)} /><Tree x={655} y={237} scale={.6} pine={['pine','pine-hills'].includes(setting)} palm={['backwaters','coast'].includes(setting)} /></>}
    {!waterSettings.has(setting) && <path className="place-ground" d="M15 252h690m-656 9h153m324 0h144" />}
  </g>;
}

function Skyline({ kind }) {
  const tech = kind === 'cyber-city';
  return <g data-subject={kind}>
    {[{x:136,w:64,h:105},{x:221,w:76,h:164},{x:321,w:84,h:195},{x:430,w:63,h:128},{x:513,w:72,h:164}].map((b,i)=><g key={b.x}><path className={i%2?'place-stone-light':'art-glass'} d={`M${b.x} 234V${234-b.h}h${b.w}v${b.h}Z`} /><path d={`M${b.x} 234V${234-b.h}h${b.w}v${b.h}m-${b.w-6} -${b.h-8}h${b.w-12}`} />{Array.from({length:Math.floor(b.h/16)-1},(_,r)=><path className="art-window" key={r} d={`M${b.x+9} ${234-b.h+21+r*16}h${b.w-18}`} />)}<path className="place-etch" d={`M${b.x+b.w/2} ${234-b.h+11}V229`} /></g>)}
    {tech ? <><path className="place-stone-light" d="M89 206q234-36 539 4v10q-305-40-539-4Z" /><path d="M89 206q234-36 539 4m-539 6q234-36 539 4M165 203v45m173-55v54m173-47v47" /><g className="art-metro"><path className="place-stone" d="M320 185v-16q0-7 8-7h91q13 0 18 13l4 14Z" /><path d="M320 185v-16q0-7 8-7h91q13 0 18 13l4 14Zm9-17h17v10h-17zm25 0h17v10h-17zm25 0h17v10h-17zm25 0h17l6 10h-23Z" /></g></> : <path d="M302 242l-60 38m176-38 60 38m-118-35v8m0 9v12M96 244h148m234 0h147" />}
  </g>;
}

function FishingNets() {
  return <g data-subject="fishing-nets">
    {[{x:220,s:1},{x:487,s:.72}].map(({x,s})=><g key={x} transform={`translate(${x} 239) scale(${s})`}><path d="M0 0v-132m-7 132 7-132 7 132M0-132l-130 101L102-57ZM-130-31-83-4 102-57m-232 26L0-56l102-1M0-132 74-77 93-20m-22-55 15 2m-11 7 15 2m-11 7 15 2m-11 7 15 2M-137 0H28" /><path className="art-net" d="m-130-31 47 27L102-57ZM-114-23 87-58m-184 45L65-58m-146 51L43-58m-116 47L21-58m-65 44L-2-57m-18 36-2-34m-17 29-4-27m-18 24-7-18" /></g>)}
  </g>;
}

function Houseboat() {
  return <g data-subject="houseboat" className="art-boat"><path className="place-stone" d="M153 224q156 21 374-9-19 33-319 29Z" /><path className="place-fort-stone" d="M205 224v-39q10-66 143-61 108 1 123 61v37Z" /><path d="M153 224q156 21 374-9-19 33-319 29Zm52 0v-39q10-66 143-61 108 1 123 61v37M202 185h272M226 172q52-62 118-44m-115 58v37m229-38v37M241 214v-23h31v23Zm50 0v-23h31v23Zm50 0v-23h31v23Zm50 0v-23h31v23Z" /><path className="place-etch" d="M229 168h214m-207-7h199m-190-7h180m-168-7h156m-143-7h126M214 232q131 11 268-6" /></g>;
}

function Bridge({ kind, detail }) {
  const arch = kind==='arch-bridge', railway=detail==='railway'||kind==='pamban';
  if (kind === 'pamban') return <g data-subject={kind}>
    <path d="M83 193h551m-551 9h551M313 191v-49h95v49m-95-49 95 49m-95 0 95-49M81 177h230m97 0h228" />
    {Array.from({length:12},(_,i)=><g key={i}><path d={`M${98+i*44} 202v39m-5-39v39M${98+i*44} 191v-14l30 14v-14Z`}/></g>)}
    <Train x={357} y={188} scale={.6}/>
  </g>;
  if (kind === 'lake-bridge') return <g data-subject={kind}>
    <path className="place-stone-light" d="M137 209q220-93 441 0v11q-221-93-441 0Z" />
    <path d="M137 209q220-93 441 0m-441 11q220-93 441 0M137 205v33m441-33v33" />
    {Array.from({length:17},(_,i)=><path key={i} d={`M${148+i*26} ${205-Math.sin(i/16*Math.PI)*45}v-17`}/>)}
    <path d="M146 187q211-95 423 0" /><Boat x={389} y={249} scale={.7}/>
  </g>;
  return <g data-subject={kind}>
    <path d="M94 162h532m-532 8h532M125 170v65m470-65v65" />
    {arch ? <><path d="M125 233q235-166 470 0m-470 7q235-166 470 0" />{Array.from({length:15},(_,i)=><path key={i} d={`M${143+i*31} 171v${Math.round(55*(1-Math.sin((i+1)/16*Math.PI)))}`} />)}</> : <><path d="M162 231V90m396 141V90M93 161l69-71q198 146 396 0l69 71m-465-65q198 146 396 0" />{Array.from({length:17},(_,i)=><path key={i} d={`M${172+i*23} ${107+Math.sin(i/16*Math.PI)*61}V162`} />)}</>}
    {railway && <Train x={360} y={159} scale={.55} />}
    {!railway && <Boat x={388} y={249} scale={.72} />}
  </g>;
}

function Waterfall({ kind, detail }) {
  const jog=detail==='jog';
  return <g data-subject={kind}>
    <path className="place-stone" d="M178 236V91l67-17 83 10 26 51 18-51 69-13 88 19v146Z" /><path className="art-water-fill" d={jog?'M268 85h14l-6 151h-15Zm42 3h20l15 148h-32Zm68-5h23l-12 153h-28Zm53-9h12l26 162h-15Z':'M298 84h28l27 51h36l-10 40h29l-24 61h-80l28-61h-28l14-40Z'} />
    <path d="M178 236V91l67-17 83 10 26 51 18-51 69-13 88 19v146M197 117l28-13 23 9m-50 38 52-10m-39 42 35-9m-21 44 19-8M458 111l43 9m-52 24 62 12m-60 21 41 14m-38 24 52 9" />
    <g className="art-falling-water"><path d={jog?'M274 101l-4 120m48-118 9 115m57-117-10 126m63-133 23 122':'M310 97l28 48-9 20m30-21-12 36m31 8-18 36m-24-38-16 40'} /></g>
    <path className="art-water" d="M259 241q76-13 154 0m-142 9q65-9 131 0" />
  </g>;
}

function TeaLandscape({ kind, detail }) {
  const coffee = kind==='coffee-hills';
  return <g data-subject={kind}>
    <path className="place-garden" d="M74 242q36-114 157-100 100-103 195-40 112-4 214 140Z" /><path className="art-ridge" d="M74 242q36-114 157-100 100-103 195-40 112-4 214 140" />
    {Array.from({length:6},(_,i)=><path className="art-crop-row" key={i} d={`M${99+i*9} ${236-i*12}q55-${42-i*3} 112-24M${233+i*13} ${211-i*15}q56-51 125-31M${394+i*8} ${234-i*14}q83-24 154 0`} />)}
    <HillHouse x={513} y={183} scale={detail==='heritage-house'?.72:.55} timber />
    {kind==='terrace-village' && [231,279,332,379].map((x,i)=><HillHouse key={x} x={x} y={212-i%2*15} scale={.45} timber />)}
    {coffee && <g className="art-coffee"><path d="M169 249v-83m0 30q-40-2-41-34 38 2 41 34Zm0 25q42-5 44-35-38-3-44 35Zm0 17q-33 3-44-18 29-12 44 18Z" />{[0,1,2,3,4].map(i=><circle key={i} cx={177+i%2*8} cy={181+i*11} r="4" />)}</g>}
    {(detail==='train'||kind==='toy-train') && <Train x={375} y={247} scale={.72}/>}
  </g>;
}

function NaturalSubject({ art }) {
  const {kind,detail} = art;
  switch(kind) {
    case 'cyber-city': case 'empty-towers': return <Skyline kind={kind}/>;
    case 'fishing-nets': return <FishingNets/>;
    case 'houseboat': return <Houseboat/>;
    case 'arch-bridge': case 'river-bridge': case 'lake-bridge': case 'pamban': return <Bridge kind={kind} detail={detail}/>;
    case 'waterfall': return <Waterfall kind={kind} detail={detail}/>;
    case 'tea-hills': case 'coffee-hills': case 'terrace-village': return <TeaLandscape kind={kind} detail={detail}/>;
    case 'rainforest': return <g data-subject={kind}>{detail==='treehouse'?<><Tree x={373} y={238} scale={1.55}/><HillHouse x={372} y={162} scale={.7} timber/><path d="M354 164v71m33-71v71m-33-62h33m-33 10h33m-33 10h33m-33 10h33m-33 10h33m-33 10h33"/></>:<g transform="translate(65 34) scale(.8)"><Waterfall kind="waterfall"/></g>}<Tree x={162} y={243} scale={1.2}/><Tree x={567} y={245} scale={1.3}/><path className="art-leaf" d="M84 245q-32-51-14-94 45 20 44 61 45-27 58 4-26 38-61 27m490 6q-41-50-18-97 43 18 42 62 30-23 51-6-13 38-56 39"/></g>;
    case 'shikara': return <g data-subject={kind}><Boat x={312} y={246} scale={1.25} roof/><g transform="translate(465 194) scale(.75)"><path className="place-stone" d="M-20 37h164l-19 13H0Z"/><path className="place-stone-light" d="M0 37V0h121v37Z"/><path d="M0 37V0h121v37M-8 0h137l-17-11H9ZM9 26V8h16v18Zm28 0V8h16v18Zm28 0V8h16v18Zm28 0V8h16v18Z"/></g><path className="art-chinar" d="M122 229v-51m0 28-26-6 10-12-7-14 18 6 5-25 7 25 17-6-7 15 11 11-28 6Z"/></g>;
    case 'gondola': return <g data-subject={kind}><Tree x={204} y={245} pine scale={.8}/><Tree x={490} y={239} pine scale={.9}/><path d="M70 71q295 70 590-21M195 112v130m-21-129h42M563 79v164m-23-163h44"/><g className="art-gondola"><path d="M353 108v23m-12 0h24"/><rect className="place-stone" x="326" y="134" width="55" height="44" rx="8"/><path d="M326 156h55m-37-21v21m19-21v21"/></g></g>;
    case 'toy-train': return <g data-subject={kind}><path d="M91 250q246-73 538-4m-534 12q242-71 530-4"/><Train x={351} y={237} scale={1.05}/>{detail==='station'?<HillHouse x={558} y={203} scale={.65}/>:<><path className="art-crop-row" d="M133 193q28-33 79-24m-67 37q29-25 68-21m275 14q65-32 122-6m-112 18q61-23 113-5"/><Tree x={577} y={234} scale={.6}/></>}</g>;
    case 'mountain-rail': return <g data-subject={kind}><path className="place-stone" d="M142 235v-85q0-79 116-84 116 5 116 84v85Z"/><path className="art-tunnel" d="M190 235v-75q0-46 67-46 67 0 67 46v75Z"/><path d="M142 235v-85q0-79 116-84 116 5 116 84v85M178 234v-78q0-54 79-54 79 0 79 54v78M248 241h339m-339 8h339"/><Train x={409} y={232} scale={.83}/></g>;
    case 'mountain-shrine': return <g data-subject={kind}><path className="place-stone-light" d="M168 155v-30h80v-18h86v18h80v-18h82v18h65v30Z"/><path d="M168 155v-30h80v-18h86v18h80v-18h82v18h65v30M157 161h416M183 132v17m16-17v17m16-17v17m16-17v17m32-17v17m16-17v17m16-17v17m129-17v17m16-17v17m16-17v17m32-17v17m16-17v17M184 168q-69 25 21 36t-48 44m41-80q-58 24 29 37t-48 43"/></g>;
    case 'mountain-village': case 'valley': case 'meadows': return <g data-subject={kind}><path className="art-water-fill" d="M371 151q-54 24 15 46t-54 73h84q84-55 5-81t-34-38Z"/><HillHouse x={263} y={201} scale={.65} timber/><HillHouse x={480} y={226} scale={.5} timber/>{[135,168,562,602].map(x=>kind==='mountain-village'?<g key={x}><path className="place-garden" d={`M${x} 236q-21-10-12-53 12-35 24 0 9 43-12 53Z`}/><path className="art-tree" d={`M${x} 243v-67`}/></g>:<Tree key={x} x={x} y={244} scale={.55} pine/>)}</g>;
    case 'glacier': return <g data-subject={kind}><path className="art-snowcap" d="m269 73 32 46 56 26 22 43 63 60H258l28-61-35-40Z"/><path className="art-ridge" d="m269 73 32 46 56 26 22 43 63 60m-163-75 36-20 29 16m-60 15 55-8m-65 34 83-8m-100 29 128-11"/></g>;
    case 'mountain-camp': return <g data-subject={kind}>{[219,326,446].map((x,i)=><g key={x} transform={`translate(${x} ${234-i%2*16})`}><path className="place-stone" d="m-45 0 37-52H9L46 0Z"/><path d="m-45 0 37-52H9L46 0Zm37-52L23 0m-31-52L-16 0M-6-25 8 0H-13Z"/></g>)}</g>;
    case 'dune-camp': return <g data-subject={kind}><path className="place-stone-light" d="m401 222 66-68 66 68Z"/><path d="m401 222 66-68 66 68Zm66-68v68m0-13-19 13m19-13 19 13M400 223h134"/><g transform="translate(213 208)"><path className="place-stone" d="M-43 2q-12-11-7-22 4-8 14-4 5-35 19-24 10 11 18 5 20-20 27 4l12 5 10-33q-3-14 6-16 15-1 18 5-3 6-12 5L55-32q-4 25-19 30l-3 34h-8L21 1H-21l-7 31h-8l3-37Z"/><path d="M-43 2q-12-11-7-22 4-8 14-4 5-35 19-24 10 11 18 5 20-20 27 4l12 5 10-33q-3-14 6-16 15-1 18 5-3 6-12 5L55-32q-4 25-19 30l-3 34h-8L21 1H-21l-7 31h-8l3-37"/></g></g>;
    case 'cliff-beach': case 'cove': return <g data-subject={kind}><path className="place-stone" d="M93 155q115-25 210 41l-40 41-170 16Zm441-3q49-32 103-13v111l-99-24-36-39Z"/><path d="M93 155q115-25 210 41l-40 41-170 16M118 174l-5 50m30-49-5 48m31-40-5 40m31-33-6 29m32-19-6 19"/><Tree x={200} y={181} scale={.65} palm/><Boat x={415} y={247} scale={.7}/></g>;
    case 'beach': case 'marina': return <g data-subject={kind}><path className="place-fill" d="M0 225q278-39 527 55H0Z"/><Boat x={420} y={238} scale={.9}/>{kind==='marina'?<g><path className="place-stone-light" d="M194 234V85h31v149Z"/><path d="M194 234V85h31v149m-34-148h37m-33-10h29v10m-30 26h31m-31 25h31m-31 25h31m-31 25h31m-31 25h31"/><path className="art-tile-roof" d="M194 112h31v25h-31Zm0 50h31v25h-31Z"/></g>:<><Tree x={197} y={241} scale={.6} pine/><Tree x={228} y={243} scale={.45} pine/></>}</g>;
    case 'station': return <g data-subject={kind}><path className="place-stone-light" d="M147 190v-53h293v53Z"/><path d="M147 190v-53h293v53M136 137l23-18h269l23 18ZM149 168h289M142 197h442M478 192V102h56v90m-60-90h64l-16-16h-32Z"/><Train x={343} y={241} scale={1.25}/></g>;
    case 'submarine': return <g data-subject={kind}><path className="place-stone" d="M192 216q-64-9-8-39h112v-37h73v37h149q44 1 55 19-15 22-60 20Z"/><path d="M192 216q-64-9-8-39h112v-37h73v37h149q44 1 55 19-15 22-60 20ZM314 140v-24h12m21 24v-18h12M207 186h286m-283 10h281M220 217v18m295-18v18"/>{[238,273,308,343,378,413,448].map(x=><circle key={x} cx={x} cy="207" r="2"/>)}</g>;
    case 'pillar-rocks': return <g data-subject={kind}>{[{x:245,h:131},{x:327,h:157},{x:411,h:141}].map(({x,h})=><g key={x}><path className="place-stone" d={`M${x} 239l-8-${h-31} 13-31 33-5 20 36L${x+48} 239Z`}/><path d={`M${x} 239l-8-${h-31} 13-31 33-5 20 36L${x+48} 239M${x+25} ${245-h}l6 52-7 62`}/></g>)}</g>;
    case 'salt-rann': return <g data-subject={kind}>{[211,421].map((x,i)=><g key={x} transform={`translate(${x} ${210+i*16})`}><path className="place-stone-light" d="M-51 0v-41h102V0Z"/><path className="place-fort-stone" d="m-64-41 64-40 64 40Z"/><path d="M-51 0v-41h102V0Zm-13-41 64-40 64 40ZM-12 0v-23q12-15 24 0V0M-41-27h16v14h-16zm66 0h16v14H25Z"/><path className="place-etch" d="m-45-47 45-29 45 29m-65 16h40"/></g>)}<g className="art-flamingos">{[569,598,631].map((x,i)=><path key={x} d={`M${x} ${205+i%2*9}v24m0-10 10 10m-10-24q-19-8-12-15 9-5 19 3 9-3 8-18-5-8-10-4`}/>)}</g></g>;
    case 'wetland': return <g data-subject={kind}><Boat x={330} y={244}/>{[153,193,521,566].map(x=><path className="art-tree" key={x} d={`M${x} 242v-56m0 56q-24-49-31-44m31 27q16-41 24-42m-24 29-7-21`}/>)}<path className="art-birds" d="M204 118q10-10 20 0 10-10 20 0m188-35q8-8 16 0 8-8 16 0m81 58q8-8 16 0 8-8 16 0"/></g>;
    case 'paraglider': return <g data-subject={kind}><g className="art-paraglider"><path className="place-stone" d="M249 91q110-121 220 0-110-42-220 0Z"/><path d="M249 91q110-121 220 0-110-42-220 0ZM249 91l110 82L469 91M279 76l80 97 80-97m-130-9 50 106 50-106m-55 0v13h14m-9-12 10 6"/><circle cx="359" cy="163" r="5"/></g><g transform="translate(154 168) scale(.3)"><RegionalLandmark kind="monastery"/></g><Tree x={524} y={243} scale={.65} pine/></g>;
    default: return null;
  }
}

function Accents({ art }) {
  const {kind, detail} = art;
  return <g className="art-accents">
    {['waterfall','cascade'].includes(detail) && kind !== 'waterfall' && <g><path className="place-stone" d="M576 235v-62l17-9h26v71Z"/><path className="art-water-fill" d="M594 166h12l3 69h-17Z"/><path className="art-falling-water" d="M599 174v55"/></g>}
    {detail==='filigree' && <g transform="translate(557 210)" className="art-etch"><circle r="28"/><circle r="6"/>{[0,45,90,135,180,225,270,315].map(angle=><path key={angle} transform={`rotate(${angle})`} d="M0-6q-16-21 0-20 16-1 0 20Z"/>)}</g>}
    {detail==='chariot' && <g transform="translate(556 238)"><path className="place-stone" d="M-21-10v-29h42v29Zm-26-29 27-26 27 26Z"/><path d="M-21-10v-29h42v29Zm-26-29 27-26 27 26ZM-27-8h54m-41-28v24m14-24v24m14-24v24"/><circle cx="-17" cy="-2" r="7"/><circle cx="17" cy="-2" r="7"/></g>}
    {detail==='church' && kind==='tiled-coast' && <g><path className="place-stone-light" d="M526 235V134h39v101Z"/><path d="M526 235V134h39v101m-44-101 24-27 25 27ZM545 107V91m-7 6h14M537 158v-12q8-12 16 0v12Z"/></g>}
    {detail==='pier' && <><path d="M505 219h101m-93 0v30m20-30v30m20-30v30m20-30v30m20-30v30"/><Boat x={546} y={253} scale={.7}/></>}
    {detail==='moat' && <path className="art-water" d="M149 242q210 25 421 0m-434 10q225 26 447 0"/>}
    {detail==='ramparts' && <path className="art-ridge" d="M81 235v-29h20v-7h9v7h20v-7h9v7h20v-7h9v7h39v29m283-5v-22h18v-7h9v7h19v-7h9v7h19v-7h9v7h25v22"/>}
    {detail==='dwarka' && <path d="M219 237h292m-302 6h312m-324 6h336"/>}
    {kind==='island-temple' && <path className="art-ridge" d="M44 210h134m-123 14v-49m110 49v-49M55 175q55 62 110 0m-96 14v21m18-10v10m18-7v7m18-7v7m18-11v11m18-20v20"/>}
    {detail==='bicycle' && <Bicycle x={542} y={245} scale={.9}/>}
    {detail==='charkha' && <g transform="translate(560 211)"><circle r="24"/>{[0,45,90,135].map(a=><path key={a} transform={`rotate(${a})`} d="M-24 0h48"/>)}<path d="M0 0h62M-12 27 0 0l18 27m-40 0h87M56 0v27M48-5h20"/></g>}
    {detail==='sea-link' && <path className="art-ridge" d="M511 180V90m96 90V90m-136 90h179m-139-90-36 90m36-90 27 90m69-90-42 90m42-90 35 90"/>}
    {detail==='lamps' && <g className="place-lamps">{[124,254,527,602].map((x,i)=><g key={x}><path className="place-stone" d={`M${x-8} ${250+i%2*10}h16q-8 12-16 0Z`}/><path className="place-flame" d={`M${x} ${247+i%2*10}q-7-4 0-13 7 9 0 13Z`}/></g>)}</g>}
    {detail==='peacock' && <g transform="translate(116 205)"><path d="M0 40q17-53 18-83-49-10-41 31 6 31 41-31m0 0q35-3 31 30-5 31-41 24"/><ellipse cx="13" cy="-15" rx="15" ry="22"/><ellipse className="place-garden" cx="13" cy="-15" rx="7" ry="12"/></g>}
    {detail==='bazaar' && <path className="place-stone-light" d="M109 235v-30h82v30m-89-30 17-17h66l15 17Zm424 30v-30h82v30m-89-30 17-17h66l15 17Z"/>}
    {detail==='blue-houses' && [133,180,532,582].map((x,i)=><g className="art-blue-house" key={x}><path d={`M${x} 253v-${29+i%2*14}h37v${29+i%2*14}ZM${x+8} 241v-10h8v10Z`}/></g>)}
    {detail==='caves' && <path className="art-cave" d="M66 230v-48h94v48Zm12-1v-30q10-15 20 0v30m10 0v-30q10-15 20 0v30m10 0v-30q10-15 20 0v30"/>}
    {detail==='vines' && <path className="art-crop-row" d="M74 207q28-19 70-8m-70 22q28-19 70-8m-70 22q28-19 70-8"/>}
    {detail==='flowers' && [105,130,567,593].map(x=><g key={x}><path d={`M${x-7} 248l-3-14h20l-3 14ZM${x} 234v-22`}/><circle className="art-blossoms" cx={x} cy="209" r="7"/></g>)}
    {detail==='stupa' && <g transform="translate(561 226) scale(.55)"><path className="place-stone-light" d="M-49 0h98v-15H34v-17q0-50-34-50t-34 50v17h-15Z"/><path d="M-49 0h98v-15H34v-17q0-50-34-50t-34 50v17h-15ZM0-82v-30m-12 22h24m-18-8h12"/></g>}
    {detail==='ferry' && <Boat x={561} y={249} scale={.65} roof/>}
    {detail==='skyline' && <path className="art-ridge" d="M505 166V84h28v82m14 0V61h41v105m-75-67h13m-13 11h13m29-34h27m-27 12h27m-27 12h27m-27 12h27m-27 12h27"/>}
    {detail==='silk' && <path className="art-etch" d="M94 212h79v32H94Zm0 8h79m-79 16h79m-70-24v32m15-32v32m15-32v32m15-32v32m15-32v32"/>}
    {detail==='suspension' && <path className="art-ridge" d="M58 190h140m-125 24v-60m110 60v-60M73 154q55 63 110 0m-96 14v22m18-10v10m18-7v7m18-7v7m18-11v11m18-20v20"/>}
    {detail==='cable-car' && <g className="art-gondola"><path d="M533 91h90m-45 0v21"/><rect className="place-stone-light" x="560" y="111" width="37" height="29" rx="5"/><path d="M560 127h37m-19-15v15"/></g>}
    {kind==='pamban' && <Gopuram x={601} y={144} scale={.35} tiers={6}/>}
  </g>;
}

export default function RegionalScenery({ art }) {
  if (art.kind === 'pelling-skywalk') return <PellingScenery />;
  return <g data-art-kind={art.kind}>
    <Backdrop setting={art.setting}/>
    {natureKinds.has(art.kind) ? <NaturalSubject art={art}/> : <RegionalLandmark kind={art.kind} detail={art.detail}/>}
    <Accents art={art}/>
    {['mist','snow','snow-lake','forest-hills','tea'].includes(art.setting) && <path className="art-mist" d="M25 121q123-15 243 0m186 36q115-16 237 0"/>}
    {!['empty-towers','adiyogi'].includes(art.kind) && <path className="art-birds" d="M116 67q6-6 12 0 6-6 12 0m420-36q5-5 10 0 5-5 10 0"/>}
  </g>;
}
