// src/utils/validateProject.js
import sanitize from "sanitize-html"; // à installer avec `npm i sanitize-html`

export function validateAndSanitizeProject(fields) {
  const parseJSON = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  return {
    title: {
      en: sanitize(parseJSON(fields.title)?.en || ""),
      fr: sanitize(parseJSON(fields.title)?.fr || ""),
      jp: sanitize(parseJSON(fields.title)?.jp || ""),
    },
    description: {
      en: sanitize(parseJSON(fields.description)?.en || ""),
      fr: sanitize(parseJSON(fields.description)?.fr || ""),
      jp: sanitize(parseJSON(fields.description)?.jp || ""),
    },
    details: {
      en: sanitize(parseJSON(fields.details)?.en || ""),
      fr: sanitize(parseJSON(fields.details)?.fr || ""),
      jp: sanitize(parseJSON(fields.details)?.jp || ""),
    },
    technologies: Array.isArray(parseJSON(fields.technologies))
      ? parseJSON(fields.technologies)
      : [],
    link: sanitize(fields.link || ""),
    github: sanitize(fields.github || ""),
    featured: fields.featured === "true",
  };
}
