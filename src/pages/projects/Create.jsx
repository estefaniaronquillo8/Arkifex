import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/project.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { projects, setProjects, showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    parentId: 0,
    name: "",
    description: "",
  });
  
  useEffect(() => {
    if(!routesProtection()) navigate("/login");
  }, []);

  const loadProjects = async () => {
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
  }, []);

  const createHandler = async (data) => {
    if (!data.parentId){
      data.parentId = null;
    }
       
    const { response, success, error, notificationType } = await handleCreate(
      data
    );

    console.log("DATA DEL PROJECT",data);

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    if (response?.status === 200) {
      navigate("/projects");
    }
  };

  return (
  
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">
              Creación de Proyectos
            </h1>
            {/* <div className="mb-4">
              <label
                htmlFor="parentId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Parent ID
              </label>
              <select
                id="parentId"
                name="parentId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("parentId")}
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
              {errors.parentId && (
                <p className="text-red-800">{errors.parentId.message}</p>
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
                placeholder="Nombre del Proyecto"
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
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Descripción
              </label>
              <input
                type="text"
                id="description"
                placeholder="Descripción del Proyecto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("description", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 3,
                    message: "La descripción debe tener al menos 3 caracteres.",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-800">{errors.description.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <br />

              <button type="submit" className="btn-custom btn-primary">
              Crear Proyecto
            </button>
            </div>
          </form>
        </div>
      </div>
 
  );
};

export default ProjectCreate;
