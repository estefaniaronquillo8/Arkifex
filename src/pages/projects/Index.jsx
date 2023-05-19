// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllProjects,
  handleDelete,
} from "../../services/project.api.routes";
import { Link } from "react-router-dom";

const ProjectIndex = () => {
  const { project, setProject, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    const fetchProjects = async () => {
      const { response, success, error, notificationType } =
        await getAllProjects();
      if (response?.project) {
        setProject(response.project);
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
      setProject(response.project);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Recursos</h1>
      <Link
        to="/projects/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Proyecto
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-8 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Proyecto</div>
          <div className="col-span-1">Nombre Proyecto</div>
          <div className="col-span-1">Descripción</div>
        </div>
        {project &&
          project.map((project) => (
            <div
              key={project.i}
              className="grid grid-cols-8 gap-4 py-2 border-b border-gray-200"
            >
              <div className="col-span-1 pl-3">{project.projectid}</div>
              <div className="col-span-1">{project.name}</div>
              <div className="col-span-1">{project.description}</div>
        
              <div className="col-span-2">
                <Link
                  to={`/projects/edit/${project.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </Link>
                <button
                  onClick={async () => await deleteHandler(project.id)}
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectIndex;
