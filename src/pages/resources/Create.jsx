import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/resource.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import { useEffect, useState } from "react";
import { RiUserFill, RiShoppingCartFill } from "react-icons/ri";
import { FaDollarSign } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { BsDropbox } from "react-icons/bs";

const ResourceCreate = () => {
  const [refreshPage, setRefreshPage] = useState(false);
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
    description: "",
    marketPrice: 0,
  });
  const [resourceType, setResourceType] = useState("");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");

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
    <div className="flex justify-center py-3">
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit(createHandler)}>
          <h1 className="mb-6 text-2xl font-bold text-center">
            {resourceType === "Personal"
              ? "Creación de Nuevo Personal"
              : "Creación de Nuevo Material"}
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                <RiUserFill className="inline-block mr-2 mb-1" /> Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombre"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name ? "border-red-500" : ""
                }`}
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
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                <RiShoppingCartFill className="inline-block mr-2 mb-1" />{" "}
                Descripción
              </label>
              <input
                type="text"
                id="description"
                placeholder="Descripción"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("description", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 5,
                    message: "La descripción debe tener al menos 5 caracteres.",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-800">{errors.description.message}</p>
              )}
            </div>
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
                    className="block text-gray-700 text-sm font-bold mb-4"
                  >
                    <FaDollarSign className="inline-block mr-2 mb-1" /> Precio
                    en el Mercado
                  </label>
                </>
              )}
              <input
                type="number"
                id="marketPrice"
                min={0}
                placeholder="Valor"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("marketPrice", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 0.05,
                    message: "La cantidad debe tener al menos de 0.05 valor.",
                  },
                })}
              />
              {errors.marketPrice && (
                <p className="text-red-800">{errors.marketPrice.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <br /> <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            {resourceType === "Material" && (
              <button
                type="submit"
                className="btn-custom btn-primary"
                onClick={() => window.location.reload()}
              >
                Crear Material
              </button>
            )}
            {resourceType === "Personal" && (
              <button
               type="submit" 
               className="btn-custom btn-primary"
               onClick={() => window.location.reload()}
               >
                Crear Personal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        {resourceType === "Material" && (
          <img
            className="img-resize"
            src="/src/assets/materials.png"
            alt="Materials"
          />
        )}
        {resourceType === "Personal" && (
          <img
            className="img-resize"
            src="/src/assets/personal.jpg"
            alt="Personal"
          />
        )}
      </div>
    </div>
  );
};

export default ResourceCreate;
