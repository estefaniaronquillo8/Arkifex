import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/resourceAssignment.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { getAllResourceAssignments } from "../../services/resourceAssignment.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const ResourceAssignmentCreate = () => {
  const navigate = useNavigate();
  const {
    projects,
    setProjects,
    resources,
    setResources,
    showNotification,
    selectedProjectId,
    setSelectedProjectId,
  } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resourceId: 0,
    projectId: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const loadResources = async () => {
    try {
      const { response: resourceResponse } = await getAllResources();
      const { response: assignmentResponse } = await getAllResourceAssignments();
  
      if (resourceResponse?.resources) {
        let assignableResources = resourceResponse.resources;
  
        if (assignmentResponse?.resourceAssignments) {
          // Filtrar las asignaciones de recursos por projectId
          const relatedResourceAssignments = assignmentResponse.resourceAssignments.filter(
            (assignment) => assignment.projectId === selectedProjectId
          );
  
          // Crear una lista de id de recursos asignados
          const assignedResourceIds = relatedResourceAssignments.map(
            (assignment) => assignment.resourceId
          );
  
          // Filtrar los recursos que aún no han sido asignados a este proyecto
          assignableResources = resourceResponse.resources.filter(
            (resource) => !assignedResourceIds.includes(resource.id)
          );
        }
  
        setResources(assignableResources);
      }
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const createHandler = async (data) => {
    data.projectId = selectedProjectId;
    const { response, success, error, notificationType } = await handleCreate(
      data
    );

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    setSelectedProjectId(0);
    if (response?.status === 200) {
      navigate(`/projects/details/${data.projectId}`);
    }
  };

  return (
   
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">
              Creación de Resource Assignment
            </h1>
            <div className="mb-4">
              <label
                htmlFor="resourceId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Recurso
              </label>
              <select
                id="resourceId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("resourceId", {
                  required: "El campo es requerido.",
                })}
              >
                <option value="">Selecciona un recurso</option>
                {resources && resources.length > 0 ? (
                  resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando recursos...</option>
                )}
              </select>
              {errors.resourceId && (
                <p className="text-red-800">{errors.resourceId.message}</p>
              )}
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="projectId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Proyecto
              </label>
              <select
                id="projectId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("projectId", {
                  required: "El campo es requerido.",
                })}
              >
                <option value="">Selecciona un proyecto</option>
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando proyectos...</option>
                )}
              </select>
              {errors.projectId && (
                <p className="text-red-800">{errors.projectId.message}</p>
              )}
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Cantidad
              </label>
              <input
                type="number"
                id="quantity"
                min={0}
                step="0.01"
                placeholder="quantity"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("quantity", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 1,
                    message: "La cantidad debe tener al menos 1 caracter.",
                  },
                })}
              />
              {errors.quantity && (
                <p className="text-red-800">{errors.quantity.message}</p>
              )}
            </div>
            <br />
            <div className="flex flex-col items-center justify-center">
            <button type="submit" className="btn-custom btn-primary">
            Crear resource assignment
            </button>
            </div>
          </form>
        </div>
      </div>
   
  );
};

export default ResourceAssignmentCreate;
