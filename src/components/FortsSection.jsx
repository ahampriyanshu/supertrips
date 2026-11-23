import './FortsSection.css';
import { FORTS } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function FortLink({ href, className, children, ...props }) {
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

export default function FortsSection() {
  return (
    <section id="forts" className="app-forts-section" aria-labelledby="forts-section-title">
      <div className="app-forts-heading">
        <h2 id="forts-section-title" className="app-forts-title">Forts of India</h2>
        <FortLink href="/forts" className="app-forts-view-all">
          View All
        </FortLink>
      </div>

      <div className="app-forts-row-wrap">
        <div className="app-forts-row" role="region" aria-label="Forts of India single row list">
          {FORTS.map((fort) => (
            <div key={fort.id} className="app-fort-postcard">
              <FortLink href={`/forts/${fort.slug}`} className="app-fort-postcard-link">
                <div className="app-fort-postcard-art" aria-hidden="true">
                  <img
                    src={fort.artworkUrl}
                    alt=""
                    className="app-fort-postcard-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="app-fort-postcard-name">{fort.monument}</span>
              </FortLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
