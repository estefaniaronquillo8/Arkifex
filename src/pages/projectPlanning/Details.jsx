import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import {
  getAllProjects,
  handleDelete,
  handleEdit,
} from "../../services/projectPlanning.api.routes";
import { handleDelete as handleDeleteRA } from "../../services/resourceAssignment.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [projectPlannings, setProjectPlannings] = useState([]);
  const [projects, setProjects] = useState([]);
  const currentProjectId = "";
  const {
    project,
    setProject,
    resources,
    setResources,
    selectedProjectId,
    setSelectedProjectId,
    showNotification,
  } = useGlobalContext();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    console.log("EEEEL IIIIIIIIIIIDDDDDDDDDDDDDDD", id);
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
        // Filtrar asignaciones de recursos por projectId
        const relatedProjectPlannings = response.projectPlannings.filter(
          (planning) => planning.projectId === project.id
        );
        setProjectPlannings(relatedProjectPlannings);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    const fetchResourceAssignments = async () => {
      const { response, success, error, notificationType } =
        await getAllResourceAssignments();
      if (response?.resourceAssignments) {
        // Filtrar asignaciones de recursos por projectId
        const relatedResourceAssignments = response.resourceAssignments.filter(
          (assignment) => assignment.projectId === project.id
        );
        setResourceAssignments(relatedResourceAssignments);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    if (project) {
      // Llamar a estas funciones solo si el proyecto ya ha sido establecido
      fetchResourceAssignments();
      fetchProjectPlannings();
    }
  }, [project]);

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
    if (project.parentId) {
      navigate(`/projects/details/${project.parentId}`);
    } else {
      navigate("/projects");
    }
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

  const deleteHandlerPP = async (id) => {
    const { response, success, error, notificationType } = await handleDeletePP(
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

  const handleCreateProjectPlanning = () => {
    setSelectedProjectId(project.id);
    navigate("/projectPlannings/create");
  };

  const handleCreateSubproject = () => {
    setSelectedProjectId(project.id);
    navigate("/projects/create");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Detalles del Proyecto</h2>
      {project && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap space-x-4">
              {project.parentId === null && (
                <>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Encargado</h2>
                    <p>{project.userId}</p>
                  </div>
                </>
              )}
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Nombre</h2>
                <p>{project.name}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Descripción</h2>
                <p>{project.description}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Status</h2>
                <p>{project.status}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Fecha de Inicio</h2>
                <p>{project.startDate}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Fecha de Fin</h2>
                <p>{project.endDate}</p>
              </div>
            </div>
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

            <h1 className="text-4xl font-semibold mb-6">
              Asignación de Planificaciones
            </h1>
            <button
              onClick={handleCreateProjectPlanning}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              Crear Nueva Planificación
            </button>

            <div className="bg-white shadow-md rounded-lg">
              <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                <div className="col-span-1 pl-3">Nombre</div>
                <div className="col-span-1">Descripción</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Fecha de Inicio</div>
                <div className="col-span-1">Fecha de Fin</div>
                <div className="col-span-2">Acciones</div>
              </div>
              {projectPlannings &&
                projectPlannings.map((projectPlanning) => {
                  // Buscar el recurso correspondiente a esta asignación
                  /* const resource = resources.find(
                    (resource) => resource.id === resourceAssignment.resourceId
                  ); */

                  return (
                    <div
                      key={projectPlanning.id}
                      className="grid grid-cols-7 gap-4 py-2 pl-3 border-b border-gray-200"
                    >
                      {/* Mostrar el nombre del recurso, o 'Desconocido' si no se encuentra */}
                      {/* <div className="col-span-1">
                        {resource ? resource.name : "Desconocido"}
                      </div> */}
                      <div className="col-span-1">{projectPlanning.name}</div>
                      <div className="col-span-1">{projectPlanning.description}</div>
                      <div className="col-span-1">{projectPlanning.status}</div>
                      <div className="col-span-1">{projectPlanning.startDate}</div>
                      <div className="col-span-1">{projectPlanning.endDate}</div>

                      <div className="col-span-2">
                        <Link
                          to={`/projectPlannings/edit/${projectPlanning.id}`}
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={async () =>
                            await deleteHandlerPP(projectPlanning.id)
                          }
                          className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {!project.parentId && (
              <>
                <h1 className="text-4xl font-semibold mb-6">Sub-Proyectos</h1>
                <button
                  onClick={handleCreateSubproject}
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
                >
                  Crear Nuevo Subproyecto
                </button>
                {/* <Link
                  to="/projects/create"
                  className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
                >
                  Crear Sub-Proyecto
                </Link> */}
                <div className="bg-white shadow-md rounded-lg">
                  <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                    <div className="col-span-1 ml-5">Nombre</div>
                    <div className="col-span-1">Descripción</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Fecha de Inicio</div>
                    <div className="col-span-1">Fecha de Fin</div>
                    <div className="col-span-2">Acciones</div>
                  </div>
                  {projects &&
                    projects.map((project) => {
                      return (
                        <div
                          key={project.id}
                          className="grid grid-cols-7 gap-4 py-2 border-b border-gray-200"
                        >
                          <div className="col-span-1 ml-5">{project.name}</div>
                          <div className="col-span-1">
                            {" "}
                            {project.description}
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
                    })}
                </div>
              </>
            )}

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

export default ProjectDetails;
