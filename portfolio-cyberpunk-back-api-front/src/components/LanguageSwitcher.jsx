"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "jp", name: "日本語" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={toggleDropdown}
        aria-label="Change language"
      >
        <Globe size={20} />
        <span className="current-language">
          {language === "en" ? "EN" : language === "fr" ? "FR" : "JP"}
        </span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${
                language === lang.code ? "active" : ""
              }`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
