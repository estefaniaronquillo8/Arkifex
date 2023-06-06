import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/cost.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const CostCreate = () => {
  const navigate = useNavigate();
  const {
    resources,
    setResources,
    showNotification,
    selectedResourceId,
    setSelectedResourceId,
  } = useGlobalContext();
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
    console.log(selectedResourceId);
    if (!routesProtection()) navigate("/login");
  }, []);

  const loadResources = async () => {
    try {
      const { response } = await getAllResources();
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

  const handleBack = () => {
    navigate("/resources");
  };

  const createHandler = async (data) => {
    data.resourceId = selectedResourceId;
    console.log("Console antes de guardar el dato ", selectedResourceId);
    const { response, success, error, notificationType } = await handleCreate(
      data
    );
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    setSelectedResourceId(0);
    console.log("Console despues de guardar el dato", selectedResourceId);
    if (response?.status === 200) {
      navigate(`/resources/details/${data.resourceId}`);
    }
  };

  return (
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <br />
      <form
        onSubmit={handleSubmit(async (data) => await createHandler(data))}
      >
        <h1 className="mb-6 text-2xl font-bold text-center">
          Creación de Costos
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
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
          </div>
          <div>
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
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <br />
          <button type="submit" className="btn-custom btn-primary">
            Crear Costo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostCreate;
