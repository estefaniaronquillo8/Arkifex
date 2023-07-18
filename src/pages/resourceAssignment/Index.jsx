// src/pages/resourceAssignments.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllResourceAssignments,
  handleDelete,
} from "../../services/resourceAssignment.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ResourceAssignmentIndex = () => {
  const { resourceAssignments, setResourceAssignments, showNotification } =
    useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchResourceAssignments = async () => {
      const { response, success, error, notificationType } =
        await getAllResourceAssignments();
      if (response?.resourceAssignments) {
        setResourceAssignments(response.resourceAssignments);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResourceAssignments();
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
      setResourceAssignments(response.resourceAssignments);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Asignación de Recursos</h1>
      <Link
        to="/resourceAssignments/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Asignación de Recurso
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-5 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Proyecto</div>
          <div className="col-span-1">Recurso</div>
          <div className="col-span-1">Cantidad</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {resourceAssignments &&
          resourceAssignments.map((resourceAssignment) => (
            <div
              key={resourceAssignment.id}
              className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200"
            >
              <div className="col-span-1 pl-3">
                {resourceAssignment.projectId}
              </div>
              <div className="col-span-1">{resourceAssignment.resourceId}</div>
              <div className="col-span-1">{resourceAssignment.quantity}</div>

              <div className="col-span-2">
                <Link
                  to={`/resourceAssignments/edit/${resourceAssignment.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </Link>
                <button
                  onClick={async () =>
                    await deleteHandler(resourceAssignment.id)
                  }
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResourceAssignmentIndex;
