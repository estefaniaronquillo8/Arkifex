import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  handleEdit,
  handleUpdate,
} from "../../services/projectPlanning.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function ProjectPlanningEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projectPlanning, setProjectPlanning, resources, showNotification } =
    useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  // Función para cargar los recursos
  useEffect(() => {}, []);

  useEffect(() => {
    const fetchProjectPlanning = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.projectPlanning) {
        setProjectPlanning(response.projectPlanning);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjectPlanning();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, error, notificationType } = await handleUpdate(
      id,
      projectPlanning
    );
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/projects");
  };

  const handleChange = (event) => {
    setProjectPlanning({
      ...projectPlanning,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">
        Editar Planificación de Proyecto
      </h2>
      {projectPlanning && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={projectPlanning.name}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción:
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={projectPlanning.description}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status:
                </label>
                <input
                  id="status"
                  type="text"
                  name="status"
                  value={projectPlanning.status}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de inicio:
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={projectPlanning.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de finalización:
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={projectPlanning.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProjectPlanningEdit;
