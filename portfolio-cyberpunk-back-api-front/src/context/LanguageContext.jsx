"use client";

import { createContext, useState, useContext } from "react";
import translations from "@/data/translations";

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (let k of keys) {
      if (!value || typeof value !== "object") {
        value = null;
        break;
      }
      value = value[k];
    }

    // fallback to english or return the raw key
    if (value === undefined || value === null) {
      let fallback = translations.en;
      for (let k of keys) {
        if (!fallback || typeof fallback !== "object") return key;
        fallback = fallback[k];
      }
      return fallback ?? key;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
