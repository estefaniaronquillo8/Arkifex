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
//import { handleDelete as handleDeleteRA } from "../../services/resourceAssignment.api.routes";
import { handleDelete as handleDeletePP } from "../../services/projectPlanning.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";
import { getAllLocations } from "../../services/location.api.routes";
import { duplicateProject } from "../../services/template.api.routes";
import LocationDetails from "../location/Details";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker } from "react-map-gl";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "tailwindcss/tailwind.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibHVpc3ZpdGVyaSIsImEiOiJjbGljbnh1MTAwbHF6M3NvMnJ5djFrajFzIn0.f63Fk2kZyxR2JPe5pL01cQ"; // Replace with your Mapbox access token

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [projectPlannings, setProjectPlannings] = useState([]);
  const [locations, setLocations] = useState([]);
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
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);

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
        console.log(project);
        setProject(response.project);
        console.log(project);
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
      // Llamar a estas funciones solo si el proyecto ya ha sido establecido
      fetchResourceAssignments();
      fetchProjectPlannings();
      fetchLocations();
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
      setProject(response.projects);
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

  const handleCreateLocation = () => {
    setSelectedProjectId(project.id);
    navigate("/locations/create");
  };

  const handleCreateSubproject = () => {
    setSelectedProjectId(project.id);
    navigate("/projects/create");
  };

  const handleIsTemplateUpdate = async () => {
    // Asumiendo que tienes una función 'handleUpdate' en tus rutas de la API que maneja la actualización del proyecto
    const updatedProject = { ...project, isTemplate: !project.isTemplate }; // Crear una copia del proyecto actual y establecer isTemplate a true
    const { success, error, notificationType } = await handleUpdate(
      project.id,
      updatedProject
    ); // Hacer la llamada al servidor para actualizar el proyecto

    if (success) {
      setProject(updatedProject); // Si la actualización fue exitosa, actualizar el estado del proyecto localmente
      showNotification(success, notificationType); // Mostrar una notificación de éxito
    } else if (error) {
      showNotification(error, notificationType); // Si hubo un error, mostrar una notificación de error
    }

    //navigate(`/projects/details/${project.id}`);
  };

  let isTemplateText = "Hacer Plantilla";
  if (project.isTemplate === true) {
    isTemplateText = "Que ya no sea plantilla";
  }

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

  useEffect(() => {
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [
          locationForThisProject.longitude,
          locationForThisProject.latitude,
        ], // Specify the initial map center
        zoom: 17, // Specify the initial zoom level
      });

      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([
          locationForThisProject.longitude,
          locationForThisProject.latitude,
        ]) // Set the marker's coordinates to the center
        .addTo(map.current);

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
          polygon: true,
          trash: true,
        },
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        defaultMode: "draw_polygon",
      });

      map.current.addControl(draw);

      const handleMarkerDragEnd = () => {
        const lngLat = marker.getLngLat();
        setMarkerCoordinates([lngLat.lng, lngLat.lat]);
      };

      marker.on("dragend", handleMarkerDragEnd);

      <Marker latitude={latitude} longitude={longitude}>
        <div>📍</div>
      </Marker>
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">
        Detalles de {project.name}
      </h2>
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
              className="inline-block bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Eliminar
            </button>
            <button
              onClick={handleIsTemplateUpdate}
              className="bg-teal-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block mr-2"
            >
              {isTemplateText}
            </button>
            <button
              onClick={handleDuplicateProject}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded"
            >
              Duplicar Proyecto
            </button>

            {locationForThisProject && (
              <div className="flex space-x-4">
                <div>
                  <h1 className="text-4xl font-semibold mb-6">
                    Localización del Proyecto
                  </h1>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Dirección</h2>
                    <p>{locationForThisProject.address}</p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Latitud</h2>
                    <p>{locationForThisProject.lat}</p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Longitud</h2>
                    <p>{locationForThisProject.lng}</p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Area</h2>
                    <p>{locationForThisProject.area}</p>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Mapa</h2>
                  <LocationDetails locationId={locationForThisProject.id} mode="show" />
                </div>
              </div>
            )}

            <div>
              <button
                onClick={handleLocationClick}
                className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
              >
                {locationButtonText}
              </button>
            </div>

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
                      <div className="col-span-1">
                        {projectPlanning.startDate}
                      </div>
                      <div className="col-span-1">
                        {projectPlanning.endDate}
                      </div>

                      <div className="col-span-2">
                        <Link
                          to={`/projectPlannings/details/${projectPlanning.id}`}
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Detalles
                        </Link>
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
