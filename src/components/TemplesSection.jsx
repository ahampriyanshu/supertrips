import './TemplesSection.css';
import { TEMPLES } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function TempleLink({ href, className, children, ...props }) {
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

export default function TemplesSection() {
  return (
    <section id="temples" className="app-temples-section" aria-labelledby="temples-section-title">
      <div className="app-temples-heading">
        <h2 id="temples-section-title" className="app-temples-title">Temples of India</h2>
        <TempleLink href="/temples" className="app-temples-view-all">
          View All
        </TempleLink>
      </div>

      <div className="app-temples-row-wrap">
        <div className="app-temples-row" role="region" aria-label="Temples of India single row list">
          {TEMPLES.map((temple) => (
            <div key={temple.id} className="app-temple-postcard">
              <TempleLink href={`/temples/${temple.slug}`} className="app-temple-postcard-link">
                <div className="app-temple-postcard-art" aria-hidden="true">
                  <img
                    src={temple.artworkUrl}
                    alt=""
                    className="app-temple-postcard-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="app-temple-postcard-name">{temple.monument}</span>
              </TempleLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
