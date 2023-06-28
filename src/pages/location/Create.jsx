import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { handleCreate } from "../../services/location.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const LocationCreate = () => {
  const navigate = useNavigate();
  const {
    showNotification,
    selectedProjectId,
    setSelectedProjectId,
  } = useGlobalContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // Usamos useFieldArray para manejar un array de campos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "polygon"
  });

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const createHandler = async (data) => {
    data.projectId = selectedProjectId;
    data.polygon = JSON.stringify(data.polygon);
    const { response, success, error, notificationType } = await handleCreate(data);

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    setSelectedProjectId(null);
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
                    message: "La dirección debe tener al menos 3 caracteres.",
                  },
                })}
              />
              {errors.address && (
                <p className="text-red-800">{errors.address.message}</p>
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
                  min: {
                    value: 1,
                    message: "El área debe ser al menos 1.",
                  },
                })}
              />
              {errors.area && (
                <p className="text-red-800">{errors.area.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="lat"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Latitud
              </label>
              <input
                type="number"
                id="lat"
                step="0.00000000000000001"
                placeholder="Latitud"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("lat", {
                  required: "El campo es requerido.",
                })}
              />
              {errors.lat && (
                <p className="text-red-800">{errors.lat.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="lng"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Longitud
              </label>
              <input
                type="number"
                id="lng"
                step="0.00000000000000001"
                placeholder="Longitud"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("lng", {
                  required: "El campo es requerido.",
                })}
              />
              {errors.lng && (
                <p className="text-red-800">{errors.lng.message}</p>
              )}
            </div>

            <h2 className="mb-6 text-xl font-bold text-center">
              Creación de Polígono
            </h2>

            {fields.map((field, index) => (
              <div key={field.id}>
                <label htmlFor={`polygon.${index}.lat`} className="block text-gray-700 text-sm font-bold mb-2">
                  Latitud
                </label>
                <input
                  type="number"
                  id={`polygon.${index}.lat`}
                  step="0.00000000000000001"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={field.lat} // make sure to set up defaultValue
                  {...register(`polygon.${index}.lat`, { required: "El campo es requerido." })}
                />
                {errors.polygon && errors.polygon[index]?.lat && (
                  <p className="text-red-800">{errors.polygon[index].lat.message}</p>
                )}

                <label htmlFor={`polygon.${index}.lng`} className="block text-gray-700 text-sm font-bold mb-2">
                  Longitud
                </label>
                <input
                  type="number"
                  id={`polygon.${index}.lng`}
                  step="0.00000000000000001"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={field.lng} // make sure to set up defaultValue
                  {...register(`polygon.${index}.lng`, { required: "El campo es requerido." })}
                />
                {errors.polygon && errors.polygon[index]?.lng && (
                  <p className="text-red-800">{errors.polygon[index].lng.message}</p>
                )}

                <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Eliminar</button>
              </div>
            ))}
            
            <button type="button" className="btn btn-primary" onClick={() => append({ lat: "", lng: "" })}>
              Añadir punto
            </button>

            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-400"
            >
              Crear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationCreate;