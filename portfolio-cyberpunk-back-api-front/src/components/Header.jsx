"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link href="/" className="logo">
          <div className="logo-glitch" data-text="THIBAUT">
            THIBAUT
          </div>
          <div className="logo-subtitle">.DEV</div>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <div className={`navigation ${isMenuOpen ? "open" : ""}`}>
          <nav className="nav-links">
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              {t("nav.home")}
            </Link>
            <Link
              href="/projects"
              className={pathname === "/projects" ? "active" : ""}
            >
              {t("nav.projects")}
            </Link>
            <Link
              href="/about"
              className={pathname === "/about" ? "active" : ""}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className={pathname === "/contact" ? "active" : ""}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
