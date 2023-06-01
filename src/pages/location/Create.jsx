import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/location.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const LocationCreate = () => {
  const navigate = useNavigate();
  const {
    projects,
    setProjects,
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
    projectId: 0,
    address: "",
    latitude: 0,
    longitude: 0,
    area: 0,
  });

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
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
    data.projectId = selectedProjectId;
    const { response, success, error, notificationType } = await handleCreate(
      data
    );

    console.log(data.startDate);
    console.log(data.endDate);

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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">
              Creación de Localización
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
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Dirección
              </label>
              <input
                type="text"
                id="address"
                placeholder="Dirección"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("address", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 3,
                    message: "La dirección debe tener al menos 6 caracteres.",
                  },
                })}
              />
              {errors.address && (
                <p className="text-red-800">{errors.address.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="latitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Latitud
              </label>
              <input
                type="number"
                id="latitude"
                step="0.00000000000000001"
                placeholder="Latitud"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("latitude", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 2,
                    message: "La latitud debe tener al menos 2 caracteres.",
                  },
                })}
              />
              {errors.latitude && (
                <p className="text-red-800">{errors.latitude.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="longitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Longitud
              </label>
              <input
                type="number"
                id="longitude"
                step="0.0000000000001"
                placeholder="Longitud"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("longitude", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 2,
                    message: "La longitud debe tener al menos 2 caracteres.",
                  },
                })}
              />
              {errors.longitude && (
                <p className="text-red-800">{errors.longitude.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="area"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Area
              </label>
              <input
                type="number"
                id="area"
                min={0}
                step="0.01"
                placeholder="Area"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("area", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 2,
                    message: "La dirección debe tener al menos 2 caracteres.",
                  },
                })}
              />
              {errors.area && (
                <p className="text-red-800">{errors.area.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear localización
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationCreate;
