import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import {
  getAllProjectPlannings,
  handleDelete,
  handleEdit,
} from "../../services/projectPlanning.api.routes";
import { handleDelete as handleDeleteRA } from "../../services/resourceAssignment.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";

const ProjectPlanningDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [projectPlannings, setProjectPlannings] = useState([]);
  const {
    projectPlanning,
    setProjectPlanning,
    resources,
    setResources,
    selectedProjectId,
    setSelectedProjectId,
    showNotification,
  } = useGlobalContext();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [notificationType, setNotificationType] = useState();
  const [filterType, setFilterType] = useState("Todos");

  const [showRoleColumn, setShowRoleColumn] = useState(true);

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjectPlannings = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.projectPlanning) {
        setProjectPlanning(response.projectPlanning);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    fetchProjectPlannings();
  }, [id]);

  useEffect(() => {
    const fetchResourceAssignments = async () => {
      const { response, success, error, notificationType } =
        await getAllResourceAssignments();
      if (response?.resourceAssignments) {
        // Filtrar asignaciones de recursos por projectPlanningId y tipo seleccionado
        const relatedResourceAssignments = response.resourceAssignments.filter(
          (assignment) =>
            assignment.projectPlanningId === projectPlanning.id &&
            (filterType === "Todos" ||
              resources.find(
                (resource) => resource.id === assignment.resourceId
              )?.type === filterType)
        );
        setResourceAssignments(relatedResourceAssignments);
        setShowRoleColumn(filterType !== "Material");
      }
      setError(error);
      setNotificationType(notificationType);
    };

    if (projectPlanning) {
      // Llamar a estas funciones solo si el proyecto ya ha sido establecido
      fetchResourceAssignments();
    }
  }, [projectPlanning, filterType]);

  useEffect(() => {
    if (error) {
      showNotification(error, notificationType);
    }
  }, [error, notificationType, showNotification]);

  useEffect(() => {
    const loadResources = async () => {
      const { response } = await getAllResources();
      if (response?.resources) {
        setResources(response.resources);
      }
    };

    loadResources();
  }, []);

  const handleBack = () => {
    navigate(`/projects/details/${projectPlanning.projectId}`);
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    // Por ahora solo redirigiré cuando se elimine el proyecto
    navigate(`/projects/details/${projectPlanning.projectId}`);

    if (response?.status === 200) {
      setProjectPlanning(response.projectPlanning);
    }
    setError(error);
    setNotificationType(notificationType);
  };

  const deleteHandlerRA = async (id) => {
    const { response, success, error, notificationType } = await handleDeleteRA(
      id
    );
    // Por ahora solo redirigiré cuando se elimine el proyecto

    if (success) {
      navigate("/projects");
    }
    setSuccess(success);
    setError(error);
    setNotificationType(notificationType);
  };

  const handleCreateResourceAssignment = () => {
    setSelectedProjectId(projectPlanning.id);
    navigate(`/resourceAssignments/create?type=${filterType}`);
    setShowRoleColumn(filterType !== "Material");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">
        Detalle de Planificación de Proyecto
      </h2>
      {projectPlanning && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap space-x-4">
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Nombre</h2>
                <p>{projectPlanning.name}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Descripción</h2>
                <p>{projectPlanning.description}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Status</h2>
                <p>{projectPlanning.status}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Fecha de Inicio</h2>
                <p>{projectPlanning.startDate}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Fecha de Fin</h2>
                <p>{projectPlanning.endDate}</p>
              </div>
            </div>
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

            <h1 className="text-4xl font-semibold mb-6">
              Asignación de Recursos
            </h1>
            <button
              onClick={handleCreateResourceAssignment}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              Asignar nuevo recurso
            </button>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos</option>
              <option value="Material">Material</option>
              <option value="Personal">Personal</option>
            </select>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="font-semibold">
                    <th className="pl-3">Recurso</th>
                    <th className="pl-3">Descripcion</th>
                    {showRoleColumn && <th>Rol</th>}
                    <th>Cantidad</th>
                    <th>Costo Estimado</th>
                    <th>Costo Actual</th>
                    <th>Fecha Asociada</th>
                    <th colSpan="2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceAssignments &&
                    resourceAssignments.map((resourceAssignment) => {
                      // Buscar el recurso correspondiente a esta asignación
                      const resource = resources.find(
                        (resource) =>
                          resource.id === resourceAssignment.resourceId
                      );

                      return (
                        <tr
                          key={resourceAssignment.id}
                          className="border-b border-gray-200"
                        >
                          {/* Mostrar el nombre del recurso, o 'Desconocido' si no se encuentra */}
                          <td className="pl-3">
                            {resource ? resource.name : "Desconocido"}
                          </td>
                          <td>{resource && resource.description}</td>
                          {showRoleColumn && <td>{resource?.role}</td>}
                          <td>{resourceAssignment.quantity}</td>
                          <td>{resourceAssignment.estimatedCost}</td>
                          <td>{resourceAssignment.actualCost}</td>
                          <td>{resourceAssignment.associatedDate}</td>
                          <td colSpan="2">
                            <Link
                              to={`/resourceAssignments/edit/${resourceAssignment.id}`}
                              className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={async () =>
                                await deleteHandlerRA(resourceAssignment.id)
                              }
                              className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleBack}
              className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanningDetails;
