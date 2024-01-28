import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

let initting = false;
let ready = false;

const ready_callbacks: (() => void)[] = [];

export const on_ready = (callback: () => void) => {
  if (ready) {
    callback();
  } else {
    ready_callbacks.push(callback);
  }
};

export const off_ready = (callback: () => void) => {
  const index = ready_callbacks.indexOf(callback);
  if (index >= 0) {
    ready_callbacks.splice(index, 1);
  }
};

export const init = () => {
  if (!initting) {
    initting = true;

    i18n
      .use(resourcesToBackend((lng: string, ns: string) => import(`../i18n/${lng}/${ns}.json`)))
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        debug: process.env.NODE_ENV === "development",

        interpolation: {
          escapeValue: false, // react already handles this
        },

        ns: ["game", "wordlist"],
        defaultNS: "game",

        lowerCaseLng: true,
        nonExplicitSupportedLngs: true,
        fallbackLng: {
          default: ["en-GB"],
        }
      }).then(() => {
        ready = true;
        ready_callbacks.forEach(callback => callback());

        document.documentElement.lang = i18n.language.split("-")[0];

        i18n.on("languageChanged", (lng) => {
          document.documentElement.lang = lng.split("-")[0];
        });
      });
  }
};

export const is_ready = () => ready;
