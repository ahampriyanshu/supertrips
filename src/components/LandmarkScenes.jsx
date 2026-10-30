// Original, simplified line drawings; these are postcard compositions, not a
// geographic skyline. Landmark references are documented in themes/landmarks.md.
function QutubMinar() {
  return (
    <g data-landmark="Qutub Minar">
      <path className="place-stone" d="m71 236 7-60 5-44 4-37 4-31 2-28h12l2 28 4 31 4 37 5 44 7 60Z" />
      <path d="m71 236 7-60 5-44 4-37 4-31 2-28h12l2 28 4 31 4 37 5 44 7 60M68 236h62m-39-200h16m-15-4h14m-8-8v8" />
      <path className="place-stone-light" d="M89 61h20v5H89Zm-4 31h28v6H85Zm-4 36h36v7H81Zm-6 44h48v8H75Z" />
      <path d="M89 61h20v5H89Zm-4 31h28v6H85Zm-4 36h36v7H81Zm-6 44h48v8H75Z" />
      <path className="place-etch" d="m79 232 6-48m2 48 4-48m4 48 1-48m8 48-1-48m9 48-4-48m12 48-6-48M86 168l4-29m3 29 2-29m8 29-1-29m10 29-4-29M90 123l3-20m5 20v-20m9 20-3-20M94 86l2-15m7 15-2-15M97 55V42m5 13-1-13" />
      <path d="M66 242h66m-69 5h72" />
    </g>
  );
}

function LalQila() {
  return (
    <g data-landmark="Lal Qila">
      <path className="place-stone" d="M147 246v-53h20v-26h28v15h78v-15h28v26h22v53Z" />
      <path d="M147 246v-53h20v-26h28v15h78v-15h28v26h22v53M140 247h190M167 193h28m78 0h28M147 205h48m78 0h50M195 246v-64h78v64" />
      <path className="place-stone-light" d="M164 166h34q-3-11-17-18-14 7-17 18Zm106 0h34q-3-11-17-18-14 7-17 18Z" />
      <path d="M164 166h34q-3-11-17-18-14 7-17 18Zm106 0h34q-3-11-17-18-14 7-17 18ZM181 148v-7m106 7v-7M173 169v13m16-13v13m-12-13v13m104-13v13m12-13v13m-6-13v13" />
      <path d="M200 182v-7h7v7h8v-7h7v7h8v-7h7v7h8v-7h7v7h8v-7h7v7M148 193v-6h6v6h7v-6h6m134 6v-6h6v6h7v-6h7v6" />
      <path className="place-arch-shadow" d="M219 246v-26q0-11 15-19 15 8 15 19v26Z" />
      <path d="M214 246v-28q0-15 20-25 20 10 20 25v28m-35 0v-26q0-11 15-19 15 8 15 19v26M173 217v-9q8-11 16 0v9Zm108 0v-9q8-11 16 0v9Z" />
      <path className="place-etch" d="M151 229h40m-40 5h40m-40 5h40m86-10h42m-42 5h42m-42 5h42M203 191v50m62-50v50" />
      <path d="M234 172v-30m0 2h20v11h-20" />
    </g>
  );
}

function Parliament() {
  return (
    <g data-landmark="Parliament">
      {/* The current Sansad Bhavan: a low, triangular plan, seen obliquely. */}
      <path className="place-stone" d="m350 214 69-46h16l116 43v22l-15 10-180-7Z" />
      <path className="place-stone-light" d="m350 214 69-46h16l116 43-15 11-180-7Z" />
      <path d="m350 214 69-46h16l116 43v22l-15 10-180-7Zm0 0 186 8 15-11m-15 11v21M356 218l174 8m-173 6 173 7" />
      <path className="place-garden" d="m399 205 28-22 57 24-3 5-80-3Z" />
      <path d="m399 205 28-22 57 24-3 5-80-3Z" />
      {Array.from({ length: 20 }, (_, i) => <path key={i} className="place-etch" d={`M${364 + i * 8} ${219 + i * .35}v12`} />)}
      <path className="place-arch-shadow" d="m433 223 23 1v13l-23-1Z" />
      <path d="m433 223 23 1v13m-26 2 30 1m-33 3 36 1M457 189v-12m-4 0h8m-7-3h6m-5-3h4" />
    </g>
  );
}

function IndiaGate() {
  return (
    <g data-landmark="India Gate">
      <path className="place-stone-light" d="M595 246V146h6v-23h67v23h6v100h-22v-57a18 18 0 0 0-36 0v57Z" />
      <path d="M595 246V146h6v-23h67v23h6v100h-22v-57a18 18 0 0 0-36 0v57ZM591 147h87M599 135h71m-63-12v-7h55v7M606 157h57M590 247h89m-93 5h97M603 166v68m62-68v68M612 132h45" />
      <path className="place-etch" d="M604 216h9m-9 6h9m-9 6h9m-9 6h9m42-18h9m-9 6h9m-9 6h9m-9 6h9M605 239h9m40 0h9" />
    </g>
  );
}

export function DelhiScene() {
  return (
    <>
      <circle className="place-delhi-sun" cx="563" cy="68" r="31" />
      <g className="place-garden">
        <path d="M18 249v-24c-17-5-13-23-3-26-4-19 13-27 23-18 15-2 23 13 16 24 14 15 1 25-13 25v19Zm524-4v-55c-17-4-20-19-10-29-2-19 19-27 30-12 18 0 23 22 11 31 7 14-4 22-17 23v42Z" />
        <path d="M325 250q0-17 15-15 6-20 23-12l17 26Zm236 0q6-18 17-11 12-21 26-5v16ZM137 248q0-11 10-11l8 11Z" />
      </g>
      <path className="place-garden-line" d="M29 249v-40m0 14-8-9m8 3 10-14m-4 48h-20m535-8v-66m0 28 13-17m-13 8-11-14" />
      <QutubMinar />
      <LalQila />
      <Parliament />
      <IndiaGate />
      <path className="place-ground" d="M14 253h683M52 260h185m53 0h109m124 0h146" />
      <g className="place-delhi-birds"><path d="M159 83q8-9 16 0 8-9 16 0m79-29q6-7 12 0 6-7 12 0m249-22q6-6 12 0 6-6 12 0" /></g>
    </>
  );
}

function Jharokha({ x, y, width = 22, height = 29 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="place-jharokha-face" d={`M0 ${height}V7Q0 1 ${width / 2} -4Q${width} 1 ${width} 7v${height - 7}Z`} />
      <path d={`M0 ${height}V7Q0 1 ${width / 2} -4Q${width} 1 ${width} 7v${height - 7}ZM-2 7Q0-2 ${width / 2}-7Q${width}-2 ${width + 2} 7M-2 ${height}h${width + 4}l-3 3H1Z`} />
      <path className="place-arch-shadow" d={`M5 ${height - 5}V12q0-7 ${width / 2 - 5}-8q${width / 2 - 5} 1 ${width / 2 - 5} 8v${height - 17}Z`} />
      <path className="place-jaali" d={`M${width / 2} 7v${height - 12}M5 15h${width - 10}M5 21h${width - 10}`} />
    </g>
  );
}

function HawaMahal() {
  const rows = [
    { y: 215, count: 11, start: 54, step: 27, width: 21, height: 30 },
    { y: 174, count: 11, start: 54, step: 27, width: 21, height: 30 },
    { y: 133, count: 9, start: 81, step: 27, width: 21, height: 30 },
    { y: 92, count: 7, start: 108, step: 27, width: 21, height: 30 },
    { y: 51, count: 5, start: 135, step: 27, width: 21, height: 30 },
  ];
  return (
    <g data-landmark="Hawa Mahal">
      <path className="place-stone" stroke="none" d="M47 253v-73h27v-40h27V99h27V71l17-10 27-8 27-11 27 11 27 8 17 10v28h27v41h27v40h27v73Z" />
      <path d="M47 199v54h304v-54M42 253h314" />
      {rows.map(row => (
        <g key={row.y}>
          <path className="place-jaali" d={`M${row.start - 6} ${row.y + row.height + 5}h${(row.count - 1) * row.step + row.width + 12}`} />
          {Array.from({ length: row.count }, (_, i) => (
            <Jharokha
              key={i}
              x={row.start + i * row.step + (i % 2 ? 3 : -2)}
              y={row.y + (row.y === 51 ? Math.abs(i - 2) * 6 : i % 2 ? 4 : 0)}
              width={row.width + (i % 2 ? -6 : 4)}
              height={row.height - (row.y === 51 ? Math.abs(i - 2) * 6 : i % 2 ? 4 : 0)}
            />
          ))}
        </g>
      ))}
      {/* Five crowned bays on the upper storey, with the central one highest. */}
      {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${145.5 + i * 27} ${42 + Math.abs(i - 2) * 6}v-6`} />)}
      <path className="place-etch" d="M49 250h300M50 211h297M78 170h239M104 129h185M131 88h131" />
    </g>
  );
}

function JaipurForts() {
  return (
    <>
      <g className="place-jaipur-hills">
        <path d="M322 213q44-40 63-60 20-19 45-13 39-20 65-56 30-26 64-20 43-9 78 24 28 16 69 11v155H322Z" />
        <path className="place-hill-contour" d="M375 219q43-42 68-36 46-31 71-65m72 4q34 17 45 46 29 21 69 26" />
      </g>
      <g data-landmark="Jaigarh’s hilltop walls" className="place-jaigarh">
        <path d="m453 133 24-28 22-11V73h36V62h30v8l24 4 16 13 18 7v18m-170 29 24-28 22-11V81h36V70h30v8l24 4 16 13 18 7M458 126v-8m10-4v-9m12-3v-9m12 4v-8m8-10v-9m9 9v-9m9 9v-9m9 9v-9m10 0v-12m9 12V58m9 12V58m10 20V66m10 13V69m10 14V73m10 17V80m10 16V86m10 16V91" />
        <path className="place-stone-light" d="M534 70V57h32v13Z" /><path d="M534 70V57h32v13m-34-13h36M539 57v-8h6v8m9 0v-8h6v8" />
      </g>
      <g data-landmark="Amer Fort">
        <path className="place-fort-stone" d="M388 225v-60h24v-17h71v-21h36v21h64v17h24v60Z" />
        <path d="M388 225v-60h24v-17h71v-21h36v21h64v17h24v60M383 226h229M388 178h219M412 159h71m36 0h64M388 201h219M423 225v-47m150 47v-47" />
        <path className="place-stone-light" d="M477 147v-17h48v17Zm-66 1v-15h20v15Zm150 0v-15h20v15Z" />
        <path d="M477 147v-17h48v17m-51-17h54m-50-5h46l-4-6h-38ZM411 148v-15h20v15m-23-15 13-9 13 9Zm153 15v-15h20v15m-23-15 13-9 13 9Z" />
        {[481, 490, 499, 508, 517].map(x => <path key={x} d={`M${x} 145v-8q3-5 6 0v8Z`} />)}
        <path d="M474 153h54v19h-54Zm5 14v-6q3-5 6 0v6m4 0v-6q3-5 6 0v6m4 0v-6q3-5 6 0v6m4 0v-6q3-5 6 0v6m4 0v-6q3-5 6 0v6" />
        <path className="place-arch-shadow" d="M487 225v-25q0-12 14-17 14 5 14 17v25Z" />
        <path d="M481 225v-27q0-15 20-22 20 7 20 22v27m-34 0v-25q0-12 14-17 14 5 14 17v25" />
        {[435, 452, 537, 554].map(x => <path key={x} d={`M${x} 195v-9q4-6 8 0v9ZM${x} 218v-8q4-6 8 0v8Z`} />)}
        <path className="place-etch" d="M396 183v37m7-37v37m190-37v37m7-37v37M431 152v10m12-10v10m12-10v10m12-10v10m67-10v10m12-10v10m12-10v10" />
        <path d="m391 228-14 5h222l13 6H365m-9 6h269" />
      </g>
    </>
  );
}

export function JaipurScene() {
  return (
    <>
      <circle className="place-jaipur-sun" cx="637" cy="53" r="29" />
      <JaipurForts />
      <HawaMahal />
      <path className="place-ground" d="M27 258h672m-330 6h104m58 0h88M51 264h196" />
      <g className="place-jaipur-breeze"><path d="M361 78h39q14 0 14-9t-12-8m-61 27h26m7 0h65q15 0 15 10t-12 9M620 152h52q15 0 15-10t-12-8" /></g>
      <g className="place-jaipur-kite">
        <path className="place-fort-stone" d="m331 24 15 18-15 24-15-24Z" />
        <path d="m331 24 15 18-15 24-15-24Zm0 0v42m-15-24q15-6 30 0m-15 24q14 23-1 38t9 31" />
      </g>
    </>
  );
}
