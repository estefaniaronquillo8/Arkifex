// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllProjects,
  handleDelete,
} from "../../services/project.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ProjectIndex = () => {
  const { projects, setProjects, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { response, success, error, notificationType } =
        await getAllProjects();
      if (response?.projects) {
        setProjects(response.projects);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setProjects(response.projects);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Proyectos</h1>
      <Link
        to="/projects/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Proyecto
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-4 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 ml-5">Nombre</div>
          <div className="col-span-1">Descripción</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {projects &&
          projects.map((project) => {
            if (!project.parentId) {
              return (
                <div
                  key={project.id}
                  className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200"
                >
                  <div className="col-span-1 ml-5">{project.name}</div>
                  <div className="col-span-1">{project.description}</div>

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
