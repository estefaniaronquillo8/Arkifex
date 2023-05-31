import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { handleEdit, handleUpdate } from "../../services/cost.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { routesProtection } from "../../assets/routesProtection";

function CostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cost, setCost, showNotification } = useGlobalContext();
  const { resources, setResources } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
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

  useEffect(() => {
    const fetchCost = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.cost) {
        setCost(response.cost);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchCost();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const handleBack = () => {
    navigate("/resources");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, error, notificationType } = await handleUpdate(id, cost);
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/resources");
  };

  const handleChange = (event) => {
    setCost({ ...cost, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Editar costo</h2>
      {cost && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
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
                  value={cost.description}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cantidad:
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={cost.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Frecuencia:
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={cost.frequency}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                >
                  <option>Diario</option>
                  <option>Semanal</option>
                  <option>Mensual</option>
                  <option>Anual</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado:
                </label>
                <select
                  id="status"
                  name="status"
                  value={cost.status}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 mr-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
            <button
              onClick={handleBack}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto mb-4"
            >
              Volver
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CostEdit;
