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
  return <g data-subject={kind}><path className="place-stone" d="M329 63q-9-30 12-37 20-8 31 10l-4 26 18 20 14 64-17 8-3-35-5 61 4 48h-26l-8-56-9 56h-28l12-59-6-53-9 33-16-5 20-62Z" /><path d="M329 63q-9-30 12-37 20-8 31 10l-4 26 18 20 14 64-17 8-3-35-5 61 4 48h-26l-8-56-9 56h-28l12-59-6-53-9 33-16-5 20-62Zm-9 19 12 22 36-33m-30 33-9 61m25-58 8 61m-43-9h57M298 231h91l13 14H285Z" /><path className="place-etch" d="m315 92 8 18m47-20-11 27m-37 29 49-7m-51 14 50-6M336 46h5m14 0h5m-22 10q7 4 14 0" /></g>;
}

function OpenHand() {
  return <g data-subject="open-hand"><path className="place-stone" d="M354 213V127l-25-25-35-8q-12-9 0-15l36 9-31-33q-7-13 5-13l35 26-7-48q5-16 13-2l15 46 7-47q8-12 12 2l-1 48 17-33q11-6 13 6l-15 45q24-22 31-10 3 11-15 28l-32 25v85Z" /><path d="M354 213V127l-25-25-35-8q-12-9 0-15l36 9-31-33q-7-13 5-13l35 26-7-48q5-16 13-2l15 46 7-47q8-12 12 2l-1 48 17-33q11-6 13 6l-15 45q24-22 31-10 3 11-15 28l-32 25v85M329 214h72m-90 13h108M124 218v-53h139v53m-153-54h168l-14-14H124ZM444 217v-80h142v80m-151-83h161l-8-15H449Z" /><Arcade x={456} y={214} count={5} width={16} height={65} gap={11} /></g>;
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
    case 'glasshouse': return <g data-subject={kind}><path className="art-glass" d="M185 234v-80h100v-44q75-67 150 0v44h100v80Z" /><path d="M185 234v-80h100v-44q75-67 150 0v44h100v80M175 235h370M185 166h350M185 189h350M185 212h350M285 110h150m-150 20h150M360 63v171m-50-146v145m25-161v162m50-162v162m25-146v146m-210-67v67m25-67v67m25-67v67m25-67v67m170-67v67m25-67v67m25-67v67m25-67v67" /></g>;
    case 'tirumala': return <g data-subject={kind}><Gopuram x={228} y={234} scale={.68} tiers={6}/><g className="art-golden-shrine"><Gopuram x={423} y={234} scale={.85} tiers={4}/><Dome x={423} y={116} radius={23}/></g><path d="M180 238h307m-315 7h323" /></g>;
    case 'shore-temple': return <g data-subject={kind}><Vimana x={400} y={231} scale={.94} tiers={9}/><Vimana x={283} y={231} scale={.7} tiers={7}/><path d="M208 234h273m-280 7h288M214 231v-22h37m202 22v-22h25" /></g>;
    case 'rock-temple': return <g data-subject={kind}><path className="place-stone" d="m194 235 35-79 54-53 69-6 31 46 37 92Z" /><path d="m194 235 35-79 54-53 69-6 31 46 37 92M257 225l24-43-4-29 34-40m-66 92 17-29m76-50 17 27-5 27 24 41" /><path className="place-stone-light" d="M281 107V86h70v21Zm-6-22 16-13h50l15 13Z" /><Gopuram x={524} y={236} scale={.72} tiers={7}/></g>;
    case 'rock-memorial': return <g data-subject={kind}><path className="place-stone" d="m153 235 23-25 23-6 23 11 27-13 26 12 29-13 42 34Zm278 0 22-23 50 7 12 16Z" /><path className="place-stone-light" d="M190 211v-51h122v51Z" /><Arcade x={199} y={207} count={5} width={14} height={30} gap={8}/><Dome x={251} y={156} radius={23}/><path d="M184 160h134M465 217V179l-8-16 6-44q8-13 18 0l7 44-9 16v38m-23-100q-8-23 14-25 17 6 9 25M453 218h37" /></g>;
    case 'golghar': return <g data-subject={kind}><path className="place-stone-light" d="M256 232q-7-129 104-171 111 42 104 171Z" /><path d="M256 232q-7-129 104-171 111 42 104 171ZM248 235h224M263 228q36-80 97-161m97 161q-36-80-97-161M266 220h15m-8-12h16m-8-12h17m-8-12h17m-8-12h17m-9-12h17m-9-12h17m-9-12h17m-9-12h16m-8-12h15m-7-12h13M345 233v-25q15-20 30 0v25" /></g>;
    default: return null;
  }
}
