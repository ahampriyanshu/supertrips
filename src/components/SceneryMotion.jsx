const weatherTypes = new Set(['snow', 'rain', 'sand', 'petals']);

// Fixed positions and negative delays keep the first frame calm and SSR stable.
const particles = Array.from({ length: 10 }, (_, index) => ({
  x: 38 + (index * 83) % 650,
  y: 18 + (index * 47) % 230,
  delay: -index * 2.7,
}));

export default function SceneryMotion({ theme }) {
  const weather = weatherTypes.has(theme.motion) ? theme.motion : 'breeze';
  return (
    <g className={`scenery-weather scenery-weather--${weather}`} aria-hidden="true" pointerEvents="none">
      {weather === 'breeze' ? (
        <>
          <path className="scenery-wisp" d="M34 62q23-8 51-3t43-2m-75 13h39" />
          <path className="scenery-wisp scenery-wisp--far" d="M557 39q30-8 55-2t55-1m-92 12h48" />
        </>
      ) : particles.slice(0, weather === 'petals' ? 5 : 10).map((particle, index) => (
        <g key={index} transform={`translate(${particle.x} ${particle.y})`}>
          <g className="scenery-particle" style={{ '--scenery-delay': `${particle.delay}s` }}>
            {weather === 'rain' ? <path d="m0 0-5 15" />
              : weather === 'petals' ? <path d="M0 0q-5-7 2-9 6 5-2 9Z" />
                : <circle r={weather === 'snow' ? 1.7 + index % 3 * .4 : 1} />}
          </g>
        </g>
      ))}
    </g>
  );
}
