import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  handleEdit,
  handleUpdate,
} from "../../services/location.api.routes";
import { getAllProjects } from "../../services/project.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function LocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location, setLocation, showNotification } =
  useGlobalContext();
  const { projects, setProjects } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  
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
      console.error("Error al cargar los recursos:", error);
    }
  };

  // Función para cargar los recursos
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.location) {
        setLocation(response.location);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchLocation();
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
    const { success, error, notificationType } = await handleUpdate(
      id,
      location
    );
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/locations");
  };

  const handleChange = (event) => {
    setLocation({
      ...location,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Editar location</h2>
      {location && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <label
                  htmlFor="projectId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Proyecto:
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={location.projectId}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando recursos...</option>
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección:
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={location.address}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>              
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Latitud:
                </label>
                <input
                  id="latitude"
                  type="number"
                  name="latitude"
                  value={location.latitude}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Longitud:
                </label>
                <input
                  id="longitude"
                  type="number"
                  name="longitude"
                  value={location.longitude}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700"
                >
                  Area:
                </label>
                <input
                  id="area"
                  type="number"
                  name="area"
                  value={location.area}
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

export default LocationEdit;
