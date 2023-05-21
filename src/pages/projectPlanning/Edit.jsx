import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  handleEdit,
  handleUpdate,
} from "../../services/projectPlanning.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function ProjectPlanningEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projectPlanning, setProjectPlanning, showNotification } =
  useGlobalContext();
  const { projects, setProjects } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  
  useEffect(() => {
    if(!routesProtection()) navigate("/login");
  }, []);
  
  const loadProjects = async () => {
    try {
      const { response } = await getAllProjects();
      if (response?.projects) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
    }
  };

  // Función para cargar los recursos
  useEffect(() => {
    loadProjects();
  }, []);

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
    navigate("/projectPlannings");
  };

  const handleChange = (event) => {
    setProjectPlanning({
      ...projectPlanning,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Editar projectPlanning</h2>
      {projectPlanning && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <label
                  htmlFor="projectId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Proyecto:
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={projectPlanning.projectId}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando recursos...</option>
                  )}
                </select>
              </div>
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
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha estimada de inicio:
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
                  Fecha estimada de finalización:
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
              <div>
                <label
                  htmlFor="estimatedBudget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Presupuesto estimado:
                </label>
                <input
                  id="estimatedBudget"
                  type="number"
                  name="estimatedBudget"
                  value={projectPlanning.estimatedBudget}
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
