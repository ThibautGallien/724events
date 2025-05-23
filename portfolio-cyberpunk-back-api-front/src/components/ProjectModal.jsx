"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ProjectModal = ({ project, isOpen, onClose, onSave }) => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    id: "",
    title: { en: "", fr: "", jp: "" },
    description: { en: "", fr: "", jp: "" },
    technologies: [],
    image: "",
    link: "",
    github: "",
    featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : [],
      });
    } else {
      setFormData({
        id: "",
        title: { en: "", fr: "", jp: "" },
        description: { en: "", fr: "", jp: "" },
        technologies: [],
        image: "",
        link: "",
        github: "",
        featured: false,
      });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "technologies") {
      setFormData((prev) => ({
        ...prev,
        technologies: value.split(",").map((tech) => tech.trim()),
      }));
    } else if (name === "featured") {
      setFormData((prev) => ({
        ...prev,
        featured: checked,
      }));
    } else if (name.includes(".")) {
      const [field, lang] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    onSave(formData, imageFile);
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="project-modal">
        <div className="modal-header">
          <h2>{project ? t("admin.editProject") : t("admin.addProject")}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="language-tabs">
            {["en", "fr", "jp"].map((lang) => (
              <button
                type="button"
                key={lang}
                className={activeTab === lang ? "active" : ""}
                onClick={() => setActiveTab(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {["en", "fr", "jp"].map((lang) => (
            <div
              key={lang}
              className={`tab-content ${activeTab === lang ? "active" : ""}`}
            >
              <div className="form-group">
                <label htmlFor={`title-${lang}`}>
                  {t("admin.projectForm.title")} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  id={`title-${lang}`}
                  name={`title.${lang}`}
                  value={formData.title?.[lang] || ""}
                  onChange={handleChange}
                  required={activeTab === lang}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`description-${lang}`}>
                  {t("admin.projectForm.description")} ({lang.toUpperCase()})
                </label>
                <textarea
                  id={`description-${lang}`}
                  name={`description.${lang}`}
                  value={formData.description?.[lang] || ""}
                  onChange={handleChange}
                  required={activeTab === lang}
                  rows={4}
                  className="form-control"
                ></textarea>
              </div>
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="technologies">
              {t("admin.projectForm.technologies")}
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={
                Array.isArray(formData.technologies)
                  ? formData.technologies.join(", ")
                  : ""
              }
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">{t("admin.projectForm.image")}</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">{t("admin.projectForm.link")}</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link || ""}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">{t("admin.projectForm.github")}</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github || ""}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group checkbox">
            <label htmlFor="featured">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              {t("admin.projectForm.featured")}
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {t("admin.projectForm.cancel")}
            </button>
            <button type="submit" className="save-button">
              {t("admin.projectForm.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
