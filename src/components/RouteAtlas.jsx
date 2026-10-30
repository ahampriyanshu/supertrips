import { lazy, Suspense } from 'react';
import { CITIES } from '../data.js';

const CitiesLeafletMap = lazy(() => import('./CitiesLeafletMap.jsx'));
const cities = Object.entries(CITIES).map(([cityCode, city]) => ({ cityCode, city, position: [city.lat, city.lng] }));

// A lightweight city sketch while the geographic map loads.
const project = ({ lat, lng }) => [38 + (lng - 68) * 10.5, 338 - (lat - 8) * 10.8];

function CitySketch() {
  return (
    <svg viewBox="0 0 400 370" role="img" aria-label="Cities in this journal, plotted across India">
      <g className="app-atlas-stops">
        {cities.map(({ cityCode, city }) => {
          const [x, y] = project(city);
          return <circle key={cityCode} cx={x} cy={y} r="2.7" />;
        })}
      </g>
    </svg>
  );
}

export default function RouteAtlas({ interactive = false }) {
  return (
    <figure className="app-atlas">
      <div className="app-atlas-frame" role="region" aria-label="Map of all destinations">
        {interactive ? (
          <Suspense fallback={<CitySketch />}>
            <CitiesLeafletMap cities={cities} hero />
          </Suspense>
        ) : <CitySketch />}
      </div>
    </figure>
  );
}
