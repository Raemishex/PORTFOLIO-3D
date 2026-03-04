import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import azTranslation from './locales/az.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      az: { translation: azTranslation }
    },
    lng: 'az', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;
