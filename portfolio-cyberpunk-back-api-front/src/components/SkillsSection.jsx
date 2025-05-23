"use client";

import {
  Code,
  Server,
  Database,
  Github as Git,
  Braces,
  SearchCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SkillsSection = () => {
  const { t } = useLanguage();

  const skills = [
    { name: "HTML", icon: <Code size={24} />, level: 90 },
    { name: "CSS", icon: <Braces size={24} />, level: 85 },
    { name: "SASS", icon: <Braces size={24} />, level: 80 },
    { name: "JavaScript", icon: <Code size={24} />, level: 85 },
    { name: "React", icon: <Code size={24} />, level: 80 },
    { name: "Next.js", icon: <Server size={24} />, level: 75 },
    { name: "API Integration", icon: <Server size={24} />, level: 80 },
    { name: "MongoDB", icon: <Database size={24} />, level: 70 },
    { name: "Git / GitHub", icon: <Git size={24} />, level: 75 },
    { name: "SEO", icon: <SearchCheck size={24} />, level: 85 },
  ];

  return (
    <section className="skills-section">
      <div className="container">
        <h2 className="section-title">{t("about.skills")}</h2>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h3 className="skill-name">{skill.name}</h3>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{ width: `${skill.level}%` }}>
                  <span className="skill-level">{skill.level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
