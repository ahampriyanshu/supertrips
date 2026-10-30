export function Arcade({ x = 0, y = 0, count = 7, width = 17, height = 24, gap = 7 }) {
  return <g className="art-arcade">{Array.from({ length: count }, (_, i) => <path key={i} d={`M${x + i * (width + gap)} ${y}v-${height - width / 2}a${width / 2} ${width / 2} 0 0 1 ${width} 0V${y}Z`} />)}</g>;
}

export function Dome({ x = 0, y = 0, radius = 30, onion = false }) {
  return <g transform={`translate(${x} ${y})`}><path className="place-stone" d={onion ? `M-${radius} 0C-${radius * 1.5} -${radius} -8 -${radius} 0 -${radius * 1.65}C8 -${radius} ${radius * 1.5} -${radius} ${radius} 0Z` : `M-${radius} 0a${radius} ${radius} 0 0 1 ${radius * 2} 0Z`} /><path d={`M-${radius + 4} 0h${radius * 2 + 8}M0 -${radius * (onion ? 1.65 : 1)}v-10`} /></g>;
}

export function Chhatri({ x = 0, y = 0, size = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}><Dome x={0} y={0} radius={15} /><path d="M-13 1v22m9-22v22m9-22v22m9-22v22M-18 23h36m-32-4h28" /></g>;
}

export function Shikhara({ x = 360, y = 230, scale = 1, flag = true }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path className="place-stone" d="M-62 0v-25h12C-48-85-27-133 0-169 27-133 48-85 50-25h12V0Z" />
    <path d="M-62 0v-25h12C-48-85-27-133 0-169 27-133 48-85 50-25h12V0ZM-69 0H69m-64-8H64M-15 0v-29q15-25 30 0V0" />
    {[32, 47, 62, 77, 92, 107, 122, 137].map((h, i) => <path className="place-etch" key={h} d={`M${-48 + i * 5.3} -${h}h${96 - i * 10.6}`} />)}
    <path d="M-12-157h24m-20-6h16M0-169v-14" />
    {flag && <path className="art-pennant" d="M0-183v-16m0 1 37 7-37 6" />}
  </g>;
}

export function Gopuram({ x = 360, y = 232, scale = 1, tiers = 7 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path className="place-stone" d={`M-67 0v-36L-28 -${tiers * 20 + 34}h56L67-36V0Z`} />
    <path d={`M-67 0v-36L-28 -${tiers * 20 + 34}h56L67-36V0ZM-74 0H74M-19 0v-27q19-21 38 0V0`} />
    {Array.from({ length: tiers }, (_, i) => {
      const h = 35 + i * 20, w = 68 - i * 5.4;
      return <g key={i}><path d={`M-${w} -${h}h${w * 2}l-4-5H${-w + 4}Z`} /><Arcade x={-w + 10} y={-h - 7} count={Math.max(3, 7 - Math.floor(i / 2))} width={7} height={10} gap={7} /></g>;
    })}
    <path d={`M-31 -${tiers * 20 + 34}q0-14 12-14h38q12 0 12 14M-22 -${tiers * 20 + 46}v-6m11 6v-6m11 6v-6m11 6v-6m11 6v-6`} />
  </g>;
}

export function Vimana({ x = 360, y = 230, scale = 1, tiers = 10 }) {
  const height = tiers * 14 + 22;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path className="place-stone" d={`M-63 0v-28L-21 -${height}h42L63-28V0Z`} />
    <path d={`M-63 0v-28L-21 -${height}h42L63-28V0ZM-70 0H70M-18 0v-25q18-18 36 0V0`} />
    {Array.from({length:tiers},(_,i)=>{const w=65-i*(44/(tiers-1)),h=28+i*14;return <g key={i}><path d={`M-${w} -${h}h${w*2}m-${w*2-3}-4h${w*2-6}`} /><path className="place-etch" d={`M-${w-9} -${h+7}v-4m${(w-9)/2} 4v-4m${(w-9)/2} 4v-4m${(w-9)/2} 4v-4m${(w-9)/2} 4v-4`} /></g>})}
    <Dome y={-height} radius={17}/>
  </g>;
}

export function Tree({ x = 0, y = 240, scale = 1, pine = false, palm = false }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} className="art-tree"><g className="art-tree-sway">
    {pine ? <><path className="place-garden" d="M0-130 29-86H15l25 34H22L48-14H-48l26-38h-18l25-34h-14Z" /><path d="M0 0v-120m0-10 29 44H15l25 34H22L48-14H-48l26-38h-18l25-34h-14Z" /></> : palm ? <><path d="M0 0q13-58 8-106M8-106q-34-35-62-1 32-13 62 1Zm0 0q35-35 66 0-39-16-66 0Zm0 0q-18-36-1-52 16 27 1 52Zm0 0q-37-7-46 29 23-21 46-29Zm0 0q38-4 43 25-21-19-43-25Z" /><path className="place-etch" d="m3-22 8 1m-6-12 9 1m-8-12 9 1m-7-12h9m-9-12h9m-9-12h9" /></> : <><path className="place-garden" d="M-7-27c-45 2-61-24-43-47-10-22 6-44 28-43 13-30 49-24 56 0 28-5 43 23 28 42 18 29-8 50-48 48Z" /><path d="M0 0v-98m0 42-28-22m28 6 27-26m-27 12-15-18m15 64 28-15" /></>}
  </g></g>;
}

export function Boat({ x = 330, y = 247, scale = 1, roof = false }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} ><g className="art-boat">
    <path className="place-stone" d="M-57-10H63Q38 10-36 4Z" /><path d="M-57-10H63Q38 10-36 4Zm-44-3h82m-4-3 25-29" />
    {roof && <><path className="place-stone-light" d="M-27-10v-31q21-25 48 0v31Z" /><path d="M-27-10v-31q21-25 48 0v31m-55-31h62m-48 0v29m32-29v29" /></>}
  </g></g>;
}

export function Bicycle({ x = 200, y = 242, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><circle cx="-24" cy="-12" r="13" /><circle cx="26" cy="-12" r="13" /><path d="m-24-12 13-25L2-12h-26Zm13-25h26L2-12m13-25 11 25M-15-41h9m19 4-3-9h10" /></g>;
}

export function HillHouse({ x = 100, y = 230, scale = 1, timber = false }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path className="place-stone-light" d="M-38 0v-44L0-70l38 26V0Z" /><path d="M-38 0v-44L0-70l38 26V0Zm-9-43L0-77l47 34M-10 0v-25h20V0M-29-32h11v13h-11zm47 0h11v13H18Z" />{timber && <path className="place-etch" d="M-35-8h22m-22-7h22m-22-28h70m-69 7h70M14-8h21m-21-7h21M-25-48l25-18 25 18" />}</g>;
}

export function Train({ x = 360, y = 240, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} className="art-train">
    <path className="place-stone" d="M-98-7v-43h28v23h38v-9h55v-21h72v50Z" /><path d="M-98-7v-43h28v23h38v-9h55v-21h72v50ZM-104-7h204M-90-47h28m-20-4v-12h10v12m39 15v-12h10v12M23-29h72m-62-20h18v15H33zm30 0h18v15H63Z" />
    {[-81, -54, -28, 38, 79].map(cx => <circle key={cx} cx={cx} cy="-5" r="8" />)}
    <path d="M-81-5h53M-108 8h215m-214 6h215" /><path className="art-steam" d="M-78-70q-19-7-8-20 10-11-1-22m15 37q-4-10 3-16" />
  </g>;
}

export function Water({ y = 240 }) {
  return <g className="place-wave art-water"><path d={`M-20 ${y}q50-9 100 0t100 0 100 0 100 0 100 0 100 0 160 0M30 ${y + 12}q45-6 90 0t90 0 90 0 90 0 90 0 90 0M-20 ${y + 24}q60-7 120 0t120 0 120 0 120 0 120 0 120 0`} /></g>;
}
