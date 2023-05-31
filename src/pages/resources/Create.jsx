import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/resource.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import { useEffect, useState } from "react";

const ResourceCreate = () => {
  const navigate = useNavigate();
  const { showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    name: "",
    type: "",
    role: "",
    quantity: 0,
    unit: "",
    unitPerCost: 0,
  });

  const [resourceType, setResourceType] = useState("");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");

    // Get the resource type from local storage
    const typeFromLocalStorage = localStorage.getItem("type");
    if (!typeFromLocalStorage) {
      navigate("/resources");
    } else {
      setResourceType(typeFromLocalStorage);
    }
  }, []);

  const createHandler = async (data) => {
    if (resourceType === "Material") {
      data.role = "";
    } else if (resourceType === "Personal") {
      data.quantity = 1;
      data.unit = "horas";
    }
    data.type = resourceType;

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
      navigate("/resources");
      localStorage.removeItem("type");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            {resourceType === "Personal" && (
              <>
                <h1 className="mb-6 text-2xl font-bold text-center">
                  Creación de Nuevo Personal
                </h1>
              </>
            )}
            {resourceType === "Material" && (
              <>
                <h1 className="mb-6 text-2xl font-bold text-center">
                  Creación de Nuevo Material
                </h1>
              </>
            )}
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
                placeholder="Nombre del Recurso"
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
            {resourceType === "Personal" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="role"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Rol
                  </label>
                  <input
                    type="text"
                    id="role"
                    placeholder="Rol"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("role", {
                      required: "El campo es requerido.",
                      minLength: {
                        value: 5,
                        message: "El rol debe tener al menos 5 caracteres.",
                      },
                    })}
                  />
                  {errors.role && (
                    <p className="text-red-800">{errors.role.message}</p>
                  )}
                </div>
              </>
            )}
            {resourceType === "Material" && (
              <>
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
                    min={1}
                    placeholder="Cantidad"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("quantity", {
                      required: "El campo es requerido.",
                      minLength: {
                        value: 1,
                        message: "La cantidad debe tener al menos 1 valor.",
                      },
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-red-800">{errors.quantity.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="unit"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Unidad
                  </label>
                  <select
                    id="unit"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("unit", {
                      required: "El campo es requerido.",
                    })}
                  >
                    <option value="">Selecciona una unidad</option>
                    <option value="kg">kg</option>
                    <option value="m²">m²</option>
                  </select>
                  {errors.unit && (
                    <p className="text-red-800">{errors.unit.message}</p>
                  )}
                </div>
              </>
            )}
            <div className="mb-4">
              {resourceType === "Personal" && (
                <>
                  <label
                    htmlFor="costPerUnit"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Pago por hora
                  </label>
                </>
              )}
              {resourceType === "Material" && (
                <>
                  <label
                    htmlFor="costPerUnit"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Costo por Unidad
                  </label>
                </>
              )}

              <input
                type="number"
                id="costPerUnit"
                min={0}
                placeholder="Cantidad"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("costPerUnit", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 0.05,
                    message: "La cantidad debe tener al menos de 0.05 valor.",
                  },
                })}
              />
              {errors.costPerUnit && (
                <p className="text-red-800">{errors.costPerUnit.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear Recurso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceCreate;
