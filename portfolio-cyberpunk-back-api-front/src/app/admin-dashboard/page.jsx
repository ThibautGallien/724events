"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
import { useLanguage } from "@/context/LanguageContext";
import ProjectModal from "@/components/ProjectModal";

const AdminDashboard = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(undefined);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin-login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    router.push("/admin-login");
  };

  const openAddModal = () => {
    setCurrentProject(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (project, imageFile) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    };
    if (project.id) {
      await updateProject(project.id, project, headers);
    } else {
      await addProject(project, imageFile, headers);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteProject = () => {
    if (confirmDelete) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      };
      deleteProject(confirmDelete, headers);
      setConfirmDelete(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t("admin.title")}</h1>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={16} />
            <span>{t("admin.logout")}</span>
          </button>
        </div>

        <div className="dashboard-controls">
          <button onClick={openAddModal} className="add-project-button">
            <Plus size={16} />
            <span>{t("admin.addProject")}</span>
          </button>
        </div>

        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("admin.projectForm.title")}</th>
                <th>Technologies</th>
                <th>{t("admin.projectForm.featured")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.title[language]}</td>
                  <td>
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : "–"}
                  </td>
                  <td>{project.featured ? "✓" : "✗"}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => openEditModal(project)}
                      className="edit-button"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project.id)}
                      className="delete-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {confirmDelete && (
          <div className="confirm-delete-modal">
            <div className="confirm-delete-content">
              <p>{t("admin.confirmDelete")}</p>
              <div className="confirm-actions">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="cancel-button"
                >
                  {t("admin.projectForm.cancel")}
                </button>
                <button
                  onClick={confirmDeleteProject}
                  className="confirm-button"
                >
                  {t("admin.deleteProject")}
                </button>
              </div>
            </div>
          </div>
        )}

        <ProjectModal
          project={currentProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProject}
        />
      </div>
    </section>
  );
};

export default AdminDashboard;
