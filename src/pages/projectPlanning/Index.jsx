// src/pages/projectPlannings.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllProjectPlannings, handleDelete } from "../../services/projectPlanning.api.routes";
import { Link } from "react-router-dom";

const ProjectPlanningIndex = () => {
  const { projectPlannings, setProjectPlannings, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    const fetchProjectPlannings = async () => {
      const { response, success, error, notificationType } =
        await getAllProjectPlannings();
      if (response?.projectPlannings) {
        setProjectPlannings(response.projectPlannings);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjectPlannings();
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
      setProjectPlannings(response.projectPlannings);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Planificación de Proyectos</h1>
      <Link
        to="/projectPlannings/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Planificación de Proyecto
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Proyecto</div>
          <div className="col-span-1">Nombre</div>
          <div className="col-span-1">Fecha Estimada Inicio</div>
          <div className="col-span-1">Fecha Estimada Final</div>
          <div className="col-span-1">Presupuesto Estimado</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {projectPlannings &&
          projectPlannings.map((projectPlanning) => (
            <div
              key={projectPlanning.id}
              className="grid grid-cols-7 gap-4 py-2 border-b border-gray-200"
            >
              <div className="col-span-1 pl-3">{projectPlanning.projectId}</div>
              <div className="col-span-1">{projectPlanning.name}</div>
              <div className="col-span-1">{projectPlanning.startDate}</div>
              <div className="col-span-1">{projectPlanning.endDate}</div>
              <div className="col-span-1">{projectPlanning.estimatedBudget}</div>

              <div className="col-span-2">
                <Link
                  to={`/projectPlannings/edit/${projectPlanning.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </Link>
                <button
                  onClick={async () => await deleteHandler(projectPlanning.id)}
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

export default ProjectPlanningIndex;
