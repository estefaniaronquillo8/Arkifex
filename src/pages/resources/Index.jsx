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
  const { resources, setResources, roleInSession, showNotification } =
    useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [personalSearchTerm, setPersonalSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTable, setSelectedTable] = useState("materiales"); // Estado para almacenar la tabla seleccionada
  const itemsPerPage = 20; // Número de elementos por página de materiales
  // personal items
  const [currentPersonalPage, setCurrentPersonalPage] = useState(1);
  const itemsPersonalPage = 10;
  //
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
    localStorage.clear();
    if (token !== null) {
      localStorage.setItem("token", token);
    }
  }, []);
  useEffect(() => {
    if (roleInSession && roleInSession.name) {
      console.log(roleInSession.name);
    }
  }, [roleInSession]);

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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // funcion para filtro de personal

  const handlePersonalSearchTermChange = (event) => {
    setPersonalSearchTerm(event.target.value);
  };

  // Función para avanzar a la siguiente página
  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para retroceder a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para avanzar a la siguiente página personal
  const handlePerNextPage = () => {
    const totalPagesp = Math.ceil(filteredResources.length / itemsPersonalPage);
    if (currentPersonalPage < totalPagesp) {
      setCurrentPersonalPage(currentPersonalPage + 1);
    }
  };

  // Función para retroceder a la página anterior personal
  const handlePerPreviousPage = () => {
    if (currentPersonalPage > 1) {
      setCurrentPersonalPage(currentPersonalPage - 1);
    }
  };

  // Filtrar los recursos en función de los filtros y término de búsqueda
  const filteredResources = resources
    .filter((resource) => {
      if (selectedTable === "materiales") {
        return resource.type === "Material";
      } else if (selectedTable === "personal") {
        return resource.type === "Personal";
      }
      return false;
    })
    // .filter((resource) => {
    //   if (unitFilter === "") {
    //     return true;
    //   } else {
    //     return resource.unit === unitFilter;
    //   }
    // })
    .filter((resource) => {
      if (searchTerm === "") {
        return true;
      } else {
        return resource.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    .filter((resource) => {
      if (personalSearchTerm === "") {
        return true;
      } else {
        return resource.name
          .toLowerCase()
          .includes(personalSearchTerm.toLowerCase());
      }
    });

  // Obtener los recursos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);
  // Obtener los recursos para la página personal
  const startIndexp = (currentPersonalPage - 1) * itemsPersonalPage;
  const endIndexp = startIndexp + itemsPersonalPage;
  const currentResourcesp = filteredResources.slice(startIndexp, endIndexp);

  return (
    <div className="flex-container">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-semibold mb-6">Recursos</h1>

        <nav className="navres">
          <button
            className={`btnnav text-white px-7 py-6  rounded inline-block ${
              selectedTable === "materiales" ? "btnpul" : ""
            }`}
            onClick={() => setSelectedTable("materiales")} // Cambiar la tabla seleccionada al hacer clic
          >
            Materiales
          </button>
          <button
            className={`btnnav text-white px-7 py-6 rounded inline-block ${
              selectedTable === "personal" ? "btnpul" : ""
            }`}
            onClick={() => setSelectedTable("personal")} // Cambiar la tabla seleccionada al hacer clic
          >
            Personal
          </button>
        </nav>

        {selectedTable === "materiales" && ( // Mostrar la tabla de materiales si se seleccionó "Materiales"
          <>
            <br />
            <h1 className="text-2xl font-semibold mb-3">TABLA DE MATERIALES</h1>
            <div className="flex justify-between items-center">
              {roleInSession && roleInSession.name !== "client" && (
                <Link
                  to="/resources/create"
                  onClick={() => localStorage.setItem("type", "Material")}
                  className="mt-1 bg-blue-500 text-white px-4 py-2 mr-5 rounded mb-4 inline-block"
                >
                  Crear Material
                </Link>
              )}

              <input
                type="text"
                placeholder="Buscar materiales"
                className="p-2 border border-gray-300 rounded"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="mt-4 min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Descripción</th>
                    <th className="px-4 py-2">
                      Precio en el Mercado
                      {/* permite HACER EL FILTRO <select
                    className="ml-2 p-1 border border-gray-300 rounded"
                    value={unitFilter}
                    onChange={handleUnitFilterChange}
                  >
                    <option value="">Todos</option>
                    {getUniqueUnits().map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select> */}
                    </th>

                    {roleInSession && roleInSession.name !== "client" &&(
                      <th className="px-4 py-2">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentResources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-4 py-2">{resource.name}</td>
                      <td className="px-4 py-2">{resource.description}</td>
                      <td className="px-4 py-2">{resource.marketPrice}</td>
                      {roleInSession && roleInSession.name !== "client" && (
                        <td className="px-4 py-2">
                          <Link
                            to={`/resources/edit/${resource.id}`}
                            onClick={() =>
                              localStorage.setItem("type", "Material")
                            }
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                          >
                            Editar M
                          </Link>

                          <button
                            onClick={async () =>
                              await deleteHandler(resource.id)
                            }
                            className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Eliminar M
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleNextPage}
                disabled={currentResources.length < itemsPerPage}
              >
                Siguiente
              </button>
            </div>
          </>
        )}

        {selectedTable === "personal" && ( // Mostrar la tabla de personal si se seleccionó "Personal"
          <div>
            <br />
            <h1 className="text-2xl font-semibold mt-3 mb-3">
              TABLA DE PERSONAL
            </h1>
            <div className="flex justify-between items-center">
              <Link
                to="/resources/create"
                onClick={() => localStorage.setItem("type", "Personal")}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
              >
                Crear Personal
              </Link>

              <input
                type="text"
                placeholder="Buscar Personal"
                className="p-2 border border-gray-300 rounded"
                value={personalSearchTerm}
                onChange={handlePersonalSearchTermChange}
              />
            </div>

            <table className="mt-4 min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Precio en el Mercado</th>
                  {roleInSession && roleInSession.name !== "client" && (
                    <th className="px-4 py-2">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentResources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="border px-4 py-2">{resource.name}</td>
                    <td className="border px-4 py-2">{resource.description}</td>
                    <td className="border px-4 py-2">{resource.marketPrice}</td>
                    {roleInSession && roleInSession.name !== "client" && (
                      <td className="border px-4 py-2">
                        <Link
                          to={`/resources/edit/${resource.id}`}
                          onClick={() =>
                            localStorage.setItem("type", "Personal")
                          }
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => deleteHandler(resource.id)}
                          className="inline-block bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePerPreviousPage}
                disabled={currentPersonalPage === 1}
              >
                Anterior
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePerNextPage}
                disabled={currentResourcesp.length < itemsPersonalPage}
              >
                Siguiente
              </button>
            </div>
          </div>

          //  aqui muere todo
        )}
      </div>
    </div>
  );
};

export default ResourceIndex;
