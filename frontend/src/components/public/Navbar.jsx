import { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

export default function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const close = () => { setMenuOpen(false); setAboutOpen(false); };

  const handleAboutLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setAboutOpen(false);
    }, 300);
  };

  const handleAboutEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setAboutOpen(true);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          <img src="/logo.jpg" alt="PSU AGRO FOOD CO., LTD." className="navbar-logo-img" />
        </Link>

        <nav className={`navbar-nav${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" end className={({isActive}) => `nav-link${isActive?' active':''}`} onClick={close}>{t('nav_home')}</NavLink>

          <div className="nav-dropdown" onMouseEnter={handleAboutEnter} onMouseLeave={handleAboutLeave}>
            <span className="nav-link nav-dropdown-toggle" onClick={() => setAboutOpen(o => !o)}>{t('nav_about')} ▾</span>
            {aboutOpen && (
              <div className="nav-dropdown-menu">
                <NavLink to="/about" className="nav-dropdown-item" onClick={close}>{t('nav_about_company')}</NavLink>
                <NavLink to="/board" className="nav-dropdown-item" onClick={close}>{t('nav_about_board')}</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/products"     className={({isActive}) => `nav-link${isActive?' active':''}`} onClick={close}>{t('nav_products')}</NavLink>
          <NavLink to="/news"         className={({isActive}) => `nav-link${isActive?' active':''}`} onClick={close}>{t('nav_news')}</NavLink>
          <NavLink to="/certificates" className={({isActive}) => `nav-link${isActive?' active':''}`} onClick={close}>{t('nav_certificates')}</NavLink>
          <NavLink to="/contact"      className={({isActive}) => `nav-link${isActive?' active':''}`} onClick={close}>{t('nav_contact')}</NavLink>

          {/* Language switcher inside mobile menu too */}
          <div className="nav-lang-mobile"><LanguageSwitcher /></div>
        </nav>

        {/* Language switcher — desktop (outside nav) */}
        <div className="nav-lang-desktop"><LanguageSwitcher /></div>

        <button className={`navbar-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="menu">
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}
