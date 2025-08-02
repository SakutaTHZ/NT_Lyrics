import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import my from "./locales/my/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    my: { translation: my },
  },
  lng: localStorage.getItem("language") || "my", // Set initial language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
