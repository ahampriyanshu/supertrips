import './TemplesSection.css';
import { TEMPLE_CIRCUITS } from '../magazineData.js';
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
    <div id="temples" className="app-temples-series-container" aria-label="Temples Series of India">
      {/* Series Master Header */}
      <header className="app-temples-series-header">
        <div className="app-temples-series-kicker">Illustrated Monograph Series • Vol. 04</div>
        <h2 className="app-temples-series-title">Temples Series</h2>
        <p className="app-temples-series-desc">
          Six sacred circuits exploring the monumental evolution of temple architecture across the Indian subcontinent—from coastal Kalinga deulas and soaring Dravidian gopurams to ancient rock-cut monoliths and modern marble marvels.
        </p>

        {/* Quick jump navigation for the 6 desired subsets */}
        <nav className="app-temples-circuits-nav" aria-label="Temples circuits quick navigation">
          {TEMPLE_CIRCUITS.map((circuit) => (
            <a
              key={circuit.id}
              href={`#circuit-${circuit.id}`}
              className="app-temples-circuit-nav-pill"
            >
              <span className="app-temples-circuit-pill-badge">{circuit.roman}</span>
              <span className="app-temples-circuit-pill-text">{circuit.title}</span>
            </a>
          ))}
        </nav>
      </header>

      {/* The 6 Desired Subsets rendered as distinct sections */}
      <div className="app-temples-circuits-list">
        {TEMPLE_CIRCUITS.map((circuit) => (
          <section
            key={circuit.id}
            id={`circuit-${circuit.id}`}
            className="app-temples-circuit-block"
            aria-labelledby={`circuit-heading-${circuit.id}`}
          >
            <div className="app-temples-heading">
              <div className="app-temples-heading-text">
                <span className="app-temple-circuit-kicker">{circuit.roman} • Architectural Circuit</span>
                <h3 id={`circuit-heading-${circuit.id}`} className="app-temples-title">
                  {circuit.title}
                </h3>
                <span className="app-temple-circuit-region">{circuit.region}</span>
              </div>
              <TempleLink
                href={`/temples/${circuit.entries[0].slug}`}
                className="app-temples-view-all"
                aria-label={`Explore all ${circuit.entries.length} monuments in ${circuit.title}`}
              >
                Explore Circuit ({circuit.entries.length}) &rarr;
              </TempleLink>
            </div>

            <div className="app-temples-row-wrap">
              <div
                className="app-temples-row"
                role="region"
                aria-label={`${circuit.title} single row list`}
              >
                {circuit.entries.map((temple) => (
                  <div key={temple.id} className="app-temple-postcard">
                    <TempleLink
                      href={`/temples/${temple.slug}`}
                      className="app-temple-postcard-link"
                    >
                      <div className="app-temple-postcard-art" aria-hidden="true">
                        <img
                          src={temple.artworkUrl}
                          alt=""
                          className="app-temple-postcard-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="app-temple-postcard-meta">
                        <span className="app-temple-postcard-name">{temple.monument}</span>
                        <span className="app-temple-postcard-location">{temple.location}</span>
                      </div>
                    </TempleLink>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
