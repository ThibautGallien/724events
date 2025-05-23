"use client";

import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

const ProjectCard = ({ project }) => {
  const { language, t } = useLanguage();

  if (!project) return null;

  const title = project.title?.[language] || project.title?.en || "Untitled";
  const description =
    project.description?.[language] || project.description?.en || "";
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <div className="project-card">
      <div className="project-image">
        {project.image?.startsWith("/") && (
          <Image
            src={project.image}
            alt={title}
            width={600}
            height={400}
            className="image-cover"
          />
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>

        <div className="project-tech">
          {technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link live"
            >
              <ExternalLink size={16} />
              <span>{t("projects.viewLive")}</span>
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link github"
            >
              <Github size={16} />
              <span>{t("projects.viewCode")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
