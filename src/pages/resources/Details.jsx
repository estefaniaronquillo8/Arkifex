import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { routesProtection } from "../../assets/routesProtection";
import { handleEdit, handleDelete } from "../../services/resource.api.routes";
import { getAllCosts } from "../../services/cost.api.routes";

function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [costs, setCosts] = useState([]);
  const { resource, setResource, showNotification } = useGlobalContext();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const [resourceType, setResourceType] = useState("");
  const { selectedResourceId, setSelectedResourceId } = useGlobalContext();

  useEffect(() => {
    const fetchCosts = async () => {
      const { response, success, error, notificationType } =
        await getAllCosts();
      if (response?.costs) {
        setCosts(response.costs);
      }
      setError(error);
      setNotificationType(notificationType);
    };

    fetchCosts();
  }, []);

  useEffect(() => {
    console.log(selectedResourceId);
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
      setNotificationType(notificationType);
    };

    fetchResource();
  }, []);

  useEffect(() => {
    if (error) {
      showNotification(error, notificationType);
    }
  }, [error, notificationType, showNotification]);

  const handleBack = () => {
    navigate("/resources");
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    // Por ahora solo redirigiré cuando se elimine el recurso
    navigate("/resources");

    if (response?.status === 200) {
      setResources(response.resources);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const handleCreateCost = () => {
    setSelectedResourceId(resource.id);
    navigate("/costs/create");
  };

  const handleEditCost = () => {
    const costForResource = costs.find(
      (cost) => cost.resourceId === resource.id
    );
    if (!costForResource) {
      console.error("No cost found for this resource");
      return;
    }
    setSelectedResourceId(resource.id);
    navigate(`/costs/edit/${costForResource.id}`);
  };

  const costForThisResource = costs.find(
    (cost) => cost.resourceId === resource.id
  );
  const costForResourceExists = costs.some(
    (cost) => cost.resourceId === resource.id
  );
  const handleCostClick = costForResourceExists
    ? handleEditCost
    : handleCreateCost;
  const costButtonText = costForResourceExists ? "Editar Costo" : "Crear Costo";

  return (
    <div className="container mx-auto px-4 py-6">
      {resourceType === "Personal" && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Detalle del Personal</h2>
        </>
      )}
      {resourceType === "Material" && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Detalle del Material</h2>
        </>
      )}
      {resource && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap space-x-4">
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">Nombre</h2>
                <p>{resource.name}</p>
              </div>

              {resourceType === "Personal" && (
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Rol</h2>
                  <p>{resource.role}</p>
                </div>
              )}

              {resourceType === "Material" && (
                <>
                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Cantidad</h2>
                    <p>{resource.quantity}</p>
                  </div>

                  <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Unidad</h2>
                    <p>{resource.unit}</p>
                  </div>
                </>
              )}

              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-2">
                  {resourceType === "Personal"
                    ? "Pago por hora"
                    : "Costo por Unidad"}
                </h2>
                <p>{resource.costPerUnit}</p>
              </div>
            </div>

            {costForThisResource && (
              <div className="flex space-x-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Descripción</h2>
                  <p>{costForThisResource.description}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Cantidad</h2>
                  <p>{costForThisResource.amount}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Frecuencia</h2>
                  <p>{costForThisResource.frequency}</p>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Estado</h2>
                  <p>{costForThisResource.status}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleCostClick}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4 inline-block"
            >
              {costButtonText}
            </button>

            <button
              onClick={handleBack}
              className="inline-flex justify-center py-2 px-4 mr-20 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver
            </button>
            {resourceType === "Personal" && (
              <Link
                to={`/resources/edit/${resource.id}`}
                onClick={() => localStorage.setItem("type", "Personal")}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </Link>
            )}

            {resourceType === "Material" && (
              <Link
                to={`/resources/edit/${resource.id}`}
                onClick={() => localStorage.setItem("type", "Material")}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </Link>
            )}

            <button
              onClick={async () => await deleteHandler(resource.id)}
              className="inline-block bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceDetails;
