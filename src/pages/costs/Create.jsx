import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/cost.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const CostCreate = () => {
  const navigate = useNavigate();
  const { resources, setResources, showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resourceId: 0,
    description: "",
    amount: 0,
    frequency: "",
    status: "",
  });
  
  useEffect(() => {
    if(!routesProtection()) navigate("/login");
  }, []);
  
  const loadResources = async () => {
    try {
      const { response } =
        await getAllResources();
      if (response?.resources) {
        setResources(response.resources);
      }
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
    }
  };

  // Función para cargar los recursos
  useEffect(() => {
    loadResources();
  }, []);

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
      navigate("/costs");
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
              Creación de Costos
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
                placeholder="Descripción del Costo"
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
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Cantidad
              </label>
              <input
                type="number"
                id="amount"
                min={0}
                step="0.01"
                placeholder="Cantidad"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("amount", {
                  required: "El campo es requerido.",
                  min: {
                    value: 0,
                    message: "La cantidad debe ser un valor no negativo.",
                  },
                })}
              />
              {errors.amount && (
                <p className="text-red-800">{errors.amount.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="frequency"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Frecuencia
              </label>
              <select
                id="frequency"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("frequency", {
                  required: "El campo es requerido.",
                })}
              >
                <option value="">Selecciona una frecuencia</option>
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
                <option value="Anual">Anual</option>
              </select>
              {errors.frequency && (
                <p className="text-red-800">{errors.frequency.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Estado
              </label>
              <select
                id="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("status", {
                  required: "El campo es requerido.",
                })}
              >
                <option value="">Selecciona un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              {errors.status && (
                <p className="text-red-800">{errors.status.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear Costo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CostCreate;
