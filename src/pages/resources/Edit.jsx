import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { handleEdit, handleUpdate } from "../../services/resource.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function ResourceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resource, setResource, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

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

  useEffect(() => {
    const fetchResource = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.resource) {
        setResource(response.resource);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResource();
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
      resource
    );
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/resources");
  };

  const handleChange = (event) => {
    setResource({ ...resource, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {resourceType === "Personal" && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Editar Personal</h2>
        </>
      )}
      {resourceType === "Material" && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Editar Material</h2>
        </>
      )}
      {resource && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
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
                  value={resource.name}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              {resourceType === "Personal" && (
                <>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rol:
                    </label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={resource.role}
                      onChange={handleChange}
                      className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
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
                  value={resource.description}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
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
                      htmlFor="marketPrice"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Precio en el Mercado
                    </label>
                  </>
                )}
                <input
                  id="marketPrice"
                  type="number"
                  name="marketPrice"
                  value={resource.marketPrice}
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

export default ResourceEdit;