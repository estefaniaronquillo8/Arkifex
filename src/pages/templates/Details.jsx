// src/pages/TemplateDetails.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import {
  getAllProjects,
  handleDelete,
  handleEdit,
  handleUpdate,
} from "../../services/project.api.routes";
//import { handleDelete as handleDeleteRA } from "../../services/resourceAssignment.api.routes";
import { handleDelete as handleDeletePP } from "../../services/projectPlanning.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";
import { duplicateProject } from "../../services/template.api.routes";
import Swal from "sweetalert2";

const TemplateDetails = () => {
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
    const fetchProjects = async () => {
      const { response, success, error, notificationType } =
        await getAllProjects();
      if (response?.projects) {
        // Filtrar planificaciones de proyectos por projectId
        const relatedProjects = response.projects.filter(
          (pry) => pry.parentId === project.id
        );
        setProjects(relatedProjects);
      }
      setError(error);
      setNotificationType(notificationType);
    };

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
      fetchProjects();
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
      navigate(`/templates/details/${project.parentId}`);
    } else {
      navigate("/templates");
    }
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    // Por ahora solo redirigiré cuando se elimine el proyecto
    navigate("/templates");

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
      navigate("/templates");
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
    navigate("/templates/create");
  };

  const handleDuplicateProject = async () => {
    const { response, success, error, notificationType } =
      await duplicateProject(project.id);

    if (success) {
      navigate(`/projects`);
      showNotification(success, notificationType);
    } else if (error) {
      showNotification(error, notificationType);
    }
  };
  const [currentSection, setCurrentSection] = useState("details");

  //Detalles
  const ProjectDetailsSection = ({ project }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
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
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Status5</h2>
                  <p>{project.status}</p>
                </div>
              </div>
              <Link
                to={`/templates/edit/${project.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </Link>

              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "¿Estás seguro de eliminar su plantilla?",
                    text: "¡No podrás revertir esto!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, eliminarlo",
                    cancelButtonText: "Cancelar",
                  });

                  if (result.isConfirmed) {
                    await deleteHandler(project.id);
                    Swal.fire(
                      "¡Eliminado!",
                      "Tu plantilla ha sido eliminada.",
                      "success"
                    );
                  }
                }}
                className="inline-block bg-red-500 text-white px-4 py-2 mr-2 rounded"
              >
                Eliminar
              </button>
              <button
                onClick={handleDuplicateProject}
                className="inline-block bg-green-500 text-white px-4 py-2 rounded"
              >
                Duplicar Proyecto
              </button>

              <div>
                <button
                  onClick={handleBack}
                  className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Creacion Tareas
  const TaskCreationSection = ({ project }) => {
    return (
      <div>
        <h1 className="text-4xl font-semibold mb-6">Creación de Tareas</h1>
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
                  <div className="col-span-1">
                    {projectPlanning.description}
                  </div>
                  <div className="col-span-1">{projectPlanning.status}</div>
                  <div className="col-span-1">{projectPlanning.startDate}</div>
                  <div className="col-span-1">{projectPlanning.endDate}</div>

                  <div className="col-span-2">
                    <Link
                      to={`/projectPlannings/details/${projectPlanning.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  //Subproyectos
  // const SubprojectsSection = ({ project }) => {
  //   return (
  //     <div>
  //        {!project.parentId && (
  //             <>
  //               <h1 className="text-4xl font-semibold mb-6">Sub-Proyectos</h1>

  //               <button
  //                 onClick={handleCreateSubproject}
  //                 className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
  //               >
  //                 Crear Nuevo Subproyecto
  //               </button>

  //               {/* <Link
  //                 to="/projects/create"
  //                 className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
  //               >
  //                 Crear Sub-Proyecto
  //               </Link> */}
  //               <div className="bg-white shadow-md rounded-lg">
  //                 <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
  //                   <div className="col-span-1 ml-5">Nombre</div>
  //                   <div className="col-span-1">Descripción</div>
  //                   <div className="col-span-1">Status</div>
  //                   <div className="col-span-1">Fecha de Inicio</div>
  //                   <div className="col-span-1">Fecha de Fin</div>
  //                   <div className="col-span-2">Acciones</div>
  //                 </div>
  //                 {projects &&
  //                   projects.map((project) => {
  //                     return (
  //                       <div
  //                         key={project.id}
  //                         className="grid grid-cols-7 gap-4 py-2 border-b border-gray-200"
  //                       >
  //                         <div className="col-span-1 ml-5">{project.name}</div>
  //                         <div className="col-span-1">
  //                           {project.description}
  //                         </div>
  //                         <div className="col-span-1">{project.status}</div>
  //                         <div className="col-span-1">{project.startDate}</div>
  //                         <div className="col-span-1">{project.endDate}</div>

  //                         <div className="col-span-2">
  //                           <Link
  //                             to={`/projects/details/${project.id}`}
  //                             className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
  //                           >
  //                             Detalles
  //                           </Link>
  //                         </div>
  //                       </div>
  //                     );
  //                   })}
  //               </div>
  //             </>
  //           )}
  //     </div>
  //   );
  // };

  const [showSubprojectsButton, setShowSubprojectsButton] = useState(true);
  return (
    <div className="mt-4 container mx-auto px-4 py-6">
      {project && (
        <h2 className="text-4xl font-semibold mb-6">
          Detalles de {project.name}
        </h2>
      )}

      <div>
        <nav className="navtemp">
          <button
            className={`btnnavtemp text-lg font-bold text-white px-7 py-6 rounded inline-block ${
              currentSection === "details" ? "activeButton" : ""
            }`}
            onClick={() => setCurrentSection("details")}
          >
            Detalles Plantillas
          </button>
          <button
            className={`btnnavtemp text-lg font-bold text-white px-7 py-6 rounded inline-block ${
              currentSection === "creation" ? "activeButton" : ""
            }`}
            onClick={() => setCurrentSection("creation")}
          >
            Creacion de Tareas
          </button>
          {/* {showSubprojectsButton && (
            <button
              className={`btnnavtemp text-lg font-bold text-white px-7 py-6 rounded inline-block ${
                currentSection === "subprojects" ? "activeButton" : ""
              }`}
              onClick={() => setCurrentSection("subprojects")}
            >
              Sub-Proyectos
            </button>
          )} */}
        </nav>
        {currentSection === "details" && (
          <ProjectDetailsSection project={project} />
        )}
        {currentSection === "creation" && (
          <TaskCreationSection project={project} />
        )}

        {/* {currentSection === "subprojects" && (
          <SubprojectsSection project={project} />
        )} */}
      </div>
    </div>
  );
};

export default TemplateDetails;
