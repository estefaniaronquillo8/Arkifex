// src/pages/ProjectDetails.js
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
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";
import { getAllLocations } from "../../services/location.api.routes";
import { duplicateProject } from "../../services/template.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import LocationDetails from "../location/Details";
import "tailwindcss/tailwind.css";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const [currentSection, setCurrentSection] = useState("details");

  const { id } = useParams();
  const navigate = useNavigate();
  const [projectPlannings, setProjectPlannings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const {
    project,
    setProject,
    users,
    setUsers,
    setSelectedProjectId,
    showNotification,
    roleInSession,
  } = useGlobalContext();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [notificationType, setNotificationType] = useState();
  const [showSubprojectsButton, setShowSubprojectsButton] = useState(true);

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

    const fetchUsers = async () => {
      const { response, success, error, notificationType } =
        await getAllUsers();

      if (response?.users) {
        setUsers(response.users);
      }

      setError(error);
      setSuccess(success);
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

    const fetchLocations = async () => {
      const { response, success, error, notificationType } =
        await getAllLocations();
      if (response?.locations) {
        // Filtrar localizaciones por projectId
        const relatedLocations = response.locations.filter(
          (location) => location.projectId === project.id
        );
        setLocations(relatedLocations);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    if (project) {
      fetchProjects();
      fetchUsers();
      fetchProjectPlannings();
      fetchLocations();
    }
  }, [project]);

  /* useEffect(() => {
    if (error) {
      showNotification(error, notificationType);
    }
  }, [error, notificationType, showNotification]); */

  const handleBack = () => {
    setShowSubprojectsButton(true); // Restablecer el estado de showSubprojectsButton a true
    if (project.parentId) {
      navigate(`/projects/details/${project.parentId}`);
    } else {
      navigate("/projects");
    }
  };

  const handleBackButton = () => {
    setShowSubprojectsButton(true); // Restablecer el estado de showSubprojectsButton a true
    if (currentSection === "creation") {
      setCurrentSection("details"); // Cambiar la sección actual a "Detalles Generales"
    }
  };
  /// para mostrar boton
  const [showDuplicateButton, setShowDuplicateButton] = useState(false);

  const deleteHandler = async (id) => {
    console.log("IDDDDDDDDDDD", id);
    const { response, success, error, notificationType } = await handleDelete(
      id
    );

    if (response?.status === 200) {
      navigate("/projects");
      setProject(response.project);
      setError(error);
      setNotificationType(notificationType);
      return { success: true }; // Eliminación exitosa
    } else {
      setError(error);
      setNotificationType(notificationType);
      return { success: false, error }; // Eliminación no exitosa
    }
  };

  const handleCreateProjectPlanning = () => {
    setSelectedProjectId(project.id);
    navigate("/projectPlannings/create");
  };

  const handleCreateLocation = () => {
    setSelectedProjectId(project.id);
    navigate("/locations/create");
  };

  const handleCreateSubproject = () => {
    setSelectedProjectId(project.id);
    navigate("/projects/create");
  };

  const handleCreateSubprojectFromTemplate = () => {
    setSelectedProjectId(project.id);
    navigate("/templates/subprojects");
  };

  const handleIsTemplateUpdate = async () => {
    const updatedProject = { ...project, isTemplate: !project.isTemplate };
    const { success, error, notificationType } = await handleUpdate(
      project.id,
      updatedProject
    );

    if (success) {
      setProject(updatedProject);
      //setIsTemplateProject(updatedProject.isTemplate); // Actualizar el estado de isTemplateProject
      showNotification(success, notificationType);
    } else if (error) {
      showNotification(error, notificationType);
    }
  };

  let isTemplateText = "Hacer Plantilla";
  if (project && project.isTemplate) {
    isTemplateText = "Dejar de ser plantilla";
  }

  const handleDuplicateProject = async () => {
    const { response, success, error, notificationType } =
      await duplicateProject(project.id);
    console.log("RESPONDE DEL HANDLE", response, response.project.id);
    if (success) {
      navigate(`/projects/edit/${response.project.id}`);
      showNotification(success, notificationType);
    } else if (error) {
      showNotification(error, notificationType);
    }
  };

  const [isTemplateProject, setIsTemplateProject] = useState(
    project?.isTemplate || false
  );

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

  const ProjectDetailsSection = ({ project }) => {
    let user;
    if (project) {
      user = users.find((user) => user.id === project.userId);
    }

    /// new method
    useEffect(() => {
      setShowDuplicateButton(
        isTemplateText === "Dejar de ser plantilla" && isTemplateProject
      );
    }, [isTemplateText, isTemplateProject]);
    //
    // const handleCreateReport = async (projectid) => {
    //   const { response, success, error, notificationType } = await createReport(
    //     projectid
    //   );

    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap space-x-4">
            {project && project.parentId === null && (
              <>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Encargado</h2>
                  <p>
                    {project && user
                      ? user.name + " " + user.lastname
                      : "No tiene un encargado"}
                  </p>
                </div>
              </>
            )}
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-2">Nombre</h2>
              <p>{project && project.name}</p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-2">Descripción</h2>
              <p>{project && project.description}</p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-2">Status</h2>
              <p>{project && project.status}</p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-2">Fecha de Inicio</h2>
              <p>{project && project.startDate}</p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-2">Fecha de Fin</h2>
              <p>{project && project.endDate}</p>
            </div>
          </div>
          {roleInSession && roleInSession.name !== "client" && (
            <>
              {project && (
                <Link
                  to={`/projects/edit/${project.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </Link>
              )}

              <button
                onClick={handleIsTemplateUpdate}
                className="bg-teal-500 text-white px-4 py-2 rounded mb-4 inline-block mr-2"
              >
                {isTemplateText}
              </button>

              {isTemplateText === "Dejar de ser plantilla" &&
                isTemplateProject && (
                  <button
                    onClick={handleDuplicateProject}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Duplicar Proyecto
                  </button>
                )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: "¿Estás seguro de eliminar tu proyecto?",
                      text: "¡No podrás revertir esto!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Sí, eliminarlo",
                      cancelButtonText: "Cancelar",
                    });

                    if (result.isConfirmed) {
                      const deletionResult = await deleteHandler(project.id);

                      if (deletionResult.success) {
                        Swal.fire(
                          "¡Eliminado!",
                          "Tu proyecto ha sido eliminado.",
                          "success"
                        );
                      } else {
                        Swal.fire(
                          "Error",
                          "Ha ocurrido un error al eliminar el proyecto: " +
                            deletionResult.error,
                          "error"
                        );
                      }
                    }
                  }}
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}

          {locationForThisProject && (
            <div className="flex space-x-8">
              <div>
                <h1 className="text-4xl font-semibold mb-6">
                  Localización del Proyecto
                </h1>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Dirección</h2>
                  <p>{locationForThisProject.address}</p>
                </div>
                {/* <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Latitud</h2>
                  <p>{locationForThisProject.lat}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Longitud</h2>
                  <p>{locationForThisProject.lng}</p>
                </div> */}
                <div className="mt-4 flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Area</h2>
                  <p>{locationForThisProject.area}</p>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Mapa</h2>
                <LocationDetails
                  locationId={locationForThisProject.id}
                  mode="show"
                />
              </div>
            </div>
          )}

          {roleInSession && roleInSession.name !== "client" && (
            <div className="mt-4 flex-1 bg-white  p-4">
              <button
                onClick={handleLocationClick}
                className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
              >
                {locationButtonText}
              </button>
            </div>
          )}

          <button
            onClick={handleBack}
            className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver
          </button>
        </div>
      </div>
    );
  };

  const TaskCreationSection = ({ project }) => {
    const [statusFilter, setStatusFilter] = useState("");

    const handleStatusFilter = (event) => {
      setStatusFilter(event.target.value);
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "No comenzado":
          return "#D41F1F";
        case "En Proceso":
          return "#F0C500 ";
        case "En Espera":
          return "#FA6F0E";
        case "Completado":
          return "#A8DA1A";
        case "Cancelado":
          return "#777777";
        default:
          return "black";
      }
    };

    const filterByStatus = (projectPlanning) => {
      if (statusFilter === "") {
        return true;
      } else {
        return projectPlanning.status === statusFilter;
      }
    };

    return (
      <div>
        <h1 className="text-4xl font-semibold mb-6">Creación de Tareas</h1>
        {roleInSession && roleInSession.name !== "client" && (
          <button
            onClick={handleCreateProjectPlanning}
            className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
          >
            Crear Nueva Tarea
          </button>
        )}
        {/* <button
            onClick={handleBackButton}
            className="inline-flex-1  mx-80 py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver
          </button> */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>
                  Status
                  <select
                    className="mx-2 rounded-md"
                    onChange={handleStatusFilter}
                  >
                    <option value="">Todos</option>
                    <option value="No Comenzado">No Comenzado</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="En Espera">En Espera</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                {roleInSession && roleInSession.name !== "client" && (
                  <th>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {projectPlannings &&
                projectPlannings
                  .filter(filterByStatus)
                  .map((projectPlanning) => {
                    return (
                      <tr key={projectPlanning.id}>
                        <td>{projectPlanning.name}</td>
                        <td>{projectPlanning.description}</td>
                        <td>
                          <span
                            className="dot"
                            style={{
                              backgroundColor: getStatusColor(
                                projectPlanning.status
                              ),
                            }}
                          ></span>
                          {projectPlanning.status}
                        </td>
                        <td>{projectPlanning.startDate}</td>
                        <td>{projectPlanning.endDate}</td>
                        <td>
                          {roleInSession && roleInSession.name !== "client" && (
                            <Link
                              to={`/projectPlannings/details/${projectPlanning.id}`}
                              className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                              Detalles
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  //SUBPROYECTOS AQUIII
  const SubprojectsSection = ({ project }) => {
    return (
      <div>
        {!project.parentId && (
          <>
            <h1 className="text-4xl font-semibold mb-6">Sub-Proyectossss</h1>
            {roleInSession && roleInSession.name !== "client" && (
              <button
                onClick={handleCreateSubproject}
                className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
              >
                Crear Nuevo Subproyecto
              </button>
            )}
            {roleInSession && roleInSession.name !== "client" && (
              <button
                onClick={handleCreateSubprojectFromTemplate}
                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
              >
                Crear desde plantilla
              </button>
            )}

            <div className="bg-white shadow-md rounded-lg">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Status</th>
                    <th scope="col">Fecha de Inicio</th>
                    <th scope="col">Fecha de Fin</th>
                    <th scope="col" colSpan="2">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects &&
                    projects.map((project) => {
                      return (
                        <tr key={project.id}>
                          <td>{project.name}</td>
                          <td>{project.description}</td>
                          <td>{project.status}</td>
                          <td>{project.startDate}</td>
                          <td>{project.endDate}</td>
                          <td>
                            <Link
                              to={`/projects/details/${project.id}`}
                              onClick={() => {
                                setShowSubprojectsButton(false);
                                setCurrentSection("details");
                              }}
                              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
                            >
                              Detalles1
                            </Link>
                            <Link
                              to={`/projects/dashboards/${project.id}`}
                              className="inline-block bg-[#FFBD0D] text-black font-bold px-4 py-2 rounded mr-2"
                              onClick={() => handleCreateReport(project.id)}
                            >
                              Dashboards
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mt-4 text-4xl font-semibold mb-6">
        Detalles del {project && project.name}
      </h2>

      <div>
        <nav className="navres">
          <button
            className={`btnnav text-white px-7 py-6 rounded inline-block ${
              currentSection === "details" ? "active" : ""
            }`}
            onClick={() => setCurrentSection("details")}
          >
            Detalles Generales
          </button>
          <button
            className={`btnnav text-white px-7 py-6 rounded inline-block ${
              currentSection === "creation" ? "active" : ""
            }`}
            onClick={() => setCurrentSection("creation")}
          >
            Creacion de Tareas
          </button>
          {showSubprojectsButton && (
            <button
              className={`btnnav text-white px-7 py-6 rounded inline-block ${
                currentSection === "subprojects" ? "active" : ""
              }`}
              onClick={() => setCurrentSection("subprojects")}
            >
              Sub-Proyectos
            </button>
          )}
        </nav>
        {currentSection === "details" && (
          <ProjectDetailsSection project={project} />
        )}
        {currentSection === "creation" && (
          <TaskCreationSection project={project} />
        )}

        {currentSection === "subprojects" && (
          <SubprojectsSection project={project} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
