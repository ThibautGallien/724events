"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/context/ProjectsContext";
import { useLanguage } from "@/context/LanguageContext";

const Projects = () => {
  const { projects } = useProjects();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");

  const technologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies))
  );

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.technologies.includes(filter));

  return (
    <section className="projects-page">
      <div className="container">
        <div className="page-header">
          <h1
            className="page-title glitch-text"
            data-text={t("projects.title")}
          >
            {t("projects.title")}
          </h1>
          <p className="page-subtitle">{t("projects.subtitle")}</p>
        </div>

        <div className="filter-controls">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          {technologies.map((tech, index) => (
            <button
              key={index}
              className={`filter-button ${filter === tech ? "active" : ""}`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="no-projects">{t("projects.noProjects")}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
