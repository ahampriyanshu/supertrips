import { useId } from 'react';
import { getCityEssentials } from '../cityEssentials.js';

export default function LocalEssentials({ city }) {
  const headingId = useId();
  const essentials = getCityEssentials(city);
  return (
    <section className="td-essentials" aria-labelledby={headingId}>
      <h2 id={headingId} className="td-section-label">Local essentials</h2>
      <dl className="td-essentials-list">
        {essentials.map(item => (
          <div key={item.key} className="td-essential">
            <dt>{item.label}</dt>
            <dd className={`td-essential-status td-essential-status--${item.status}`}>
              {item.status === 'available' ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : <span aria-hidden="true">—</span>}
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
