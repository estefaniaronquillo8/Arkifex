// src/pages/locations.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllLocations, handleDelete } from "../../services/location.api.routes";
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
    if(!routesProtection()) navigate("/login");
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
        <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Proyecto</div>
          <div className="col-span-1">Dirección</div>
          <div className="col-span-1">Latitud</div>
          <div className="col-span-1">Longitud</div>
          <div className="col-span-1">Area</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {locations &&
          locations.map((location) => (
            <div
              key={location.id}
              className="grid grid-cols-7 gap-4 py-2 border-b border-gray-200"
            >
              <div className="col-span-1 pl-3">{location.projectId}</div>
              <div className="col-span-1">{location.address}</div>
              <div className="col-span-1">{location.latitude}</div>
              <div className="col-span-1">{location.longitude}</div>
              <div className="col-span-1">{location.area}</div>

              <div className="col-span-2">
                <Link
                  to={`/locations/edit/${location.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
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
    </div>
  );
};

export default LocationIndex;
