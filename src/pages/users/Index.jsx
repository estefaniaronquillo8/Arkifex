import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllUsers, handleDelete } from "../../services/user.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

const UserIndex = () => {
  const { users, setUsers, roleInSession, userInSession, showNotification } =
    useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const checkRouteProtection = async () => {
      if (!routesProtection()) {
        navigate("/login");
      }
    };

    checkRouteProtection();
  }, [navigate]);

  useEffect(() => {
    if (roleInSession) {
      setIsLoading(false);
    }
  }, [roleInSession]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { response, success, error, notificationType } =
        await getAllUsers();
      if (response?.users) {
        const filteredUsers =
          roleInSession && roleInSession.name === "superAdmin"
            ? response.users.filter((user) => user.roleId !== 1)
            : response.users;
        setUsers(filteredUsers);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    if (!isLoading && roleInSession) {
      fetchUsers();
    }
  }, [isLoading, setUsers, roleInSession]);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  function getRoleName(roleId) {
    switch (roleId) {
      case 2:
        return "Administrador";
      case 3:
        return "Cliente";
      default:
        return "N/A";
    }
  }

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setUsers(response.users);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const exportToPDF = () => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar contenido al documento PDF
    doc.setFontSize(30);
    doc.text("Lista de usuarios", 15, 15);

    users.forEach((user, index) => {
      const yPos = 35 + index * 30;

      // Agregar el nombre del usuario
      doc.setFontSize(14);
      doc.text(`Nombre: ${user.name}`, 15, yPos);

      // Agregar el apellido del usuario
      doc.setFontSize(12);
      doc.text(`Apellidos: ${user.lastname}`, 15, yPos + 10);

      // Agregar el rol del usuario
      doc.setFontSize(12);
      doc.text(`Rol: ${getRoleName(user.roleId)}`, 15, yPos + 20);

      // Agregar una línea separadora
      doc.setLineWidth(0.5);
      doc.line(15, yPos + 25, 195, yPos + 25);
    });

    // Guardar y descargar el archivo PDF
    doc.save("usuarios.pdf");
  };

  if (!routesProtection()) {
    return null; // Otra opción es redirigir al usuario a otra página en lugar de simplemente no mostrar nada
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (roleInSession && roleInSession.name !== "superAdmin") {
    return <div>Acceso no autorizado</div>; // Página de acceso no autorizado
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mt-4 UserIndex text-4xl font-bold mb-6">
        Usuarios protegidos
      </h1>

      {/* <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Exportar a PDF
      </button> */}
      <Link
        to="/users/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Usuario
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pl-2">Nombre</th>
              <th>Apellido</th>
              <th>Rol</th>
              <th>Correo electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map(
                (user) =>
                  user.roleId !== 1 && (
                    <tr key={user.id}>
                      <td className="pl-3">{user.name}</td>
                      <td>{user.lastname}</td>
                      <td>{getRoleName(user.roleId)}</td>
                      <td>{user.email}</td>
                      <td>
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "¿Estás seguro?",
                              text: "¡No podrás revertir esto!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Sí, eliminarlo",
                              cancelButtonText: "Cancelar",
                            });

                            if (result.isConfirmed) {
                              await deleteHandler(user.id);
                              Swal.fire(
                                "¡Eliminado!",
                                "Tu usuario ha sido eliminado.",
                                "success"
                              );
                            }
                          }}
                          className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserIndex;
