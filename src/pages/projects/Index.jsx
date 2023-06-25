// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllProjects,
} from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ProjectIndex = () => {
  const {
    projects,
    setProjects,
    users,
    setUsers,
    userInSession, 
    setSelectedProjectId,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      const { response: userResponse } = await getAllUsers();
      const {
        response: projectResponse,
        success,
        error,
        notificationType,
      } = await getAllProjects();

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

  const handleCreateProject = () => {
    setSelectedProjectId(null);
    navigate("/projects/create");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Proyectos</h1>
      <button
        onClick={handleCreateProject}
        className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
      >
        Crear Nuevo Proyecto
      </button>
      {/* <Link
        to="/projects/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Proyecto
      </Link> */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-8 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 ml-5">Nombre</div>
          <div className="col-span-1">Descripción</div>
          <div className="col-span-1">Encargado</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Fecha de Inicio</div>
          <div className="col-span-1">Fecha de Fin</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {projects &&
          projects.map((project) => {
            if (!project.parentId) {
              const user = users.find((user) => user.id === project.userId);
              return (
                <div
                  key={project.id}
                  className="grid grid-cols-8 gap-4 py-2 border-b border-gray-200"
                >
                  <div className="col-span-1 ml-5">{project.name}</div>
                  <div className="col-span-1">{project.description}</div>
                  <div className="col-span-1 pl-3">
                    {user ? user.name + " " + user.lastname : "Unknown"}
                  </div>
                  <div className="col-span-1">{project.status}</div>
                  <div className="col-span-1">{project.startDate}</div>
                  <div className="col-span-1">{project.endDate}</div>

                  <div className="col-span-2">
                    <Link
                      to={`/projects/details/${project.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              );
            }
            return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
          })}
      </div>
    </div>
  );
};

export default ProjectIndex;
