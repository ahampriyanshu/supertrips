import { useEffect, useRef, useState } from 'react';

export default function JournalSelect({ id, label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState({ side: 'bottom', height: 300 });
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const searchRef = useRef({ text: '', time: 0 });
  const selectedIndex = options.findIndex(option => option.value === value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function openMenu(index = selectedIndex) {
    const rect = rootRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const side = below < 220 && rect.top > below ? 'top' : 'bottom';
    setPlacement({ side, height: Math.min(300, Math.max(120, (side === 'top' ? rect.top : below) - 20)) });
    setActiveIndex(Math.max(0, index));
    setOpen(true);
  }

  function choose(index) {
    onChange(options[index].value);
    setOpen(false);
    searchRef.current = { text: '', time: 0 };
    triggerRef.current.focus({ preventScroll: true });
  }

  function handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const { key } = event;
    if (key === 'Escape' || key === 'Tab') {
      if (key === 'Escape' && open) event.preventDefault();
      setOpen(false);
      searchRef.current = { text: '', time: 0 };
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (open) choose(activeIndex);
      else openMenu();
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      const edge = key === 'Home' ? 0 : key === 'End' ? options.length - 1 : null;
      if (!open) openMenu(edge ?? selectedIndex);
      else setActiveIndex(index => edge ?? Math.max(0, Math.min(options.length - 1, index + (key === 'ArrowDown' ? 1 : -1))));
      return;
    }
    if (key.length === 1) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - searchRef.current.time < 700 ? searchRef.current.text : '';
      const text = previous + key.toLocaleLowerCase();
      searchRef.current = { text, time: now };
      const repeated = [...text].every(character => character === text[0]);
      const query = repeated ? text[0] : text;
      const start = repeated ? (open ? activeIndex : selectedIndex) + 1 : 0;
      const index = options.findIndex((_, offset) => options[(start + offset) % options.length].label.toLocaleLowerCase().startsWith(query));
      if (index >= 0) {
        const match = (start + index) % options.length;
        if (open) setActiveIndex(match);
        else openMenu(match);
      }
    }
  }

  return (
    <div className="app-collection-picker journal-select" ref={rootRef}>
      <label id={`${id}-label`} htmlFor={id}>{label}</label>
      <button
        id={id} ref={triggerRef} type="button" className="journal-select-trigger" role="combobox"
        aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open}
        aria-controls={`${id}-options`} aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={handleKeyDown}
        onBlur={event => { if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false); }}
      >
        <span id={`${id}-value`}>{options[selectedIndex]?.label}</span>
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
      </button>
      <ul
        id={`${id}-options`} className="journal-select-options" role="listbox" aria-labelledby={`${id}-label`}
        hidden={!open} data-side={placement.side} style={{ '--menu-height': `${placement.height}px` }}
      >
        {options.map((option, index) => (
          <li
            key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value}
            ref={element => { optionRefs.current[index] = element; }} data-active={index === activeIndex}
            onMouseMove={() => setActiveIndex(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}
          >
            <span>{option.label}</span>
            {option.value === value && <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>}
          </li>
        ))}
      </ul>
    </div>
  );
}
