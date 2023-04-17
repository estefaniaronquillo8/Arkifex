import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Error al comunicarse con el servidor"
      );
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Usuario eliminado con éxito");
      fetchUsers();
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Error al comunicarse con el servidor"
      );
    }
  };

  useEffect(() => {
    const errorMessage = localStorage.getItem("errorMessage");
    const successMessage = localStorage.getItem("successMessage");

    if (errorMessage) {
      toast.error(errorMessage);
      localStorage.removeItem("errorMessage");
    }
    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem("successMessage");
    }
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-semibold mb-6 pl-2">Usuarios protegidos</h1>
      {error ? (
        <p className="text-red-500 mb-4">Error: {error}</p>
      ) : (
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
                  onClick={() => handleDelete(user.id)}
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Index;
