import './MonographSection.css';
import { ADDITIONAL_MONOGRAPHS } from '../magazineData.js';
import { navigateTo } from '../nav.js';

function MonographLink({ href, className, children, ...props }) {
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

export default function MonographSeriesSections() {
  return (
    <>
      <div id="monographs" className="app-monographs-archive" aria-label="Remaining Indian Heritage Monographs">
        <header className="app-monographs-archive-header">
          <div className="app-monographs-archive-kicker">Illustrated Monograph Series • Vol. 05 – Vol. 14</div>
          <h2 className="app-monographs-archive-title">The Complete Indian Heritage Archive</h2>
          <p className="app-monographs-archive-desc">
            Ten additional illustrated volumes spanning India’s sacred mosques, historic cathedrals, Sikh Takhts, Himalayan gompas, stepwells, ancient capitals, mountain ranges, beaches, museums, and regional kitchens—rendered as fine-art colored pencil sketches on warm vellum.
          </p>

          <nav className="app-monographs-nav" aria-label="Monograph volumes quick navigation">
            {ADDITIONAL_MONOGRAPHS.map((vol) => (
              <a key={vol.slug} href={`#${vol.slug}`} className="app-monograph-nav-pill">
                <span className="app-monograph-pill-badge">{vol.volCode}</span>
                <span>{vol.shortTitle}</span>
              </a>
            ))}
          </nav>
        </header>
      </div>

      {ADDITIONAL_MONOGRAPHS.map((vol) => (
        <section
          key={vol.slug}
          id={vol.slug}
          className="app-monograph-section"
          aria-labelledby={`${vol.slug}-section-title`}
        >
          <div className="app-monograph-heading">
            <div>
              <div className="app-monograph-kicker">{vol.kicker}</div>
              <h2 id={`${vol.slug}-section-title`} className="app-monograph-title">
                {vol.title}
              </h2>
              <p className="app-monograph-sub">{vol.description}</p>
            </div>
            <MonographLink href={`/${vol.slug}`} className="app-monograph-view-all">
              View All
            </MonographLink>
          </div>

          <div className="app-monograph-row-wrap">
            <div className="app-monograph-row" role="region" aria-label={`${vol.title} horizontal showcase`}>
              {vol.entries.map((entry) => (
                <div key={entry.id} className="app-monograph-postcard">
                  <MonographLink href={`/${vol.slug}/${entry.slug}`} className="app-monograph-postcard-link">
                    <div className="app-monograph-postcard-art" aria-hidden="true">
                      <img
                        src={entry.artworkUrl}
                        alt=""
                        className="app-monograph-postcard-img"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span className="app-monograph-postcard-name">{entry.monument}</span>
                    <span className="app-monograph-postcard-loc">{entry.location}</span>
                  </MonographLink>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
