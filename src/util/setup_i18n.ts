import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";


i18n
  .use(resourcesToBackend((lng: string, ns: string) => import(`../i18n/${lng}/${ns}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // react already handles this
    },

    ns: ["game", "index", "wordlist"],
    defaultNS: "game",

    lowerCaseLng: true,
    nonExplicitSupportedLngs: true,
    fallbackLng: {
      default: ["en-GB"],
    }
  });
