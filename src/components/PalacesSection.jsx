import './PalacesSection.css';
import { PALACES } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function PalaceLink({ href, className, children, ...props }) {
  return (
    <a
      {...props}
      href={href}
      className={className}
      onClick={(e) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }
        e.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

export default function PalacesSection() {
  return (
    <section id="palaces" className="app-palaces-section" aria-labelledby="palaces-section-title">
      <div className="app-palaces-heading">
        <h2 id="palaces-section-title" className="app-palaces-title">Palaces of India</h2>
        <PalaceLink href="/palaces" className="app-palaces-view-all">
          View All
        </PalaceLink>
      </div>

      <div className="app-palaces-row-wrap">
        <div className="app-palaces-row" role="region" aria-label="Palaces of India single row list">
          {PALACES.map((palace) => (
            <div key={palace.id} className="app-palace-postcard">
              <PalaceLink href={`/palaces/${palace.slug}`} className="app-palace-postcard-link">
                <div className="app-palace-postcard-art" aria-hidden="true">
                  <img
                    src={palace.artworkUrl}
                    alt=""
                    className="app-palace-postcard-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="app-palace-postcard-name">{palace.monument}</span>
              </PalaceLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
