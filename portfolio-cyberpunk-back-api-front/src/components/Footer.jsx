"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link href="/" className="logo">
              <div className="logo-text">THIBAUT.DEV</div>
            </Link>
            <p className="footer-tagline">WEB DEVELOPER</p>
          </div>

          <div className="footer-links">
            <div className="footer-nav">
              <h3>Navigation</h3>
              <ul>
                <li>
                  <Link href="/">{t("nav.home")}</Link>
                </li>
                <li>
                  <Link href="/projects">{t("nav.projects")}</Link>
                </li>
                <li>
                  <Link href="/about">{t("nav.about")}</Link>
                </li>
                <li>
                  <Link href="/contact">{t("nav.contact")}</Link>
                </li>
              </ul>
            </div>

            <div className="footer-social">
              <h3>Connect</h3>
              <div className="social-icons">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">{t("footer.copyright")}</p>
          <p className="made-with">{t("footer.madewith")}</p>

          {/* Easter Egg Trigger */}
          <button className="easter-egg-trigger" aria-label="Easter Egg">
            <span className="pixel-dot"></span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
