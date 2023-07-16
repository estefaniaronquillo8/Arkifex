import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/template.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";

const TemplateCreate = () => {
  const navigate = useNavigate();
  const {
    users,
    setUsers,
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
    userId: 0,
    parentId: 0,
    name: "",
    description: "",
    status: "",
    startDate: null,
    endDate: null,
    isTemplate: null,
  });

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const loadUsers = async () => {
    try {
      const { response } = await getAllUsers();
      if (response?.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Error al cargar los usuarios: ", error);
    }
  };

  // Función para cargar los proyectos
  useEffect(() => {
    loadUsers();
  }, []);

  const createHandler = async (data) => {
    if (selectedProjectId) {
      data.parentId = selectedProjectId;
      data.userId = null;
    }

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
      navigate("/templates");
    }
  };

  let isSubprojectText = "Proyecto";
  if (selectedProjectId) {
    isSubprojectText = "Subproyecto";
  }

  const handleBack = () => {
   
      navigate(`/templates/`);
    
  };


  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">
              Crear Nueva Plantilla de {isSubprojectText}
            </h1>
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
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear Plantilla
              </button>
            </div>
          </form>
          <button
            onClick={handleBack}
            className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreate;
