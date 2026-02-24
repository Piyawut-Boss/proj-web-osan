import { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('psu_lang') || 'th';
  });

  const t = (key) => {
    const dict = translations[lang] || translations['th'];
    return dict[key] || translations['th'][key] || key;
  };

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem('psu_lang', code);
  };

  // Apply RTL direction and lang attribute to document
  useEffect(() => {
    const langInfo = LANGUAGES.find(l => l.code === lang);
    document.documentElement.dir = langInfo?.dir || 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
