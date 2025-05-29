"use client";

import { useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);
  const switcherRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        (!switcherRef.current || !switcherRef.current.contains(e.target))
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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

        <div ref={menuRef} className={`navigation ${isMenuOpen ? "open" : ""}`}>
          {isMenuOpen && (
            <button
              className="close-menu-button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X />
            </button>
          )}

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

          <div ref={switcherRef}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
