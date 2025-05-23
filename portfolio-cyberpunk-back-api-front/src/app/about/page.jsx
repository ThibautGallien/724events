"use client";

import SkillsSection from "@/components/SkillsSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  Monitor,
  Cpu,
  Headphones,
  Book,
  Dumbbell,
  Utensils,
  Calendar,
  Pen,
} from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const interests = [
    { name: "Japan & Anime", icon: <Headphones size={24} /> },
    { name: "Gundam & Godzilla", icon: <Monitor size={24} /> },
    { name: "Web3 & Finance", icon: <Cpu size={24} /> },
    { name: "Reading", icon: <Book size={24} /> },
    { name: "Bodybuilding", icon: <Dumbbell size={24} /> },
    { name: "Cooking", icon: <Utensils size={24} /> },
    { name: "Productivity", icon: <Calendar size={24} /> },
    { name: "Copywriting", icon: <Pen size={24} /> },
  ];

  return (
    <section className="about-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title glitch-text" data-text={t("about.title")}>
            {t("about.title")}
          </h1>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>{t("about.description")}</p>
          </div>

          <div className="about-interests">
            <h2>Interests</h2>
            <p>{t("about.interests")}</p>

            <div className="interests-grid">
              {interests.map((interest, index) => (
                <div key={index} className="interest-card">
                  <div className="interest-icon">{interest.icon}</div>
                  <h3 className="interest-name">{interest.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SkillsSection />
      </div>
    </section>
  );
};

export default About;
