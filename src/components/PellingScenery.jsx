import { Tree } from './IllustrationParts.jsx';

export default function PellingScenery() {
  return (
    <g data-art-kind="pelling-skywalk" data-subject="pelling-skywalk">
      <g className="art-backdrop">
        <path className="place-fill-soft" d="M0 191 63 123l34 24 72-101 35 43 29-19 79 96 42-43 83 82v75H0Z" />
        <path className="art-ridge" d="m0 191 63-68 34 24 72-101 35 43 29-19 79 96 42-43 83 82" />
        <path className="art-snowcap" d="m133 97 36-51 35 43-22-5-12 15-12-13Zm71-8 29-19 33 40-24-12-9 7-9-13Z" />
        <path className="place-garden" d="M0 232q77-66 162-28t153 9q71-20 118-47t117 12q89-31 170 27v75H0Z" />
        <path className="place-garden" d="M345 280q37-54 74-73 67-61 133-32 74-22 168 60v45Z" />
        <Tree x={638} y={226} scale={.65} />
        <Tree x={683} y={241} scale={.45} />
      </g>

      <g data-landmark="Chenrezig statue">
        <path className="place-stone-light" d="M461 191v-26h118v26Z" />
        <path className="art-gold" d="M453 165h134l-12-12H465Z" />
        <path d="M453 165h134M461 191v-26h118v26m-125 4h132M475 172v13h12v-13Zm78 0v13h12v-13ZM507 191v-15q13-14 26 0v15" />

        <g className="art-gold">
          <path d="M496 86q24-15 48 0l12 48h-72Z" />
          <path d="M497 92q-9 9-15 27-15-5-17-29l2-15 8 1 2 23 12-18m54 11q9 9 15 27 15-5 17-29l-2-15-8 1-2 23-12-18" />
          <path d="M490 123q-29 0-35 17 15 16 65 9 50 7 65-9-6-17-35-17l-30 13Z" />
          <path d="M506 48q14-13 28 0v16q-1 14-14 18-13-4-14-18Z" />
          <path d="m503 48-4-17 10 7 4-16 7 12 7-12 4 16 10-7-4 17Z" />
        </g>

        <path d="M503 48h34m-29 7 7-1m10 0 7 1m-13 4-2 7h6m-9 6q6 3 12 0M509 80v7m22-7v7M496 90l13 25 11-18 11 18 13-25m-35 25 11 11 11-11m-11-18v29M490 123l25 17m35-17-25 17m-57 2q24 5 44 0m16 0q20 5 44 0" />
        <path className="place-etch" d="m494 100-6 22m58-22 6 22m-47-37q15 12 30 0m-27 7q12 8 24 0" />
        <path d="M568 80q-12-16 8-25m-4 8q-10 0-9-9 9-2 9 9Zm5-8q-1-11 8-11 5 9-8 11Z" />
        <ellipse cx="469" cy="86" rx="5" ry="9" />
        <ellipse className="art-gold" cx="520" cy="153" rx="64" ry="9" />
        {[469, 486, 503, 520, 537, 554, 571].map(x => (
          <path key={x} className="place-etch" d={`M${x - 7} 151q7 14 14 0m-7 0v8`} />
        ))}
      </g>

      <g data-landmark="Skywalk Pelling">
        <path className="place-stone-light" d="m405 245 78-50h32l-64 56Z" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} className="place-etch" d={`M${415 + i * 9} ${240 - i * 6}h${43 - i * 2}`} />
        ))}
        <path d="m400 240 81-52h38l-66 57M481 188v7m38-7v7" />

        <path className="place-stone-light" d="M70 217c115-48 263-43 359 1v9c-96-44-244-49-359-1Z" />
        <path className="art-glass" d="M70 217c115-48 263-43 359 1l-19 18c-107-39-227-40-332 3Z" />
        <path d="M70 194c115-48 263-43 359 1m-351 21c105-43 225-42 332-3M70 217c115-48 263-43 359 1m-351 21c105-43 225-42 332-3M70 194v32m359-31v32m-351-11v23m332-26v23" />
        {[{ x: 108, y: 180 }, { x: 146, y: 170 }, { x: 184, y: 164 }, { x: 222, y: 162 }, { x: 260, y: 164 }, { x: 298, y: 169 }, { x: 336, y: 176 }, { x: 374, y: 184 }].map(({ x, y }) => (
          <path key={x} className="place-etch" d={`M${x} ${y}v23l6 22v-23`} />
        ))}
        <path d="M108 234v32m8-35v35m111-46v46m8-46v46m130-35v35m8-32v32M116 257q43-54 111-31m8 0q66-22 130 31" />
        <path className="place-etch" d="m108 244 8 12m111-25 8 16m-8 0 8 13m130-16 8 12" />
      </g>
      <path className="place-ground" d="M55 269h613" />
      <path className="art-mist" d="M25 142q106-13 214 0" />
    </g>
  );
}
