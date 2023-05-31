// src/pages/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import { handleDelete, handleEdit } from "../../services/project.api.routes";
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { getAllLocations } from "../../services/location.api.routes";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectPlannings, setProjectPlannings] = useState([]);
  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [locations, setLocations] = useState([]);
  const { project, setProject, showNotification } = useGlobalContext();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const { selectedProjectId, setSelectedProjectId } = useGlobalContext();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.project) {
        setProject(response.project);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchProjectPlannings = async () => {
      const { response, success, error, notificationType } =
        await getAllProjectPlannings();
      if (response?.projectPlannings) {
        // Filtrar planificaciones de proyectos por projectId
        const relatedProjectPlannings = response.projectPlannings.filter(
          (planning) => planning.projectId === project.id
        );
        setProjectPlannings(relatedProjectPlannings);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    if (project) {
      // Llamar a fetchProjectPlannings solo si el proyecto ya ha sido establecido
      fetchProjectPlannings();
    }

    const fetchResourceAssignments = async () => {
      const { response, success, error, notificationType } =
        await getAllResourceAssignments();
      if (response?.resourceAssignments) {
        setResourceAssignments(response.resourceAssignments);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    const fetchLocations = async () => {
      const { response, success, error, notificationType } =
        await getAllLocations();
      if (response?.locations) {
        setLocations(response.locations);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    fetchResourceAssignments();
    fetchLocations();
  }, [project]);

  useEffect(() => {
    if (error) {
      showNotification(error, notificationType);
    }
  }, [error, notificationType, showNotification]);

  const handleBack = () => {
    navigate("/projects");
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    // Por ahora solo redirigiré cuando se elimine el proyecto
    navigate("/projects");

    if (response?.status === 200) {
      setProject(response.project);
    }
    setError(error);
    setNotificationType(notificationType);
  }; 

  /*const handleCreateProjectPlanning = () => {
    setSelectedProjectId(project.id);
    navigate("/projectplannings/create");
  };

  const handleEditProjectPlanning = () => {
    const planningForThisProject = projectPlannings.find(
      (planning) => planning.projectId === project.id
    );
    if (!planningForThisProject) {
      console.error("No planning found for this project");
      return;
    }
    setSelectedProjectId(project.id);
    navigate(`/projectplannings/edit/${planningForThisProject.id}`);
  };

  const planningForThisProject = projectPlannings.find(
    (planning) => planning.projectId === project.id
  );
  const planningForProjectExists = projectPlannings.some(
    (planning) => planning.projectId === project.id
  );
  const handlePlanningClick = planningForProjectExists
    ? handleEditProjectPlanning
    : handleCreateProjectPlanning;
  const planningButtonText = planningForProjectExists
    ? "Editar Planificación"
    : "Crear Planificación";
 */
  const handleCreateLocation = () => {
    setSelectedProjectId(project.id);
    navigate("/locations/create");
  };

  const handleEditLocation = () => {
    const locationForThisProject = locations.find(
      (locations) => locations.projectId === project.id
    );
    if (!locationForThisProject) {
      console.error("No location found for this project");
      return;
    }
    setSelectedProjectId(project.id);
    navigate(`/locations/edit/${locationForThisProject.id}`);
  };

  const locationForThisProject = locations.find(
    (locations) => locations.projectId === project.id
  );
  const locationForThisProjectExists = locations.some(
    (location) => location.projectId === project.id
  );
  const handleLocationClick = locationForThisProjectExists
    ? handleEditLocation
    : handleCreateLocation;
  const locationButtonText = locationForThisProjectExists
    ? "Editar locación"
    : "Crear locación";

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Detalles del Proyecto</h2>
      {project && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap space-x-4">
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Nombre</h2>
                <p>{project.name}</p>
              </div>

              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Descripción</h2>
                <p>{project.description}</p>
              </div>
            </div>

            {locationForThisProject && (
              <div className="flex space-x-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Dirección</h2>
                  <p>{locationForThisProject.address}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Latitud</h2>
                  <p>{locationForThisProject.latitude}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Longitud</h2>
                  <p>{locationForThisProject.longitude}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Area</h2>
                  <p>{locationForThisProject.area}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleLocationClick}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              {locationButtonText}
            </button>

            {/* <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha estimada de Inicio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha estimada de Fin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Presupuesto Estimado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectPlannings.map((planning) => (
                  <tr key={planning.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {planning.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {planning.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {planning.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {planning.estimatedBudget}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handlePlanningClick}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              {planningButtonText}
            </button> */}

            <button
              onClick={handleBack}
              className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver
            </button>

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
      )}
    </div>
  );
}

export default ProjectDetails;
