import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  handleEdit,
  handleUpdate,
} from "../../services/resourceAssignment.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function ResourceAssignmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    resourceAssignment,
    setResourceAssignment,
    resources,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  // Función para cargar los recursos
  useEffect(() => {}, []);

  useEffect(() => {
    const fetchResourceAssignment = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.resourceAssignment) {
        setResourceAssignment(response.resourceAssignment);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResourceAssignment();
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
    const { success, error, notificationType } = await handleUpdate(id, resourceAssignment);
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/projects");
  };

  const handleChange = (event) => {
    setResourceAssignment({
      ...resourceAssignment,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">
        Editar Asignación de Recurso
      </h2>
      {resourceAssignment && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <label
                  htmlFor="resourceId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Recurso:
                </label>
                <select
                  id="resourceId"
                  name="resourceId"
                  value={resourceAssignment.resourceId}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {resources && resources.length > 0 ? (
                    resources.map((resource) =>
                    resource.id == resourceAssignment.resourceId ? (
                        <option key={resource.id} value={resource.id} selected>
                          {resource.name}
                        </option>
                      ) : (
                        <option key={resource.id} value={resource.id}>
                          {resource.name}
                        </option>
                      )
                    )
                  ) : (
                    <option disabled>Cargando recursos...</option>
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cantidad:
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={resourceAssignment.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="estimatedCost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Costo Estimado:
                </label>
                <input
                  id="estimatedCost"
                  type="number"
                  name="estimatedCost"
                  value={resourceAssignment.estimatedCost}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="actualCost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Costo Actual:
                </label>
                <input
                  id="actualCost"
                  type="number"
                  name="actualCost"
                  value={resourceAssignment.actualCost}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="associatedDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha Asociada:
                </label>
                <input
                  id="associatedDate"
                  type="date"
                  name="associatedDate"
                  value={resourceAssignment.associatedDate}
                  onInput={handleChange}
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

export default ResourceAssignmentEdit;
