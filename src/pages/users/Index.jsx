// src/pages/users/Index.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllUsers, handleDelete } from "../../services/user.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const UserIndex = () => {
  const { users, setUsers, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!routesProtection()) navigate("/login");
  }, []);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { response, success, error, notificationType } = await getAllUsers();
      if (response?.users) {
        setUsers(response.users);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const deleteHandler = async(id) => {
    const { response, success, error, notificationType } = await handleDelete(id);
    if (response?.status === 200) {
      setResources(response.resources);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Usuarios protegidos</h1>
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-5 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
          <div className="col-span-1 pl-2">Nombre</div>
          <div className="col-span-1">Apellido</div>
          <div className="col-span-1">Correo electrónico</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {users && users.map((user) => (
          <div key={user.id} className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200">
            <div className="col-span-1 pl-3">{user.name}</div>
            <div className="col-span-1">{user.lastname}</div>
            <div className="col-span-1">{user.email}</div>
            <div className="col-span-2">
              <Link
                to={`/users/edit/${user.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </Link>
              <button
                onClick={async() => await deleteHandler(user.id)}
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

export default UserIndex;
