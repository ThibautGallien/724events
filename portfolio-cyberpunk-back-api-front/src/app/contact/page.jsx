"use client";

import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title glitch-text" data-text={t("contact.title")}>
            {t("contact.title")}
          </h1>
          <p className="page-subtitle">{t("contact.subtitle")}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-method">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>thibaut.gallien50@gmail.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p>+33 7 70 17 93 11</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-details">
                <h3>Location</h3>
                <p>Cherbourg, France</p>
              </div>
            </div>

            <div className="social-links">
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

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
