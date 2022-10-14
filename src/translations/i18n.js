import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./resources/en/common.json";
import translationES from "./resources/es/common.json";

const SUPPORTED_LANGUAGES = {
  en: {
    translation: translationEN,
    code: "en-US",
  },
  es: {
    translation: translationES,
    code: "ES",
  },
};

export const getSupportedLanguageResources = () => {
  const languages = [];
  for (const [key] of Object.entries(SUPPORTED_LANGUAGES)) {
    languages.push(SUPPORTED_LANGUAGES[key]);
  }
  return languages;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: SUPPORTED_LANGUAGES,
    react: {
      useSuspense: false,
    },
    lng: "es",
    fallbackLng: "es",
  });

export default i18n;
