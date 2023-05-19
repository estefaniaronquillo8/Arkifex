import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/projectPlanning.api.routes";
//import { getAllProjects } from "../../services/project.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";

const ProjectPlanningCreate = () => {
  const navigate = useNavigate();
  //const { projects, setProjects, showNotification } = useGlobalContext();
  const { showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    projectId: 0,
    name: "",
    startDate: null,
    endDate: null,
    estimatedBudget: 0,
  });

  /* const loadProjects = async () => {
    try {
      const { response } = await getAllProjects();
      if (response?.projects) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error("Error al cargar los proyectos:", error);
    }
  };

  // Función para cargar los proyectos
  useEffect(() => {
    loadProjects();
  }, []); */

  const createHandler = async (data) => {
    const { response, success, error, notificationType } = await handleCreate(
      data
    );
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    if (response?.status === 200) {
      navigate("/projectPlannings");
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
              Creación de Planificación de Proyectos
            </h1>
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
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombre de Planificación de Proyecto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("name", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres.",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-800">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha estimada de inicio
              </label>
              <input
                type="date"
                id="startDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("startDate", {
                  required: "El campo es requerido.",
                })}
              />
              {errors.startDate && (
                <p className="text-red-800">{errors.startDate.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha estimada de finalización
              </label>
              <input
                type="date"
                id="endDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("endDate", {
                  required: "El campo es requerido.",
                })}
              />
              {errors.endDate && (
                <p className="text-red-800">{errors.endDate.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="estimatedBudget"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Presupuesto estimado
              </label>
              <input
                type="number"
                id="estimatedBudget"
                min={0}
                step="0.01"
                placeholder="Presupuesto estimado"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("estimatedBudget", {
                  required: "El campo es requerido.",
                  min: {
                    value: 0,
                    message: "El presupuesto debe ser un valor no negativo.",
                  },
                })}
              />
              {errors.estimatedBudget && (
                <p className="text-red-800">{errors.estimatedBudget.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear Planificación de Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlanningCreate;
