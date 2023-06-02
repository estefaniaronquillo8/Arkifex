// src/pages/ProjectDetails.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import {
  getAllProjects,
  handleDelete,
  handleEdit,
} from "../../services/project.api.routes";
import { getAllProjectPlannings } from "../../services/projectPlanning.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { getAllLocations } from "../../services/location.api.routes";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'tailwindcss/tailwind.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc3ZpdGVyaSIsImEiOiJjbGljbnh1MTAwbHF6M3NvMnJ5djFrajFzIn0.f63Fk2kZyxR2JPe5pL01cQ'; // Replace with your Mapbox access token


const ProjectDetails = () =>{
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectPlannings, setProjectPlannings] = useState([]);
  const [resourceAssignments, setResourceAssignments] = useState([]);
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
  const [notificationType, setNotificationType] = useState();
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    setSelectedProjectId(project.id);
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
        // Filtrar planificaciones de proyectos por projectId
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
      fetchProjectPlannings();
      fetchResourceAssignments();
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
      setProject(response.project);
    }
    setError(error);
    setNotificationType(notificationType);
  };

  const handleCreateProjectPlanning = () => {
    setSelectedProjectId(project.id);
    navigate("/projectPlannings/create");
  };

  const handleCreateResourceAssignment = () => {
    setSelectedProjectId(project.id);
    navigate("/resourceAssignments/create");
  };

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

    var createGeoJSONCircle = function(center, radiusInKm, points) {
      if(!points) points = 64;
  
      var coords = {
          latitude: center[1],
          longitude: center[0]
      };
  
      var km = radiusInKm;
  
      var ret = [];
      var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
      var distanceY = km/110.574;
  
      var theta, x, y;
      for(var i=0; i<points; i++) {
          theta = (i/points)*(2*Math.PI);
          x = distanceX*Math.cos(theta);
          y = distanceY*Math.sin(theta);
  
          ret.push([coords.longitude+x, coords.latitude+y]);
      }
      ret.push(ret[0]);
  
      return {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": [{
                  "type": "Feature",
                  "geometry": {
                      "type": "Polygon",
                      "coordinates": [ret]
                  }
              }]
          }
      };
  };
    
    useEffect(() => {
      if (mapContainer.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [locationForThisProject.longitude, locationForThisProject.latitude], // Specify the initial map center
          zoom: 17 // Specify the initial zoom level
        });

        const marker = new mapboxgl.Marker()
        .setLngLat([locationForThisProject.longitude, locationForThisProject.latitude]) // Set the marker's coordinates to the center
        .addTo(map.current);


      
        

        

      }

      
  
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    }, []);
    
  

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
               <div className="flex-1 bg-white rounded-lg shadow p-4">
                 <h2 className="font-bold text-lg mb-2">Mapa</h2>
                 <div ref={mapContainer} className="w-full h-full" />
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

            <h1 className="text-4xl font-semibold mb-6">
              Planificación de Proyectos
            </h1>
            <button
              onClick={handleCreateProjectPlanning}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              Crear Nueva Planificación
            </button>

            <div className="bg-white shadow-md rounded-lg">
              <div className="grid grid-cols-6 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                <div className="col-span-1 pl-3">Nombre</div>
                <div className="col-span-1">Fecha Estimada Inicio</div>
                <div className="col-span-1">Fecha Estimada Final</div>
                <div className="col-span-1">Presupuesto Estimado</div>
                <div className="col-span-2">Acciones</div>
              </div>
              {projectPlannings &&
                projectPlannings.map((projectPlanning) => (
                  <div
                    key={projectPlanning.id}
                    className="grid grid-cols-6 gap-4 py-2 border-b border-gray-200"
                  >
                    <div className="col-span-1 pl-3">
                      {projectPlanning.name}
                    </div>
                    <div className="col-span-1">
                      {projectPlanning.startDate}
                    </div>
                    <div className="col-span-1">{projectPlanning.endDate}</div>
                    <div className="col-span-1">
                      {projectPlanning.estimatedBudget}
                    </div>

                    <div className="col-span-2">
                      <Link
                        to={`/projectPlannings/edit/${projectPlanning.id}`}
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={async () =>
                          await deleteHandler(projectPlanning.id)
                        }
                        className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <h1 className="text-4xl font-semibold mb-6">
              Asignación de Recursos
            </h1>
            <button
              onClick={handleCreateResourceAssignment}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              Asignar Nuevo Recurso
            </button>

            <div className="bg-white shadow-md rounded-lg">
              <div className="grid grid-cols-4 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                <div className="col-span-1 pl-3">Recurso</div>
                <div className="col-span-1">Cantidad</div>
                <div className="col-span-2">Acciones</div>
              </div>
              {resourceAssignments &&
                resourceAssignments.map((resourceAssignment) => {
                  // Buscar el recurso correspondiente a esta asignación
                  const resource = resources.find(
                    (resource) => resource.id === resourceAssignment.resourceId
                  );

                  return (
                    <div
                      key={resourceAssignment.id}
                      className="grid grid-cols-4 gap-4 py-2 pl-3 border-b border-gray-200"
                    >
                      {/* Mostrar el nombre del recurso, o 'Desconocido' si no se encuentra */}
                      <div className="col-span-1">
                        {resource ? resource.name : "Desconocido"}
                      </div>
                      <div className="col-span-1">
                        {resourceAssignment.quantity}
                      </div>

                      <div className="col-span-2">
                        <Link
                          to={`/resourceAssignments/edit/${resourceAssignment.id}`}
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={async () =>
                            await deleteHandler(resourceAssignment.id)
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
                <Link
                  to="/projects/create"
                  className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
                >
                  Crear Sub-Proyecto
                </Link>
                <div className="bg-white shadow-md rounded-lg">
                  <div className="grid grid-cols-4 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
                    <div className="col-span-1 ml-5">Nombre</div>
                    <div className="col-span-1">Descripción</div>
                    <div className="col-span-2">Acciones</div>
                  </div>
                  {projects &&
                    projects.map((project) => {
                      return (
                        <div
                          key={project.id}
                          className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200"
                        >
                          <div className="col-span-1 ml-5">{project.name}</div>
                          <div className="col-span-1">
                            {project.description}
                          </div>

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
}

export default ProjectDetails;
