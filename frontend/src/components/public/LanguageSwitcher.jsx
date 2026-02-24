import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { lang, changeLang, LANGUAGES } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-label">{current.label}</span>
        <span className={`lang-caret${open ? ' open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="lang-dropdown" role="menu">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className={`lang-option${l.code === lang ? ' active' : ''}`}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              role="menuitem"
              dir={l.dir}
            >
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-name">{l.label}</span>
              {l.code === lang && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
