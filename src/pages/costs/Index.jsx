import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllCosts, handleDelete } from "../../services/cost.api.routes";
import { getAllResources } from "../../services/resource.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";
import CostCreate from "../costs/Create"; 
const CostIndex = () => {
  const {
    costs,
    setCosts,
    showNotification,
    resources,
    setResources,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const [showCostCreate, setShowCostCreate] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
    localStorage.clear();
    if (token !== null) {
      localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const fetchResourcesAndCosts = async () => {
      const { response: resourceResponse } = await getAllResources();
      const {
        response: costResponse,
        success,
        error,
        notificationType,
      } = await getAllCosts();

      if (resourceResponse?.resources) {
        setResources(resourceResponse.resources);
      }

      if (costResponse?.costs) {
        setCosts(costResponse.costs);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResourcesAndCosts();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setCosts(response.costs);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const toggleCostCreate = () => {
    setShowCostCreate(!showCostCreate);
  };

  return (
    <div className="App">
      <div className="flex">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-semibold mb-6">Costos</h1>
          <button
            onClick={toggleCostCreate}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            Crear Costo
          </button>
          {showCostCreate && <CostCreate />}
          <div className="bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-8 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
              <div className="col-span-1 pl-2">Recurso</div>
              <div className="col-span-1">Descripción</div>
              <div className="col-span-1">Cantidad</div>
              <div className="col-span-1">Frecuencia</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-2">Acciones</div>
            </div>
            {costs &&
              costs.map((cost) => {
                const resource = resources.find(
                  (resource) => resource.id === cost.resourceId
                );

                return (
                  <div
                    key={cost.id}
                    className="grid grid-cols-8 gap-4 py-2 border-b border-gray-200"
                  >
                    <div className="col-span-1 pl-3">
                      {resource ? resource.name : "Unknown"}
                    </div>
                    <div className="col-span-1">{cost.description}</div>
                    <div className="col-span-1">{cost.amount}</div>
                    <div className="col-span-1">{cost.frequency}</div>
                    <div className="col-span-1">{cost.status}</div>

                    <div className="col-span-2">
                      <Link
                        to={`/costs/edit/${cost.id}`}
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={async () => await deleteHandler(cost.id)}
                        className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostIndex;
