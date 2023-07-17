import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  handleEdit,
  handleUpdate,
  handleValidatePassword,
} from "../../services/user.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import Swal from "sweetalert2";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, roleInSession, userInSession, showNotification } =
    useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [validationFailed, setValidationFailed] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const isClient = roleInSession && roleInSession.name === "client";
  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { response, success, error, notificationType } = await handleEdit(
        id
      );
      if (response?.user) {
        if (!response.user.password) {
          response.user.password = null;
        }
        setUser(response.user);
      }
      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updateUser = { ...user };

    // Si la contraseña es nula, eliminamos el campo de contraseña del objeto updateUser
    if (updateUser.password === null) {
      delete updateUser.password;
    }
    const { success, error, notificationType } = await handleUpdate(
      id,
      updateUser
    );
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/users");
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (roleInSession) {
      console.log(roleInSession.name);
      console.log(userInSession.name);
    }
  }, [roleInSession]);

  const isSuperAdmin =
    roleInSession &&
    roleInSession.name === "superAdmin" &&
    id !== userInSession.id;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Editar usuario</h2>
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              {roleInSession &&
                roleInSession.name !== "client" &&
                roleInSession.name !== "admin" &&
                id !== "1" && (
                  <div className="mb-4">
                    <label
                      htmlFor="roleId"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Rol
                    </label>
                    <select
                      id="roleId"
                      name="roleId"
                      value={user.roleId}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="2">Administrador</option>
                      <option value="3">Cliente</option>
                    </select>
                  </div>
                )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido:
                </label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico:
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              {roleInSession && roleInSession.name === "superAdmin" && (
                <button
                  type="button"
                  onClick={async () => {
                    const { value: formValues } = await Swal.fire({
                      title: "Verificar contraseña",
                      html:
                        '<input id="swal-input1" class="swal2-input" placeholder="Email" readonly>' +
                        '<input id="swal-input2" class="swal2-input" placeholder="Contraseña" type="password">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          document.getElementById("swal-input1").value,
                          document.getElementById("swal-input2").value,
                        ];
                      },

                      didOpen: () => {
                        document.getElementById("swal-input1").value =
                          userInSession.email;
                      },
                    });

                    if (formValues) {
                      const data = {
                        email: formValues[0],
                        password: formValues[1],
                      };

                      try {
                        const response = await handleValidatePassword(data);
                        console.log(response);

                        if (
                          response &&
                          response.success === "Valid password!"
                        ) {
                          console.log(
                            "CONSOLE DENTRO DEL IF",
                            response.success
                          );
                          Swal.fire({
                            title: "Éxito",
                            text: "Contraseña validada correctamente",
                            icon: "success",
                            confirmButtonText: "OK",
                          });
                          console.log(
                            "CONSOLE DENTRO DEL IF mas abajo",
                            response.success
                          );
                          setShowPasswordInput(true);
                        }
                        if (
                          response &&
                          response.error === "Contraseña incorrecta"
                        ) {
                          setValidationFailed(true);
                          console.log(
                            "Entra en el error hola",
                            validationFailed
                          );
                        }
                      } catch (error) {
                        setValidationFailed(true);
                        setShowPasswordInput(false);
                        console.error("Error during validation:", error);
                      }
                    }

                    if (validationFailed) {
                      Swal.fire({
                        title: "Error",
                        text: "La contraseña no es válida",
                        icon: "error",
                        confirmButtonText: "OK",
                      });
                      setValidationFailed(false);
                    }
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ¿Cambiar contraseña?
                </button>
              )}

              {roleInSession &&
                roleInSession.name === "superAdmin" &&
                showPasswordInput && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contraseña:
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      //value={user.password}
                      onChange={handleChange}
                      className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>
                )}
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserEdit;
