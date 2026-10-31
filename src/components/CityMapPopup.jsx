import { CITY_INTRODUCTIONS } from '../cityIntroductions.js';
import { navigateTo } from '../nav.js';

export default function CityMapPopup({ city, cityCode }) {
  const introduction = CITY_INTRODUCTIONS[cityCode];

  return (
    <div className="td-map-popup-inner">
      <a href={`/cities/${cityCode}`} className="td-map-popup-title" onClick={event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(`/cities/${cityCode}`);
      }}>{city.city}</a>
      {introduction && <>
        <p className="td-map-popup-intro">{introduction.intro}</p>
        <a className="td-map-popup-wikipedia" href={introduction.wikipedia} target="_blank" rel="noopener noreferrer">
          Read on Wikipedia
        </a>
      </>}
    </div>
  );
}
