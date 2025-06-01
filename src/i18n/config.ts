
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import fr from './locales/fr/translation.json';
import en from './locales/en/translation.json';
import th from './locales/th/translation.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  th: { translation: th }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fr', // Default to French
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
