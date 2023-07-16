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
      navigate(`/projects/edit/${response.project.id}`);
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
  <table className="w-full">
    <thead>
      <tr className="font-semibold border-b border-gray-200">
        <th className="ml-5">Nombre</th>
        <th>Descripción</th>
        <th>Monto</th>
        <th colSpan="2">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {projects &&
        projects
          .filter((project) => project.status === "Template")
          .map((project) => {
            if (!project.parentId) {
              return (
                <tr
                  key={project.id}
                  className="border-b border-gray-200"
                >
                  <td className="ml-5">{project.name}</td>
                  <td>{project.description}</td>
                  <td>$MONTO</td>
                  <td colSpan="2">
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
                  </td>
                </tr>
              );
            }
            return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
          })}
    </tbody>
  </table>
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
  <table className="table-fixed w-full">
    <thead>
      <tr className="font-semibold">
        <th className="w-1/6 ml-5">Nombre</th>
        <th className="w-1/6">Descripción</th>
        <th className="w-1/6">Monto</th>
        <th className="w-2/6">Acción</th>
      </tr>
    </thead>
    <tbody>
      {projects &&
        projects.map((project) => {
          if (project.parentId) {
            const user = users.find((user) => user.id === project.userId);
            return (
              <tr
                key={project.id}
                className="py-2 border-b border-gray-200"
              >
                <td className="w-1/6 ml-5">{project.name}</td>
                <td className="w-1/6">{project.endDate}</td>
                <td className="w-1/6">$MONTO</td>
                <td className="w-2/6">
                  <button
                    onClick={() =>
                      handleDuplicateSubproject(project.id, selectedProjectId)
                    }
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Duplicar Sub-proyecto
                  </button>
                </td>
              </tr>
            );
          }
          return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
        })}
    </tbody>
  </table>
</div>

      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Plantillas</h2>

      <div>
        <nav className="navtemp">
          <button
            className={`btnnavtemp text-white px-7 py-6 rounded inline-block ${
              currentSection === "templates" ? "activeButton" : ""
            } `}
            onClick={() => setCurrentSection("templates")}
          >
            Nuevas Plantillas
          </button>
          {showSubprojectsButton && (
            <button
              className={`btnnavtemp text-white px-7 py-6 rounded inline-block ${
                currentSection === "psubprojects" ? "activeButton" : ""
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
        {/* {currentSection === "projects" && (
          <ProjectsSection project={projects} />
        )} */}

        {currentSection === "psubprojects" && (
          <SubprojectsSection project={projects} />
        )}
      </div>
    </div>
  );
};

export default TemplateSub;
