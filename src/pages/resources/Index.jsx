// src/pages/resources.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllResources,
  handleDelete,
} from "../../services/resource.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ResourceIndex = () => {
  const { resources, setResources, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  // Guardar el token del Local Storage en una variable
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
    // Limpieza del localStorage
    localStorage.clear();
    if (token !== null) {
      // Volver a guardar el token en el localStorage
      localStorage.setItem("token", token);
    }
  }, []);

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
        onClick={() => localStorage.setItem("type", "Material")}
        className="bg-green-500 text-white px-4 py-2 mr-5 rounded mb-4 inline-block"
      >
        Crear Material
      </Link>
      <Link
        to="/resources/create"
        onClick={() => localStorage.setItem("type", "Personal")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Personal
      </Link>

      <div className="bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-3">TABLA DE MATERIALES</h1>
        <div className="grid grid-cols-6 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Nombre</div>
          <div className="col-span-1">Cantidad</div>
          <div className="col-span-1">Unidad</div>
          <div className="col-span-1">Costo por Unidad</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {resources &&
          resources
            .filter((resource) => resource.type === "Material")
            .map((resource) => (
              <div
                key={resource.id}
                className="grid grid-cols-6 gap-4 py-2 border-b border-gray-200"
              >
                <div className="col-span-1 pl-3">{resource.name}</div>
                <div className="col-span-1">{resource.quantity}</div>
                <div className="col-span-1">{resource.unit}</div>
                <div className="col-span-1">{resource.costPerUnit}</div>
                <div className="col-span-2">
                  <Link
                    to={`/resources/details/${resource.id}`}
                    onClick={() => localStorage.setItem("type", "Material")}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            ))}
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mt-3 mb-3">TABLA DE PERSONAL</h1>
        <div className="grid grid-cols-5 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Nombre</div>
          <div className="col-span-1">Rol</div>
          <div className="col-span-1">Pago por hora</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {resources &&
          resources
            .filter((resource) => resource.type === "Personal")
            .map((resource) => (
              <div
                key={resource.id}
                className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200"
              >
                <div className="col-span-1 pl-3">{resource.name}</div>
                <div className="col-span-1">{resource.role}</div>
                <div className="col-span-1">{resource.costPerUnit}</div>
                <div className="col-span-2">
                  <Link
                    to={`/resources/details/${resource.id}`}
                    onClick={() => localStorage.setItem("type", "Personal")}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Detalles
                  </Link>
                  {/* <Link
                    to={`/resources/edit/${resource.id}`}
                    onClick={() => localStorage.setItem("type", "Personal")}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={async () => await deleteHandler(resource.id)}
                    className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button> */}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ResourceIndex;