// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllTemplates,
  duplicateSubproject,
} from "../../services/template.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const TemplateSub = () => {
  const [currentSection, setCurrentSection] = useState("templates");
  const {
    projects,
    setProjects,
    users,
    setUsers,
    selectedProjectId,
    setSelectedProjectId,
    roleInSession,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  const [showSubprojectsButton, setShowSubprojectsButton] = useState(true);

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const handleDuplicateSubproject = async (projectId, parentId) => {
    console.log("PARENT ID DEL HANDLE ANTES", parentId);
    console.log("SELECTED PROJECT ID DEL HANDLE ANTE", selectedProjectId);
    const { response, success, error, notificationType } =
      await duplicateSubproject(projectId, parentId);

    if (success) {
      navigate(`/projects`);
      showNotification(success, notificationType);
    } else if (error) {
      showNotification(error, notificationType);
    }
  };

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      const { response: userResponse } = await getAllUsers();
      const {
        response: projectResponse,
        success,
        error,
        notificationType,
      } = await getAllTemplates();

      if (userResponse?.users) {
        setUsers(userResponse.users);
      }

      if (projectResponse?.projects) {
        setProjects(projectResponse.projects);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjectsAndUsers();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const handleBack = () => {
    setShowSubprojectsButton(true); // Restablecer el estado de showSubprojectsButton a true
    if (projects.parentId) {
      navigate(`/templates/details/${projects.parentId}`);
    } else {
      navigate("/templates");
    }
  };

  const TemplatesSection = ({ project }) => {
    return (
      <div>
        {!project.parentId && (
          <>
            <h1 className="text-4xl font-semibold mb-6">Creadas desde 0</h1>
            <div className="bg-white shadow-md rounded-lg">
              <div className="grid grid-cols-5 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                <div className="col-span-1 ml-5">Nombre</div>
                <div className="col-span-1">Descripción</div>
                <div className="col-span-1">Monto</div>
                <div className="col-span-2">Acciones</div>
              </div>
              {projects &&
                projects
                  .filter((project) => project.status === "Template")
                  .map((project) => {
                    if (!project.parentId) {
                      return (
                        <div
                          key={project.id}
                          className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200"
                        >
                          <div className="col-span-1 ml-5">{project.name}</div>
                          <div className="col-span-1">
                            {project.description}
                          </div>
                          <div className="col-span-1">$MONTO</div>

                          <div className="col-span-2">
                            <button
                              onClick={() =>
                                handleDuplicateSubproject(
                                  project.id,
                                  selectedProjectId
                                )
                              }
                              className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                            >
                              Duplicar Plantilla
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
                  })}
            </div>
          </>
        )}
      </div>
    );
  };

  //SUBPROYECTOS AQUIII
  const SubprojectsSection = ({ project }) => {
    return (
      <div>
        <h1 className="text-4xl font-semibold mb-6">Subproyectos</h1>
        <div className="bg-white shadow-md rounded-lg">
          <div className="grid grid-cols-6 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
            <div className="col-span-1 ml-5">Nombre</div>
            <div className="col-span-1">Descripción</div>
            <div className="col-span-1">Monto</div>
            <div className="col-span-2">Acción</div>
          </div>
          {projects &&
            projects.map((project) => {
              if (project.parentId) {
                const user = users.find((user) => user.id === project.userId);
                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-6 gap-4 py-2 border-b border-gray-200"
                  >
                    <div className="col-span-1 ml-5">{project.name}</div>
                    <div className="col-span-1">{project.endDate}</div>
                    <div className="col-span-1">$MONTO</div>
                    <button
                      onClick={() =>
                        handleDuplicateSubproject(project.id, selectedProjectId)
                      }
                      className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Duplicar Proyecto
                    </button>
                  </div>
                );
              }
              return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Plantillas</h2>

      <div>
        <nav className="navres">
          <button
            className={`btnnav text-white px-7 py-6 rounded inline-block ${
              currentSection === "templates" ? "active" : ""
            } `}
            onClick={() => setCurrentSection("templates")}
          >
            Nuevas Plantillas
          </button>
          {showSubprojectsButton && (
            <button
              className={`btnnav text-white px-7 py-6 rounded inline-block ${
                currentSection === "psubprojects" ? "active" : ""
              }`}
              onClick={() => setCurrentSection("psubprojects")}
            >
              SubProyectos
            </button>
          )}
        </nav>
        {currentSection === "templates" && (
          <TemplatesSection project={projects} />
        )}
        {currentSection === "projects" && (
          <ProjectsSection project={projects} />
        )}

        {currentSection === "psubprojects" && (
          <SubprojectsSection project={projects} />
        )}
      </div>
    </div>
  );
};

export default TemplateSub;
