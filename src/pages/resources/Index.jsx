// src/pages/resources.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllResources,
  handleDelete,
} from "../../services/resource.api.routes";
import { Link } from "react-router-dom";

const ResourceIndex = () => {
  const { resources, setResources, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    const fetchResources = async () => {
      const { response, success, error, notificationType } =
        await getAllResources();
      if (response?.resources) {
        setResources(response.resources);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResources();
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
      setResources(response.resources);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Recursos</h1>
      <Link
        to="/resources/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Recurso
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-8 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Nombre</div>
          <div className="col-span-1">Tipo</div>
          <div className="col-span-1">Rol</div>
          <div className="col-span-1">Cantidad</div>
          <div className="col-span-1">Unidad</div>
          <div className="col-span-1">Costo por Unidad</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {resources &&
          resources.map((resource) => (
            <div
              key={resource.id}
              className="grid grid-cols-8 gap-4 py-2 border-b border-gray-200"
            >
              <div className="col-span-1 pl-3">{resource.name}</div>
              <div className="col-span-1">{resource.type}</div>
              <div className="col-span-1">{resource.role}</div>
              <div className="col-span-1">{resource.quantity}</div>
              <div className="col-span-1">{resource.unit}</div>
              <div className="col-span-1">{resource.costPerUnit}</div>
              <div className="col-span-2">
                <Link
                  to={`/resources/edit/${resource.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </Link>
                <button
                  onClick={async () => await deleteHandler(resource.id)}
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

export default ResourceIndex;
