import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
    setValue,
    formState: { errors },
  } = useForm({
    resourceId: 0,
    projectPlanningId: 0,
    quantity: 0,
    estimatedCost: 0,
    actualCost: 0,
    associatedDate: 0,
  });

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const loadResources = async () => {
    try {
      const { response: resourceResponse } = await getAllResources();
      const { response: assignmentResponse } =
        await getAllResourceAssignments();

      // Verifico si existen recursos
      if (resourceResponse?.resources) {
        // Asigno los recursos a la variable assignableResources
        let assignableResources = resourceResponse.resources;

        // Verifico si ya existe asignaciones de recursos
        if (assignmentResponse?.resourceAssignments) {
          // Filtro las asignaciones de recursos por projectPlanningId
          const relatedResourceAssignments =
            assignmentResponse.resourceAssignments.filter(
              (assignment) => assignment.projectPlanningId === selectedProjectId
            );

          // Creo una lista de ids de recursos asignados
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
    data.projectPlanningId = selectedProjectId;
    const { response, success, error, notificationType } = await handleCreate(
      data
    );

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    setSelectedProjectId(null);
    if (response?.status === 200) {
      navigate(`/projectPlannings/details/${data.projectPlanningId}`);
    }
  };
  const options = resources.map((resource) => ({
    value: resource.id,
    label: resource.name
  }));

  const handleChange = (selectedOption) => {
    const selectedResource = resources.find(
      (resource) => resource.id === Number(selectedOption.value)
    );
    if (selectedResource) {
      setValue("estimatedCost", selectedResource.marketPrice);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
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
              <Controller
                name="resourceId"
                control={control}
                rules={{ required: "El campo es requerido." }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="resourceId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => {
                      field.onChange(e); // Para mantener el comportamiento original
                      const selectedResource = resources.find(
                        (resource) => resource.id === Number(e.target.value)
                      );
                      if (selectedResource) {
                        setValue("estimatedCost", selectedResource.marketPrice);
                      }
                    }}
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
                )}
              />
              {errors.resourceId && (
                <p className="text-red-800">{errors.resourceId.message}</p>
              )}
            </div>
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
            <div className="mb-4">
              <label
                htmlFor="estimatedCost"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Costo Estimado
              </label>
              <input
                type="number"
                id="estimatedCost"
                min={0}
                step="0.01"
                placeholder="Costo Estimado"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("estimatedCost", {
                  required: "El campo es requerido.",
                })}
                readOnly  
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="actualCost"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Costo Actual
              </label>
              <input
                type="number"
                id="actualCost"
                min={0}
                step="0.01"
                placeholder="actualCost"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("actualCost", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 1,
                    message: "El costo actual debe ser mayor o igual a 1.",
                  },
                })}
              />
              {errors.actualCost && (
                <p className="text-red-800">{errors.actualCost.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="associatedDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha Asociada
              </label>
              <input
                type="date"
                id="associatedDate"
                min={0}
                step="0.01"
                placeholder="associatedDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("associatedDate", {
                  required: "El campo es requerido.",
                })}
              />
              {errors.associatedDate && (
                <p className="text-red-800">{errors.associatedDate.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Asignar Recurso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceAssignmentCreate;
