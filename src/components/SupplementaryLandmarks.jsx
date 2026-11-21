import { Arcade, Boat, Chhatri, Dome, Gopuram, Shikhara, Tree, Vimana } from './IllustrationParts.jsx';

function Monastery({ kind, detail }) {
  const palace = kind === 'himalayan-palace';
  return <g data-subject={kind}>
    <path className="place-stone-light" d="M232 235v-69h38v-51h54V77h80v38h48v51h37v69Z" />
    <path d="M232 235v-69h38v-51h54V77h80v38h48v51h37v69M224 236h273M270 158h182M324 115h80M345 235v-38h34v38" />
    {[{x:246,y:187,n:10},{x:284,y:137,n:7},{x:339,y:98,n:3}].map(r=><g key={r.y}>{Array.from({length:r.n},(_,i)=><path className="art-window" key={i} d={`M${r.x+i*23} ${r.y}h9v14h-9Z`} />)}</g>)}
    {!palace && <><path className="place-stone" d="m316 77 8-13h80l8 13Zm-54 38 12-14h48v14m82 0v-14h44l12 14M227 166l9-13h32v13m184 0v-13h33l9 13" /><path d="M320 62h88m-72-8h56m-33-1V39m-7 4h14" /><path className="art-prayer-line" d="M78 110q73 34 150 2" /><g className="place-flags">{Array.from({length:7},(_,i)=><path className="place-stone" key={i} d={`M${87+i*20} ${114+Math.sin(i/6*Math.PI)*13}v17l12 2v-17Z`} />)}</g></>}
    {detail==='prayer-wheels' && <g>{[534,555,576,597].map(x=><g key={x}><path d={`M${x} 213v32`} /><rect className="art-gold" x={x-7} y="216" width="14" height="19" rx="3" /></g>)}</g>}
  </g>;
}

function Pagoda({ kind }) {
  const kerala = ['kerala-temple','malabar-house'].includes(kind), floors = kerala ? 3 : 4;
  return <g data-subject={kind}>
    <path className="place-stone-light" d="M256 235v-64h208v64Z" /><path d="M256 235v-64h208v64M247 236h226" /><Arcade x={272} y={232} count={7} width={15} height={40} gap={11} />
    {Array.from({length:floors},(_,i)=>{const w=122-i*22,y=178-i*35;return <g key={i}><path className="art-tile-roof" d={`M${360-w} ${y}l23-23h${w*2-46}l23 23Z`} /><path d={`M${360-w} ${y}l23-23h${w*2-46}l23 23ZM${365-w} ${y+4}h${w*2-10}M${387-w} ${y-23}v-12m${w*2-54} 12v-12`} /><path className="place-etch" d={`M${373-w} ${y-5}h${w*2-26}m-${w*2-18} 10h${w*2-10}`} /></g>})}
    <path d={`M360 ${148-(floors-1)*35}v-12`} />
    {kind === 'kerala-temple' && <path d="M207 239V112m-14 17h28m-24 23h20m-24 23h28m-20 23h16m-21 23h26M202 112q5-14 10 0Z" />}
  </g>;
}

function TownHouse({ kind }) {
  const french = kind === 'french-quarter';
  return <g data-subject={kind}>
    <path className="place-stone" d="M192 235V118h270v117Z" /><path d="M192 235V118h270v117M184 118h286m-280 6h278M192 177h270M184 236h284" />
    {[207,251,295,339,383,427].map(x=><g key={x}><path className="place-stone-light" d={`M${x} 163v-23q12-14 24 0v23Z`} /><path d={`M${x} 163v-23q12-14 24 0v23Zm-2 4h28m-14-34v30M${x} 226v-31h24v31Z`} /><path className="place-etch" d={`M${x+3} 145h18m-18 5h18m-18 5h18`} /></g>)}
    {french ? <><path d="M195 110h264m-261-5h258" /><Tree x={489} y={235} scale={.75} /><g className="art-blossoms">{[0,1,2,3,4,5,6].map(i=><circle key={i} cx={461+(i%3)*17} cy={138+Math.floor(i/3)*17} r="8" />)}</g></> : <><path className="art-tile-roof" d="m184 118 36-28h216l34 28Z" /><path d="m184 118 36-28h216l34 28ZM218 88h219" /><path className="place-etch" d="M193 112h267m-258-7h249m-239-7h231" /></>}
  </g>;
}

function Ghats({ kind }) {
  return <g data-subject={kind}>
    <path className="place-stone-light" d="M135 213v-82h45v-26h42v108h39v-63h63v63h123v-73h51v73h34v-54h50v54Z" /><path d="M135 213v-82h45v-26h42v108m39 0v-63h63v63m123 0v-73h51v73m34 0v-54h50v54M119 216h478m-488 7h501m-510 7h518m-527 7h538" />
    <Arcade x={145} y={202} count={3} width={13} height={30} gap={12} /><Arcade x={268} y={204} count={2} width={14} height={27} gap={11} />
    <Shikhara x={379} y={215} scale={.8} />
    {kind==='kashi' && <g><path className="place-stone" d="M535 149v-41h75v41Z" /><path d="M535 149v-41h75v41m-78 0h81m-82-41q0-23 41-28 41 5 41 28Zm-67-5h53m-62-7h71M564 82V70h17v12" /><path className="place-etch" d="M540 116h65m-65 6h65m-65 6h65m-65 6h65m-65 6h65" /></g>}
  </g>;
}

function Braj() {
  return <g data-subject="braj"><path className="place-stone-light" d="M190 225v-58h340v58Z" /><path d="M190 225v-58h340v58M181 228h358m-369 7h390m-402 7h414M190 175h340" /><Arcade x={202} y={220} count={12} width={17} height={37} gap={10} /><Chhatri x={235} y={132} size={1.4} /><Chhatri x={360} y={110} size={2.3} /><Chhatri x={485} y={132} size={1.4} /><path d="M306 167v-45h108v45m-114-45h120M344 169v-31q16-22 32 0v31" /><path className="art-reflection" d="M209 249h306m-263 8h219m-166 7h110" /></g>;
}

function Puri() {
  return <g data-subject="puri"><Shikhara x={425} y={226} scale={1.02} /><path className="place-stone" d="M287 224v-41l30-61h31l30 61v41Z" /><path d="M287 224v-41l30-61h31l30 61v41m-92-39h94m-86-13h80m-74-12h68m-61-12h54m-47-12h40M275 229h214" />
    <g transform="translate(220 193)"><circle className="place-stone-light" r="48" /><circle r="43" /><circle r="35" /><circle r="11" />{Array.from({length:8},(_,i)=><g key={i} transform={`rotate(${i*45})`}><path d="M0-11v-24m-3-7 3-6 3 6M-4-18h8m-8-10h8" /><circle cy="-39" r="2" /></g>)}<path d="M-45 48h90" /></g>
  </g>;
}

function Kolkata() {
  return <g data-subject="kolkata">
    <path className="place-stone-light" d="M122 163v-36h39v-26h63v26h39v36Z" /><Dome x={193} y={101} radius={23} /><Arcade x={135} y={161} count={5} width={13} height={23} gap={11} />
    <path d="M340 175V76h17v99m185 0V76h17v99M329 162h246M348 85l-28 77m28-77 103 77L551 85l31 77M348 91l203 0M370 104l-12 58m25-58-12 58m25-58-12 58m145-58 12 58m-25-58 12 58m-25-58 12 58" />
    <path d="M84 242h552m-552 7h552M86 145h348m-310 0v89m276-89v89" />
    <g className="place-tram"><path className="place-stone" d="M210 232v-55q0-12 12-12h138q12 0 12 12v55Z" /><path d="M210 232v-55q0-12 12-12h138q12 0 12 12v55ZM217 189h148m-148 28h148M279 164l25-19h-41" /><Arcade x={221} y={211} count={6} width={17} height={31} gap={6} /><circle cx="235" cy="236" r="7" /><circle cx="347" cy="236" r="7" /></g>
  </g>;
}

function VictoryTower() {
  return <g data-subject="victory-tower"><path className="place-stone" d="M308 233V69h104v164Z" /><path d="M308 233V69h104v164M297 234h126m-133 6h140M301 69h118" /><Chhatri x={360} y={41} size={2.2} />{Array.from({length:7},(_,i)=><g key={i}><path d={`M302 ${85+i*21}h116m-113 4h110`} /><Arcade x={317} y={83+i*21} count={4} width={13} height={13} gap={11} /></g>)}</g>;
}

function Statue({ kind }) {
  return <g data-subject={kind}>
    <path className="place-fill-soft" d="M110 234q75-92 165-58t85 19v39H110Z" />
    <path className="art-ridge" d="M110 234q75-92 165-58t85 19m-100-36q55-32 120-12" />
    <path className="place-fill-soft" d="M360 195q65-38 145-21t105 60v0H360Z" />
    <path className="art-ridge" d="M360 195q65-38 145-21t105 60m-80-69q55-22 115-4" />
    <path className="place-stone" d="M215 244q25-22 60-22h170q35 0 60 22q-75 6-145 5t-145-5Z" />
    <path d="M215 244q25-22 60-22h170q35 0 60 22M250 233q110-4 220 0" />
    <path className="place-etch" d="M232 238l23-9h30m150 0h30l23 9M295 240q65-3 130 0" />
    <path d="M140 236h85m-70 5h65" />
    <path className="place-etch" d="M160 236v5m15-5v5m15-5v5m15-5v5" />
    <path className="place-stone-light" d="M305 222l10-14h90l10 14Z" />
    <path d="M305 222l10-14h90l10 14ZM300 222h120" />
    <path className="place-stone" d="M325 208l7-22h56l7 22Z" />
    <path d="M325 208l7-22h56l7 22ZM320 208h80m-72-22h64" />
    <path className="place-etch" d="M345 186l-2 22m17-22v22m17-22l2 22M338 215h44" />
    <path className="place-stone" d="M344 186v-4q0-4 5-4h5q4 0 4 4v4Zm18 0v-4q0-4 5-4h5q4 0 4 4v4Z" />
    <path d="M344 186v-4q0-4 5-4h5q4 0 4 4v4Zm18 0v-4q0-4 5-4h5q4 0 4 4v4ZM342 186h16m5 0h16" />
    <path className="place-stone" d="M353 52q-6-4-5-13 1-7 12-7 11 0 12 7 1 9-5 13l-1 6 19 6q4 10 3 31t-3 33l-6 0 1-13-1 20q2 19-3 43h-13q1-13 0-33-3-5-6 0-1 20 0 33h-13q-5-24-3-43l-1-20 1 13-6 0q-3-12-3-33t3-31l19-6Z" />
    <path d="M353 52q-6-4-5-13 1-7 12-7 11 0 12 7 1 9-5 13l-1 6 19 6q4 10 3 31t-3 33l-6 0 1-13-1 20q2 19-3 43h-13q1-13 0-33-3-5-6 0-1 20 0 33h-13q-5-24-3-43l-1-20 1 13-6 0q-3-12-3-33t3-31l19-6ZM346 62q14 8 28 0M344 65q7 27 8 60m24-60q-7 27-8 60M360 135v41" />
    <path className="place-etch" d="M338 72q4 24 4 48m44-48q-4 24-4 48M348 74q12 8 24 0m-22 12q10 7 20 0M360 67v65m-1-54h2m-2 12h2m-2 12h2m-2 12h2m-2 12h2M358 138v37m4-37v37M343 142q8 4 14 6m-15 11q9 4 15 6m-13 11q8 3 14 5M377 142q-8 4-14 6m15 11q-9 4-15 6m13 11q-8 3-14 5M347 43q-2 3 0 6m26-6q2 3 0 6M354 42q6-1 12 0m-6 0v5l3 1m-7 3h8" />
  </g>;
}

function OpenHand() {
  return <g data-subject="open-hand">
    <path className="place-fill-soft" d="M30 190q160-55 330-22t330 22v62H30Z" />
    <path className="art-ridge" d="M30 190q160-55 330-22t330 22" />
    <path className="place-garden" d="M60 248q140-16 300-16t300 16v32H60Z" />
    <path d="M50 250h620m-610 8h600" />
    <path className="art-crop-row" d="M90 236q120-22 240-6m60 0q120-16 240 6m-520 16q130-18 260-4m40 0q130-14 260 4" />
    {[110, 150, 190, 230, 490, 530, 570, 610].map(x => <circle key={x} className="art-blossoms" cx={x} cy="232" r="5" />)}
    {[130, 170, 210, 510, 550, 590].map(x => <circle key={x} className="art-blossoms" cx={x} cy="242" r="4" />)}
    <path className="place-stone" d="M260 248V135q0-55 100-55t100 55v113h-16V135q0-39-84-39t-84 39v113Z" />
    <path d="M260 248V135q0-55 100-55t100 55v113m-16 0V135q0-39-84-39t-84 39v113M252 248h32m136 0h32" />
    {[125, 145, 165, 185, 205, 225].map(y => <path key={y} className="place-etch" d={`M260 ${y}h16m168 0h16`} />)}
    <path className="place-etch" d="M280 115l15-15m-15 0l15 15m130-15l15 15m-15 0l15-15" />
    {[
      {x: 268, y: 220}, {x: 272, y: 190}, {x: 266, y: 160}, {x: 280, y: 130},
      {x: 310, y: 98}, {x: 360, y: 80}, {x: 410, y: 98}, {x: 440, y: 130},
      {x: 454, y: 160}, {x: 448, y: 190}, {x: 452, y: 220}
    ].map((pt, i) => (
      <g key={i}>
        <circle className="art-blossoms" cx={pt.x} cy={pt.y} r={i === 5 ? 7 : 5} />
        <circle className="place-garden" cx={pt.x + (i % 2 ? 4 : -4)} cy={pt.y + 3} r="2.5" />
      </g>
    ))}
    <path className="place-stone" d="M335 248v-12h50v12Zm10-12v-16h30v16Zm-20-16h70v-8h-70Zm25-8v-18h20v18Zm-15-18h50v-6h-50Z" />
    <path d="M335 248v-12h50v12m-40-12v-16h30v16m-45-16h70v-8h-70m25-8v-18h20v18m-15-18h50v-6h-50ZM325 248h70" />
    <path className="art-falling-water" d="M360 178v-14m0 0q-18 6-24 22m24-22q18 6 24 22m-24-18q-32 10-38 38m38-38q32 10 38 38" />
    <path className="art-water" d="M330 220q30-6 60 0m-70 16q40-8 80 0" />
    <path className="place-stone-light" d="M150 248v-45h20v45Zm400 0v-45h20v45Z" />
    <path d="M150 248v-45h20v45m380 0v-45h20v45M145 203h30m370 0h30" />
    <circle className="art-blossoms" cx="160" cy="195" r="8" />
    <circle className="art-blossoms" cx="560" cy="195" r="8" />
  </g>;
}

function CarvedTemple({ kind }) {
  const khajuraho=kind==='khajuraho';
  return <g data-subject={kind}><path className="place-stone-light" d="M211 234v-30h301v30Z" /><path d="M211 234v-30h301v30M200 237h324m-333 7h342" />
    {khajuraho ? <><Shikhara x={397} y={205} scale={.95} flag={false} /><Shikhara x={298} y={205} scale={.6} flag={false} /><Shikhara x={236} y={205} scale={.4} flag={false} /><Shikhara x={465} y={205} scale={.42} flag={false} /></> : <><Vimana x={395} y={206} scale={.88} tiers={12} /><path className="place-stone" d="M235 204v-49h101v49Z" /><Arcade x={245} y={202} count={4} width={15} height={34} gap={9} /><path d="M229 155h112l-16-17h-80Z" /></>}
  </g>;
}

export default function SupplementaryLandmark({ kind, detail }) {
  switch(kind) {
    case 'braj': return <Braj />;
    case 'kashi': case 'ghats': return <Ghats kind={kind} />;
    case 'puri': return <Puri />;
    case 'sangam': return <g data-subject={kind}><path className="place-stone" d="M250 194v-43h36v-12h150v12h37v43Z"/><path d="M250 194v-43h36v-12h150v12h37v43m-236 4h248M258 161h207"/><path className="art-water" d="M74 213q151-13 291 51M650 213q-151-13-285 51M86 225q143-10 279 44M637 225q-143-10-272 44"/><Boat x={203} y={240} scale={.65}/><Boat x={496} y={240} scale={.65}/><Boat x={350} y={258} scale={.5}/></g>;
    case 'cenotaphs': return <g data-subject={kind}>{[245,360,475].map((x,i)=><g key={x}><path className="place-stone" d={`M${x-43} 232v-63h86v63Z`}/><Arcade x={x-33} y={227} count={3} width={16} height={38} gap={9}/>{i===1?<Shikhara x={x} y={170} scale={.59} flag={false}/>:<Chhatri x={x} y={134} size={1.5}/>}<path d={`M${x-49} 234h98m-94 6h90`}/></g>)}<path className="art-reflection" d="M211 250h297m-264 9h232"/></g>;
    case 'kolkata': return <Kolkata />;
    case 'victory-tower': return <VictoryTower />;
    case 'unity': return <Statue kind={kind} />;
    case 'open-hand': return <OpenHand />;
    case 'monastery': case 'himalayan-palace': return <Monastery kind={kind} detail={detail} />;
    case 'pagoda-temple': case 'kerala-temple': case 'malabar-house': return <Pagoda kind={kind} />;
    case 'heritage-house': case 'punjab': case 'french-quarter': case 'tiled-coast': return <TownHouse kind={kind} />;
    case 'khajuraho': case 'brihadeeswara': return <CarvedTemple kind={kind} />;
    case 'lake-palace': return <g data-subject={kind}><path className="place-stone-light" d="M182 232v-64h354v64Z" /><path d="M182 232v-64h354v64M174 235h370" /><Arcade x={194} y={228} count={13} width={17} height={39} gap={9} />{[216,288,360,432,504].map((x,i)=><Chhatri key={x} x={x} y={i===2?113:137} size={i===2?2.1:1.3} />)}<path className="art-reflection" d="M194 246h332m-296 9h260m-191 8h130" /></g>;
    case 'stepwell': return <g data-subject={kind}><path className="place-stone" d="M168 134h384v104H168Z" /><Arcade x={184} y={170} count={10} width={23} height={32} gap={14} /><Arcade x={184} y={222} count={10} width={23} height={32} gap={14} /><path d="M161 132h398m-393 44h388m-388 7h388m-388 48h388M285 137v15h15v15h15v15h15v15h15v15h15v15h15v15m-100-105v20h15v15h15v15h15v15h15v15h15v15" /></g>;
    case 'wada': case 'rajwada': return <g data-subject={kind}><path className="place-stone" d="M201 235V138h67V96h182v42h67v97Z" /><path d="M201 235V138h67V96h182v42h67v97M195 236h329M268 138h182M278 96V75h162v21m-170-21 90-20 90 20ZM332 235v-64q27-30 54 0v64" /><Arcade x={282} y={128} count={7} width={15} height={22} gap={7} /><path d="M220 155v67m20-67v67m235-67v67m20-67v67m-172-73h75m-37 16v69" />{kind==='rajwada'&&<Arcade x={284} y={88} count={7} width={13} height={18} gap={9}/>}</g>;
    case 'island-temple': case 'ram-mandir': return <g data-subject={kind}><path className="place-stone-light" d="M185 230v-48h350v48Z" /><Arcade x={196} y={226} count={13} width={17} height={34} gap={9} /><Shikhara x={362} y={185} scale={.75}/><Shikhara x={251} y={185} scale={.45}/><Shikhara x={471} y={185} scale={.45}/><path d="M177 233h366m-375 7h384m-392 7h400" /></g>;
    case 'kamakhya': return <g data-subject={kind}><path className="place-stone" d="M270 231V161h179v70Z" /><path d="M270 231V161h179v70M260 233h199m-172-72q-20-64 73-101 93 37 73 101ZM315 160q-12-56 45-100 57 44 45 100M343 159q-7-58 17-99 24 41 17 99M351 62V49h18v13M360 49V31" /><Arcade x={286} y={226} count={5} width={21} height={37} gap={9}/></g>;
    case 'kachari': return <g data-subject={kind}>{[224,308,397,486].map((x,i)=><g key={x}><path className="place-stone" d={`M${x-14} 234v-${76+i%2*31}q-44-7-32-22 46-29 92 0 12 15-32 22v${76+i%2*31}Z`} /><path d={`M${x-14} 234v-${76+i%2*31}q-44-7-32-22 46-29 92 0 12 15-32 22v${76+i%2*31}ZM${x-21} 235h42`} /><path className="place-etch" d={`M${x-6} 225v-54m12 54v-54`}/></g>)}</g>;
    case 'naga-house': return <g data-subject={kind}><path className="place-stone" d="M235 233v-71l125-81 125 81v71Z" /><path className="art-tile-roof" d="m217 164 143-94 143 94-19 8-124-80-124 80Z" /><path d="M235 233v-71l125-81 125 81v71M217 164l143-94 143 94M360 79l-36-45m36 45 36-45m-142 146h212m-142 53v-43h36v43M252 193v30m16-30v30m16-30v30m16-30v30m16-30v30m88 0v-30m16 30v-30m16 30v-30m16 30v-30m16 30v-30" /></g>;
    case 'brick-gate': case 'barabati': return <g data-subject={kind}><path className="place-stone" d="M246 235V117h228v118h-69v-57q-45-43-90 0v57Z" /><path d="M246 235V117h228v118h-69v-57q-45-43-90 0v57ZM238 116h244m-235 15h226M309 235v-59q51-58 102 0v59" /><path className="place-etch" d="M253 143h53m107 0h54m-214 14h46m121 0h47m-214 15h39m135 0h40m-214 15h39m135 0h40m-214 15h39m135 0h40m-214 15h39m135 0h40" /></g>;
    case 'glasshouse': return <g data-subject={kind}>
      <path className="place-garden" d="M120 248q240-12 480 0v32H120Z" />
      <path d="M110 248h500m-490 6h480" />
      <path className="place-stone-light" d="M185 234V154h350v80Z" />
      <path d="M185 234V154h350v80M180 234h360M182 154h356M185 194h350" />
      <Arcade x={195} y={190} count={6} width={13} height={26} gap={7} />
      <Arcade x={195} y={230} count={6} width={13} height={28} gap={7} />
      <Arcade x={415} y={190} count={6} width={13} height={26} gap={7} />
      <Arcade x={415} y={230} count={6} width={13} height={28} gap={7} />
      <path d="M182 148h356" />
      {[188, 240, 290, 430, 480, 532].map(x => (
        <path key={x} className="place-stone" d={`M${x-4} 148v-8h8v8Z`} />
      ))}
      <Chhatri x={190} y={144} size={.9} />
      <Chhatri x={530} y={144} size={.9} />
      <path className="place-stone" d="M305 234V146h110v88Z" />
      <path d="M305 234V146h110v88M300 146h120" />
      <path className="place-stone-light" d="M302 146l58-22 58 22Z" />
      <path d="M302 146l58-22 58 22ZM336 142h48" />
      <circle cx="360" cy="136" r="5" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <path key={i} className="place-etch" d={`M${306 - i * 3} ${202 + i * 5}h${108 + i * 6}`} />
      ))}
      <path d="M308 202v32m104-32v32" />
      {[315, 330, 345, 360, 375, 390, 405].map(x => (
        <path key={x} d={`M${x} 146v54`} />
      ))}
      <path className="place-stone-light" d="M328 124V92h64v32Z" />
      <path d="M328 124V92h64v32M324 124h72M326 92h68" />
      {[335, 345, 355, 365, 375, 385].map(x => (
        <path key={x} className="art-window" d={`M${x-3} 99h6v18h-6Z`} />
      ))}
      <Dome x={360} y={92} radius={28} />
      <path className="art-golden-shrine" d="M354 58h12v-5h-12Zm2-5v-10h8v10Zm-2-10h12l-6-9Z" />
      <path d="M354 58h12v-5h-12Zm2-5v-10h8v10Zm-2-10h12l-6-9ZM360 34V24" />
      <Tree x={85} y={238} scale={1.25} />
      <Tree x={135} y={242} scale={.95} />
      <Tree x={585} y={242} scale={.95} />
      <Tree x={635} y={238} scale={1.25} />
    </g>;
    case 'tirumala': return <g data-subject={kind}>
      <path className="place-fill-soft" d="M80 248q120-40 200-90t80-38q80 38 200 90t80 38v32H80Z" />
      <path className="art-ridge" d="M60 252q130-46 220-102t80-26q80 26 220 102t100 26" />
      <path className="place-fill-soft" d="M140 252q100-30 170-68t50-20q50 20 170 68t110 20v28H140Z" />
      <path d="M335 248l15-28-12-24 18-28-10-24 14-20" />
      {[
        {x: 334, y: 244}, {x: 342, y: 232}, {x: 346, y: 220},
        {x: 342, y: 206}, {x: 350, y: 194}, {x: 354, y: 180},
        {x: 350, y: 168}, {x: 356, y: 154}, {x: 358, y: 142}
      ].map((pt, i) => (
        <path key={i} className="place-etch" d={`M${pt.x - 7} ${pt.y}h14`} />
      ))}
      <Tree x={120} y={246} scale={.85} />
      <Tree x={190} y={222} scale={.65} />
      <Tree x={530} y={222} scale={.65} />
      <Tree x={600} y={246} scale={.85} />
      <path className="place-stone-light" d="M290 128h140v8H290Z" />
      <path d="M285 128h150m-146 8h142" />
      <path className="art-golden-shrine" d="M298 128V84m-4 0h8m-6-4h4v4m-5 44h6" />
      <path className="place-stone" d="M312 128V98h96v30Z" />
      <path d="M312 128V98h96v30M308 128h104M310 98h100" />
      {[324, 340, 360, 380, 396].map(x => (
        <path key={x} className="place-etch" d={`M${x} 98v30`} />
      ))}
      <path d="M352 128v-18q8-10 16 0v18" />
      <g className="art-golden-shrine">
        <path className="place-stone" d="M320 98l8-14h64l8 14Z" />
        <path d="M320 98l8-14h64l8 14ZM316 98h88M326 84h68" />
        <path className="place-etch" d="M332 91h56m-50 4h44" />
        {[332, 346, 360, 374, 388].map(x => (
          <circle key={x} cx={x} cy="90" r="2.5" />
        ))}
        <path className="place-stone" d="M328 84l8-14h48l8 14Z" />
        <path d="M328 84l8-14h48l8 14ZM326 84h68M334 70h52" />
        <path className="place-etch" d="M340 77h40" />
        {[342, 354, 366, 378].map(x => (
          <circle key={x} cy="76" cx={x} r="2" />
        ))}
        <path className="place-stone" d="M336 70l10-12h28l10 12Z" />
        <path d="M336 70l10-12h28l10 12ZM334 70h52M344 58h32" />
        <path className="place-stone" d="M346 58q14-12 28 0Z" />
        <path d="M346 58q14-12 28 0" />
        <path d="M360 46V32m-4 10h8m-3-6h6m-5 12h4" />
      </g>
    </g>;
    case 'coorg': return <g data-subject={kind}>
      <path className="place-fill-soft" d="M40 248q90-60 190-30t180-40 180 30 90 40v32H40Z" />
      <path className="art-ridge" d="M30 252q100-64 200-34t180-40 180 30 100 44" />
      <path className="place-fill-soft" d="M120 252q110-38 240-20t240 20v28H120Z" />
      {[170, 210, 250, 450, 490, 530].map(x => (
        <circle key={x} className="place-garden" cx={x} cy="236" r="6" />
      ))}
      <path className="place-fort-stone" d="M140 234V154h55v80Z" />
      <path d="M140 234V154h55v80M134 234h67M138 154h59" />
      {[142, 154, 166, 178, 190].map(x => (
        <path key={x} d={`M${x} 154v-6h6v6`} />
      ))}
      <path className="place-etch" d="M145 174h45m-45 18h45m-45 18h45" />
      <path d="M165 188v12m-3-6h6" />
      <path className="place-fort-stone" d="M195 234v-56h85v56Z" />
      <path d="M195 234v-56h85v56M195 178h85" />
      {[202, 218, 234, 250, 266].map(x => (
        <path key={x} d={`M${x} 178v-5h7v5`} />
      ))}
      <path d="M225 234v-30q12-16 24 0v30" />
      <path className="art-tile-roof" d="M165 154l25-24h55l25 24Z" />
      <path d="M165 154l25-24h55l25 24ZM188 130h57" />
      <path className="place-stone" d="M208 130V96h20v34Z" />
      <path d="M208 130V96h20v34M205 96h26" />
      <circle cx="218" cy="106" r="4" />
      <path d="M218 96l10-12 10 12" />
      <path className="place-stone-light" d="M430 234v-68h140v68Z" />
      <path d="M430 234v-68h140v68M424 234h152M428 166h144" />
      <Arcade x={442} y={230} count={5} width={14} height={34} gap={12} />
      <path className="art-tile-roof" d="M414 166l18-18h136l18 18Z" />
      <path d="M414 166l18-18h136l18 18ZM430 148h140" />
      <path className="place-etch" d="M410 162q14 2 22-8m136 0q8 10 22 8" />
      <path className="place-stone" d="M448 148v-32h104v32Z" />
      <path d="M448 148v-32h104v32M444 116h112" />
      {[462, 482, 502, 522].map(x => (
        <path key={x} className="art-window" d={`M${x} 124h10v16h-10Z`} />
      ))}
      <path className="art-golden-shrine" d="M436 116l16-16h96l16 16Z" />
      <path d="M436 116l16-16h96l16 16ZM450 100h100" />
      <g className="art-golden-shrine">
        <circle cx="500" cy="88" r="7" />
        <path d="M500 81v14m-7-7h14M500 81V70" />
        <path d="M486 96q-4-8 2-12l6 4v8Zm28 0q4-8-2-12l-6 4v8Z" />
      </g>
      <path className="art-prayer-line" d="M380 135q45 22 80-8" />
      <g className="place-flags">
        {[0, 1, 2, 3, 4].map(i => (
          <path key={i} className="place-stone" d={`M${390 + i * 14} ${140 + Math.sin(i / 4 * Math.PI) * 7}v10l8 2v-10Z`} />
        ))}
      </g>
    </g>;
    case 'shore-temple': return <g data-subject={kind}><Vimana x={400} y={231} scale={.94} tiers={9}/><Vimana x={283} y={231} scale={.7} tiers={7}/><path d="M208 234h273m-280 7h288M214 231v-22h37m202 22v-22h25" /></g>;
    case 'rock-temple': return <g data-subject={kind}><path className="place-stone" d="m194 235 35-79 54-53 69-6 31 46 37 92Z" /><path d="m194 235 35-79 54-53 69-6 31 46 37 92M257 225l24-43-4-29 34-40m-66 92 17-29m76-50 17 27-5 27 24 41" /><path className="place-stone-light" d="M281 107V86h70v21Zm-6-22 16-13h50l15 13Z" /><Gopuram x={524} y={236} scale={.72} tiers={7}/></g>;
    case 'rock-memorial': return <g data-subject={kind}><path className="place-stone" d="m153 235 23-25 23-6 23 11 27-13 26 12 29-13 42 34Zm278 0 22-23 50 7 12 16Z" /><path className="place-stone-light" d="M190 211v-51h122v51Z" /><Arcade x={199} y={207} count={5} width={14} height={30} gap={8}/><Dome x={251} y={156} radius={23}/><path d="M184 160h134M465 217V179l-8-16 6-44q8-13 18 0l7 44-9 16v38m-23-100q-8-23 14-25 17 6 9 25M453 218h37" /></g>;
    case 'golghar': return <g data-subject={kind}>
      <path className="place-stone" d="M210 244q150-10 300 0v12H210Z" />
      <path d="M205 244h310m-315 6h320m-325 6h330" />
      <path className="place-stone-light" d="M246 234q-7-129 114-171 121 42 114 171Z" />
      <path d="M246 234q-7-129 114-171 121 42 114 171ZM238 236h244" />
      <path d="M253 230q36-80 107-161m107 161q-36-80-107-161" />
      {[0,1,2,3,4,5,6,7,8,9].map(i=><path key={`l${i}`} className="place-etch" d={`M${256+i*9} ${222-i*15}h14`} />)}
      {[0,1,2,3,4,5,6,7,8,9].map(i=><path key={`r${i}`} className="place-etch" d={`M${450-i*9} ${222-i*15}h14`} />)}
      <path className="place-stone" d="M346 64v-10h28v10Z" />
      <path d="M342 64h36m-32-10h28m-14-10v10" />
      <path d="M348 234v-25q12-20 24 0v25" />
    </g>;
    default: return null;
  }
}
