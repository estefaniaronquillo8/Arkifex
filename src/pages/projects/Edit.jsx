import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { handleEdit, handleUpdate } from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import { createReport } from "../../services/report.api.routes";

function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, setProject, showNotification } = useGlobalContext();
  const { users, setUsers } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    if (project !== null) {
      console.log("INDEX", project);
    } else {
      console.log("INDEX");
    }
  }, [project]);

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
      console.error("Error al cargar los usuarios:", error);
    }
  };

  // Función para cargar los recursos
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.project) {
        setProject(response.project);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProject();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if(project.status === "Completado" || project.status === "Cancelado"){
      const response = await createReport(project.id);
      const { success, error, notificationType } = await handleUpdate(
        id,
        project
      );
      console.log("CREADOOOOOOOO", response);
      console.log("UPDATE", id)
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
      await new Promise((resolve) => setTimeout(resolve, 100));
      navigate(`/projects/details/${id}`);
    }else{
      const { success, error, notificationType } = await handleUpdate(
        id,
        project
      );

      console.log("UPDATE", id)
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate(`/projects/details/${id}`);
  };

    };
    
     


  const handleChange = (event) => {
    setProject({
      ...project,
      [event.target.name]: event.target.value,
    });

  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Editar project</h2>
      {project && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              {project.parentId === null && (
                <>
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Encargado:
                    </label>
                    <select
                      id="userId"
                      name="userId"
                      value={project.userId}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Cargando recursos...</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción:
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={project.status}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                >
                  <option value="No Comenzado">No Comenzado</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="En Espera">En Espera</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de inicio:
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={project.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de finalización:
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={project.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProjectEdit;
