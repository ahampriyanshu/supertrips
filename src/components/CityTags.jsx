import PlaceIcon from './PlaceIcon.jsx';
import { getCityTags } from '../themes/cityIdentity.js';
import { navigateTo } from '../nav.js';

export default function CityTags({ city, theme }) {
  return (
    <ul className="place-tags" aria-label="City character and categories">
      {getCityTags(city, theme).map(tag => (
        <li key={tag.id}>
          {tag.href ? (
            <a className="place-tag" href={tag.href} aria-label={tag.label} title={tag.label} onClick={event => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              navigateTo(tag.href);
            }}><PlaceIcon kind={tag.icon} /></a>
          ) : (
            <span className="place-tag" role="img" aria-label={tag.label} title={tag.label}><PlaceIcon kind={tag.icon} /></span>
          )}
        </li>
      ))}
    </ul>
  );
}
