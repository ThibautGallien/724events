"use client";

import Link from "next/link";
import Hero from "../components/Hero";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/context/ProjectsContext";
import { useLanguage } from "@/context/LanguageContext";

const Home = () => {
  const { projects } = useProjects();
  const { t } = useLanguage();

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <>
      <Hero />

      <section id="featured-projects" className="featured-projects">
        <div className="container">
          <h2 className="section-title">{t("projects.title")}</h2>
          <p className="section-subtitle">{t("projects.subtitle")}</p>

          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {featuredProjects.length > 0 && (
            <div className="view-all">
              <Link href="/projects" className="neon-button">
                {t("projects.viewAll")}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">READY TO COLLABORATE?</h2>
            <Link href="/contact" className="neon-button large">
              {t("contact.title")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
