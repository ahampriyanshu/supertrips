import SupplementaryLandmark from './SupplementaryLandmarks.jsx';
import { Arcade, Chhatri, Dome, Gopuram, Shikhara, Tree } from './IllustrationParts.jsx';

function Adiyogi() {
  return <g data-subject="adiyogi">
    <path className="art-adiyogi-hair" d="M218 239q12-34 58-45-17-12-8-39-14-20-1-44-5-27 11-45 1-30 26-33 10-22 29-17 13-17 29-7 20-8 30 8 22-5 32 18 24 9 21 36 20 23 8 47 17 22 7 43 23 6 22 35 44 13 60 41Z" />
    <path className="art-adiyogi-face" d="M225 239q13-25 75-38 26-8 27-32-25-14-29-45-12-43 5-68 20-27 57-26 38-1 57 26 17 25 5 68-4 31-29 45 1 24 27 32 62 13 75 38Z" />
    <path className="art-adiyogi-line" d="M303 62q-17 35-5 71l17 22 19 9h52l19-9 17-22q12-36-5-71M327 166q6 34-12 42m78-42q-6 34 12 42M309 90q14-13 31-3m40 0q17-10 31 3M312 96q12-10 27-3m42 0q15-7 27 3M353 94l-5 28q12 7 24 0l-5-28M341 139q19-9 38 0m-31 6q12 3 24 0M298 107q-13-8-10 14 1 17 12 15m122-29q13-8 10 14-1 17-12 15M310 206q50 38 100 0" />
    <path className="art-adiyogi-line art-hair-lines" d="M307 32q-25 16-24 39m38-46q-23 14-24 28m39-35q-14 7-20 20m32-25-7 18m42-12q16 13 19 26m-7-17q26 15 30 47M278 108q9 21-4 40m14-16q10 29-3 54m-10-15q-8 18 8 23m154-87q-8 25 5 45m-15-17q-10 29 3 54m15-9 9 13" />
    <path className="art-adiyogi-brow" d="M308 88q15-15 33-3l-3 5q-15-8-30 3Zm104 0q-15-15-33-3l3 5q15-8 30 3Z" />
    <path className="art-adiyogi-mark" d="M360 48q-13 19 0 22 13-3 0-22Z" />
    <path className="art-adiyogi-moon" d="M424 23c-13 27 8 48 36 35-27 28-62-3-36-35Z" />
    <ellipse className="art-adiyogi-earring" cx="294" cy="140" rx="7" ry="10" /><ellipse className="art-adiyogi-earring" cx="426" cy="140" rx="7" ry="10" />
    <path d="M207 243h304m-318 6h332m-281 7h228" />
    <g className="place-stone-light"><path d="M324 239v-15h72v15Zm-9-15h90l-16-5h-58Z" /><path d="M333 225v14m12-14v14m30-14v14m12-14v14" /></g>
  </g>;
}

function Taj({ maqbara = false }) {
  return <g data-subject={maqbara ? 'maqbara' : 'taj'}>
    <path className="place-stone-light" d="M234 229v-73h58v-28h136v28h58v73Z" /><path d="M234 229v-73h58v-28h136v28h58v73M222 230h276m-288 7h300M292 148h136M292 229V128m136 101V128" />
    <Dome x={360} y={128} radius={51} onion /><Chhatri x={266} y={149} size={.85} /><Chhatri x={454} y={149} size={.85} />
    <path d="M333 229v-48q0-23 27-37 27 14 27 37v48m-47 0v-47q20-29 40 0v47M244 215v-26q13-19 26 0v26Zm206 0v-26q13-19 26 0v26Z" />
    {[193, 527].map(x => <g key={x}><path className="place-stone-light" d={`M${x - 8} 229V91h16v138Z`} /><path d={`M${x - 8} 229V91h16v138M${x - 12} 229h24m-23-45h22m-22-5h22m-22-41h22m-22-5h22m-22-42h22`} /><Chhatri x={x} y={70} size={.7} /></g>)}
    {!maqbara && <><path className="art-water-fill" d="m342 240-37 38h110l-37-38Z" /><path d="m332 240-48 38m104-38 48 38m-90-26h29m-39 12h49" /><Tree x={155} y={244} scale={.7} pine /><Tree x={565} y={244} scale={.7} pine /></>}
  </g>;
}

function GoldenTemple() {
  return <g data-subject="golden-temple"><path className="place-stone-light" d="M95 195h530v14H95Z" /><Arcade x={100} y={193} count={23} width={14} height={22} gap={9} />
    <path className="art-gold" d="M275 227v-89h170v89Z" /><path d="M275 227v-89h170v89m-178 0h186m-178-51h170m-176-38h182M298 176v-32m124 32v-32" />
    <Dome x={360} y={129} radius={33} onion /><Chhatri x={293} y={129} size={.75} /><Chhatri x={427} y={129} size={.75} />
    <Arcade x={288} y={222} count={7} width={13} height={30} gap={9} /><Arcade x={311} y={169} count={5} width={12} height={22} gap={8} />
    <path d="M348 138v31m24-31v31M95 221h179m-179 9h179M95 218v15m18-15v15m18-15v15m18-15v15m18-15v15m18-15v15m18-15v15m18-15v15m18-15v15" />
    <path className="art-reflection" d="M283 239h154m-145 8h135m-105 8h75m-58 7h40" />
  </g>;
}

function Charminar() {
  return <g data-subject="charminar">{[298,422].map(x=><g key={x}><path className="place-stone-light" d={`M${x-8} 131V76h16v55Z`}/><path d={`M${x-11} 102h22m-22 4h22M${x-8} 131V76h16v55`}/><Dome x={x} y={76} radius={12} onion/></g>)}<path className="place-stone" d="M263 235V130h194v105Z" /><path d="M263 235V130h194v105M305 235v-48q0-35 55-49 55 14 55 49v48m-99 0v-47q0-28 44-39 44 11 44 39v47M257 126h206m-201-10h196" /><Arcade x={276} y={114} count={10} width={10} height={17} gap={8} />
    {[264, 456].map(x => <g key={x}><path className="place-stone-light" d={`M${x - 13} 235V65h26v170Z`} /><path d={`M${x - 13} 235V65h26v170M${x - 17} 65h34m-34 25h34m-34 6h34m-34 38h34m-34 6h34m-34 40h34m-26-107v13m9-13v13m9-13v13`} /><Dome x={x} y={64} radius={17} onion /></g>)}
    <path d="M240 240h240m-223 6h206" />
  </g>;
}

function Mahabodhi() {
  return <g data-subject="mahabodhi"><Tree x={477} y={238} scale={1.5} />
    <path className="place-stone" d="M282 235v-42l37-137h67l37 137v42Z" /><path d="M282 235v-42l37-137h67l37 137v42M275 236h156M315 56h75m-65-7h55m-47-6h39M352 43V28m-6 0h12m-6-8v8M334 235v-34q18-25 36 0v34" />
    {Array.from({length:7}, (_,i) => <g key={i}><path d={`M${286 + i * 5} ${191 - i * 19}h${133 - i * 10}`} /><Arcade x={299 + i * 5} y={186 - i * 19} count={5} width={8} height={12} gap={Math.max(5, 14-i)} /></g>)}
    {[275, 430].map(x => <g key={x}><path className="place-stone-light" d={`M${x - 16} 234v-47l16-34 16 34v47Z`} /><path d={`M${x - 16} 234v-47l16-34 16 34v47m-35-40h38m-33-9h28`} /></g>)}
  </g>;
}

function StoneChariot() {
  return <g data-subject="stone-chariot"><Gopuram x={535} y={214} scale={.6} tiers={6} />
    <path className="place-stone" d="M240 216v-18h29v-66h23v-15h91v15h23v66h29v18Z" /><path d="M240 216v-18h29v-66h23v-15h91v15h23v66h29v18Zm22-84h151m-137-9h123M285 197v-57m15 57v-57m76 57v-57m15 57v-57M252 206h172" />
    <path className="place-stone-light" d="m283 117 10-17h90l10 17Zm13-17 10-16h64l10 16Zm16-16V73h52v11Zm12-11 14-13 14 13Z" />
    <path d="m283 117 10-17h90l10 17Zm13-17 10-16h64l10 16Zm16-16V73h52v11Zm12-11 14-13 14 13Z" /><Arcade x={306} y={190} count={2} width={24} height={44} gap={14} />
    {[277, 399].map(x => <g key={x}><circle className="place-stone-light" cx={x} cy="223" r="22" /><circle cx={x} cy="223" r="15" /><circle cx={x} cy="223" r="4" />{[0,45,90,135].map(angle => <path key={angle} transform={`rotate(${angle} ${x} 223)`} d={`M${x-15} 223h30`} />)}</g>)}
    <path d="M235 248h216m-182 6h149" />
  </g>;
}

function Palace({ kind }) {
  const clock = kind === 'clock-palace', mysore = kind === 'mysore-palace';
  return <g data-subject={kind}>
    <path className="place-stone" d="M192 235v-82h72v-31h61V89h70v33h61v31h72v82Z" /><path d="M192 235v-82h72v-31h61V89h70v33h61v31h72v82M184 236h352M192 178h336M264 153h192M325 121h70" />
    <Arcade x={205} y={230} count={13} width={16} height={38} gap={8} /><Arcade x={278} y={172} count={7} width={15} height={30} gap={9} />
    {mysore ? <><Dome x={360} y={89} radius={25} onion /><Dome x={216} y={152} radius={19} onion /><Dome x={504} y={152} radius={19} onion /><Dome x={283} y={122} radius={16} onion /><Dome x={437} y={122} radius={16} onion /></> : <><path className="place-stone-light" d="M334 89V52h52v37Zm-5-37 31-30 31 30Z" /><path d="M334 89V52h52v37m-57-37 31-30 31 30ZM348 89V77h24v12" /><Chhatri x={221} y={132} /><Chhatri x={496} y={132} /></>}
    {clock && <><circle cx="360" cy="65" r="9" /><path d="M360 59v6l5 3" /></>}
    <path className="place-etch" d="M198 184h324M270 129h48m84 0h48M198 160h58m208 0h58" />
  </g>;
}

function Fort({ kind, detail }) {
  const long = detail === 'long-wall', cliff = kind === 'cliff-fort';
  return <g data-subject={kind}>
    <path className="place-fort-stone" d="M186 223V129h32v-17h53v13h36V98h84v16h45v17h56v-19h40v111Z" />
    <path d="M186 223V129h32v-17h53v13h36V98h84v16h45v17h56v-19h40v111M178 224h362M185 151h346M307 124h84M327 223v-46q22-34 44 0v46" />
    {[191,209,227,245,263,281,299,317,335,353,371,389,407,425,443,461,479,497,515].map((x,i) => <path key={x} d={`M${x} ${i<2?128:i<5?111:i<7?124:i<12?97:i<14?113:i<17?130:111}v-7h7v7`} />)}
    {detail === 'red-fort' && <g><Arcade x={230} y={145} count={10} width={12} height={24} gap={12}/><Chhatri x={337} y={75}/><Chhatri x={369} y={75}/></g>}
    <Arcade x={200} y={186} count={5} width={10} height={19} gap={12} /><Arcade x={402} y={185} count={5} width={10} height={19} gap={12} />
    {long && <path d="m178 223-46 7-14-23-33 1-13-24-33-5m139 52-51 6-16-22-31 1-15-24-31-5m497 35 49-5 24 17 51-3m-124-6 49-5 24 17 51-3" />}
    {(kind === 'desert-fort' || kind === 'gwalior-fort') && <>{[207,291,429,513].map(x=><g key={x}><path className="place-stone-light" d={`M${x-17} 223V155q17-13 34 0v68Z`} /><path d={`M${x-17} 223V155q17-13 34 0v68m-37-65h40`} /><Chhatri x={x} y={133} size={.8} /></g>)}</>}
    {kind === 'gwalior-fort' && <path className="art-tile-band" d="M191 188h335m-335 7h335" />}
    {cliff && <path className="place-stone" d="m178 225 17 25h339l6-25Z" />}
  </g>;
}

function Church({ kind }) {
  return <g data-subject={kind}><path className="place-stone-light" d="M245 235V121h34V91h35V65h92v26h35v30h34v114Z" /><path d="M245 235V121h34V91h35V65h92v26h35v30h34v114M237 236h246M245 147h230M279 116h162M314 91h92M335 235v-50a25 25 0 0 1 50 0v50" /><Arcade x={259} y={226} count={2} width={17} height={44} gap={10} /><Arcade x={417} y={226} count={2} width={17} height={44} gap={10} /><path d="M352 128V110h16v18ZM360 65V40m-10 9h20m-86 42V77m-7 5h14m145 9V77m-7 5h14M260 154v76m200-76v76" /><circle cx="360" cy="84" r="7" /></g>;
}

function Shrine({ kind }) {
  const mayapur = kind === 'mayapur', stupa = kind === 'stupa', lakeMosque = kind === 'lakeside-mosque';
  if (['shrine', 'shrine-pool'].includes(kind)) return <g data-subject={kind}>
    <path className="place-stone-light" d="M259 233v-59h202v59Z" /><path d="M250 236h220M259 174h202" />
    <Arcade x={271} y={229} count={7} width={17} height={38} gap={9}/>
    <Shikhara x={360} y={174} scale={kind === 'shrine' ? .56 : .67}/>
    <path className="art-reflection" d="M255 247h210m-185 9h160" />
  </g>;
  return <g data-subject={kind}>
    <path className="place-stone-light" d="M232 232v-70h256v70Z" /><path d="M232 232v-70h256v70M221 234h278m-266-64h254" />
    <Dome x={360} y={160} radius={stupa ? 82 : mayapur ? 56 : 43} onion={mayapur || lakeMosque || kind === 'dargah-ghats'} />
    <Arcade x={247} y={229} count={9} width={17} height={37} gap={9} />
    {!stupa && <><Dome x={260} y={160} radius={24} onion /><Dome x={460} y={160} radius={24} onion /></>}
    {lakeMosque && <>{[215,505].map(x=><g key={x}><path className="place-stone" d={`M${x-9} 232V91h18v141Z`} /><path d={`M${x-9} 232V91h18v141m-22-100h26m-26-6h26`} /><Dome x={x} y={90} radius={13} onion /></g>)}</>}
    {stupa && <path d="M350 77V65h20v12M347 64h26M360 65V45m-19 13h38" />}
    {mayapur && <path className="art-tile-band" d="M308 158q-10-42 52-87 62 45 52 87" />}
  </g>;
}

function Gateway({ kind }) {
  const rumi = kind === 'rumi';
  return <g data-subject={kind}>
    <path className="place-stone" d="M249 235V127h31V96h160v31h31v108h-52v-61q0-45-59-60-59 15-59 60v61Z" /><path d="M249 235V127h31V96h160v31h31v108h-52v-61q0-45-59-60-59 15-59 60v61ZM242 236h236M249 145h39m143 0h40M273 127h174M280 102h160" />
    <path d="M310 235v-60q0-34 50-51 50 17 50 51v60M258 160h20v40h-20zm184 0h20v40h-20Z" />
    {rumi ? <><Chhatri x={360} y={67} size={1.2} /><path d="M284 96q16-29 76-29t76 29M306 94q7-15 18-17m72 17q-7-15-18-17" /></> : <><Chhatri x={272} y={104} /><Chhatri x={448} y={104} /><path d="M322 96V80h76v16m-80-16h84M295 103v21m16-21v21m98-21v21m16-21v21" /></>}
  </g>;
}

export default function RegionalLandmark({ kind, detail }) {
  switch (kind) {
    case 'adiyogi': return <Adiyogi />;
    case 'taj': case 'maqbara': return <Taj maqbara={kind === 'maqbara'} />;
    case 'golden-temple': return <GoldenTemple />;
    case 'charminar': return <Charminar />;
    case 'mahabodhi': return <Mahabodhi />;
    case 'stone-chariot': return <StoneChariot />;
    case 'clock-palace': case 'mysore-palace': return <Palace kind={kind} />;
    case 'hill-fort': case 'cliff-fort': case 'desert-fort': case 'gwalior-fort': case 'bastion': case 'coastal-fort': case 'brick-fort': return <Fort kind={kind} detail={detail} />;
    case 'goan-church': case 'hill-church': return <Church kind={kind} />;
    case 'shrine': case 'shrine-pool': case 'dargah-ghats': case 'stupa': case 'lakeside-mosque': case 'mayapur': return <Shrine kind={kind} />;
    case 'gateway': case 'rumi': return <Gateway kind={kind} />;
    case 'gopuram': return <g data-subject={kind}><Gopuram x={385} tiers={detail === 'meenakshi' ? 8 : 7} /><Gopuram x={208} scale={.57} tiers={6} /><path d="M126 238h422m-410 7h400" /></g>;
    case 'shikhara': return <g data-subject={kind}><Shikhara x={380} /><Shikhara x={261} scale={.54} flag={false} /><path d="M188 238h279m-291 7h303" /></g>;
    default: return <SupplementaryLandmark kind={kind} detail={detail} />;
  }
}
