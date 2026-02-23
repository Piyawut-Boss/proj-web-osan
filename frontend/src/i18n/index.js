import th from './th';
import en from './en';
import zh from './zh';
import ms from './ms';
import ar from './ar';

export const LANGUAGES = [
  { code: 'th', label: 'ไทย',    flag: '🇹🇭', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'zh', label: '中文',    flag: '🇨🇳', dir: 'ltr' },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export const translations = { th, en, zh, ms, ar };
export default translations;
