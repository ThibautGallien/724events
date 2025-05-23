"use client";

import { createContext, useState, useContext, useEffect } from "react";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Échec du chargement des projets.");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Erreur lors du fetch des projets :", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const addProject = async (project, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("title", JSON.stringify(project.title));
      formData.append("description", JSON.stringify(project.description));
      formData.append(
        "technologies",
        JSON.stringify(project.technologies || [])
      );
      formData.append("github", project.github || "");
      formData.append("link", project.link || "");
      formData.append("featured", project.featured || false);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: getAuthHeader(),
        body: formData,
      });

      if (!res.ok) throw new Error("Échec de l'ajout du projet.");

      await fetchProjects();
    } catch (err) {
      console.error("Erreur lors de l'ajout du projet :", err);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(updatedProject),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour.");
      await fetchProjects();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Échec de la suppression.");
      await fetchProjects();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
