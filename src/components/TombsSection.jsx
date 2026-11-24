import './TombsSection.css';
import { TOMBS } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function TombLink({ href, className, children, ...props }) {
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

export default function TombsSection() {
  return (
    <section id="tombs" className="app-tombs-section" aria-labelledby="tombs-section-title">
      <div className="app-tombs-heading">
        <h2 id="tombs-section-title" className="app-tombs-title">Tombs & Mausoleums</h2>
        <TombLink href="/tombs" className="app-tombs-view-all">
          View All
        </TombLink>
      </div>

      <div className="app-tombs-row-wrap">
        <div className="app-tombs-row" role="region" aria-label="Tombs & Mausoleums single row list">
          {TOMBS.map((tomb) => (
            <div key={tomb.id} className="app-tomb-postcard">
              <TombLink href={`/tombs/${tomb.slug}`} className="app-tomb-postcard-link">
                <div className="app-tomb-postcard-art" aria-hidden="true">
                  <img
                    src={tomb.artworkUrl}
                    alt=""
                    className="app-tomb-postcard-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="app-tomb-postcard-name">{tomb.monument}</span>
              </TombLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
