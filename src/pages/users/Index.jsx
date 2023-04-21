// src/pages/users/Index.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllUsers } from "../../services/user.api.routes";
import { Link } from "react-router-dom";

const UserIndex = () => {
  const { users, setUsers, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const { response, success, error } = await getAllUsers();
      console.log(response)
      if (response?.users) {
        setUsers(response.users);
      }

      setError(error);
      setSuccess(success);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, true);
    }
    if (error) {
      showNotification(error, false);
    }
  }, [success, error, showNotification]);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-semibold mb-6 pl-2">Usuarios protegidos</h1>
      <>
        <div className="grid grid-cols-4 gap-4 font-semibold mb-2">
          <div className="col-span-1 pl-2">Nombre de usuario</div>
          <div className="col-span-1">Correo electrónico</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-4 gap-4 py-2">
            <div className="col-span-1 pl-3">{user.username}</div>
            <div className="col-span-1">{user.email}</div>
            <div className="col-span-2">
              <Link
                to={`/users/edit/${user.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </Link>
              <button
                //onClick={() => handleDelete(user.id)}
                className="inline-block bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </>
    </div>
  );
};

export default UserIndex;
