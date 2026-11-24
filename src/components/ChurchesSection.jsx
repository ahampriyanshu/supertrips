import './ChurchesSection.css';
import { CHURCHES } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function ChurchLink({ href, className, children, ...props }) {
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

export default function ChurchesSection() {
  return (
    <section id="churches" className="app-churches-section" aria-labelledby="churches-section-title">
      <div className="app-churches-heading">
        <h2 id="churches-section-title" className="app-churches-title">Churches & Cathedrals</h2>
        <ChurchLink href="/churches" className="app-churches-view-all">
          View All
        </ChurchLink>
      </div>

      <div className="app-churches-row-wrap">
        <div className="app-churches-row" role="region" aria-label="Churches & Cathedrals single row list">
          {CHURCHES.map((church) => (
            <div key={church.id} className="app-church-postcard">
              <ChurchLink href={`/churches/${church.slug}`} className="app-church-postcard-link">
                <div className="app-church-postcard-art" aria-hidden="true">
                  <img
                    src={church.artworkUrl}
                    alt=""
                    className="app-church-postcard-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="app-church-postcard-name">{church.monument}</span>
              </ChurchLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
