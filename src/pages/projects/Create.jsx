import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleCreate } from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState, useEffect } from "react";
import { routesProtection } from "../../assets/routesProtection";
import { parseISO, isBefore } from 'date-fns';

const ProjectCreate = () => {
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

  const startDate = parseISO(data.startDate);
  const endDate = parseISO(data.endDate);

  // Si la fecha de inicio es posterior a la de finalización, mostramos un error y retornamos
  if (isBefore(endDate, startDate)) {
    showNotification('La fecha de finalización no puede ser anterior a la de inicio.', 'error');
    return;
  }

  const { response, success, error, notificationType } = await handleCreate(data);

  if (success) {
    showNotification(success, notificationType);
  }

  if (error) {
    showNotification(error, notificationType);
  }

  setSelectedProjectId(null);
  if (response?.status === 200) {
    if (selectedProjectId) {
      navigate(`/projects/details/${data.parentId}`);
    } else {
      navigate("/projects");
    }
  }
};


  let isSubprojectText = "Proyecto";
  if (selectedProjectId) {
    isSubprojectText = "Subproyecto";
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await createHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">
              Crear Nuevo {isSubprojectText}
            </h1>
            {selectedProjectId === null && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="userId"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Usuario Encargado del Proyecto
                  </label>
                  <select
                    id="userId"
                    name="userId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("userId", {
                      required: "El campo es requerido.",
                    })}
                  >
                    <option value="">Selecciona un usuario</option>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.lastname}
                        </option>
                      ))
                    ) : (
                      <option disabled>Cargando usuarios...</option>
                    )}
                  </select>
                  {errors.userId && (
                    <p className="text-red-800">{errors.userId.message}</p>
                  )}
                </div>
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

            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Status
              </label>
              <select
                id="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("status", {
                  required: "El campo es requerido.",
                })}
              >
                <option value="">Selecciona el estado del proyecto</option>
                <option value="no_comenzado">No Comenzado</option>
                <option value="en_proceso">En Proceso</option>
                <option value="en_espera">En Espera</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-800">{errors.status.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha de inicio
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
                Fecha de finalización
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
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
