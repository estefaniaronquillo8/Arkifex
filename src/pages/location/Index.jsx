// src/pages/locations/index.jsx
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllLocations,
  handleDelete,
} from "../../services/location.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const LocationIndex = () => {
  const { locations, setLocations, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const { response, success, error, notificationType } =
        await getAllLocations();
      if (response?.locations) {
        setLocations(response.locations);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchLocations();
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
      setLocations(response.locations);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const renderLocationGrid = () => {
    const locationGroups = locations.reduce((accumulator, location, index) => {
      const groupIndex = Math.floor(index / 4);
      accumulator[groupIndex] = accumulator[groupIndex] || [];
      accumulator[groupIndex].push(location);
      return accumulator;
    }, []);

    return locationGroups.map((group, groupIndex) => (
      <div
        key={groupIndex}
        className="grid grid-cols-2 gap-8 py-2 border-b-2 border-gray-200"
      >
        {group.map((location) => (
          <div key={location.id} className="border p-4">
            <div className="font-semibold text-blue-800">
              Proyecto: {location.projectId}
            </div>
            <div className="mt-2">Dirección: {location.address}</div>
            <div className="mt-2">Area: {location.area}</div>
            <div className="mt-2">
              Puntos de polígono: {location.polygon.length}
            </div>
            <div className="mt-7">
              <Link
                to={`/locations/edit/${location.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-5"
              >
                Editar
              </Link>
              <button
                onClick={async () => await deleteHandler(location.id)}
                className="inline-block bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Localización de Proyectos</h1>
      <Link
        to="/locations/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Localización de Proyecto
      </Link>
      <div className="bg-white shadow-md rounded-lg">
        {renderLocationGrid()}
      </div>
    </div>
  );
};

export default LocationIndex;
