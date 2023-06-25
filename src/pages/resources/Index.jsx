import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllResources, handleDelete } from "../../services/resource.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ResourceIndex = () => {
  const { resources, setResources, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const [unitFilter, setUnitFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Número de elementos por página
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
    const fetchResources = async () => {
      const { response, success, error, notificationType } = await getAllResources();
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
    const { response, success, error, notificationType } = await handleDelete(id);
    if (response?.status === 200) {
      setResources(response.resources);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  // Función para obtener las unidades únicas de los recursos
  const getUniqueUnits = () => {
    const units = resources
      .filter((resource) => resource.type === "Material")
      .map((resource) => resource.unit);
    return [...new Set(units)];
  };

  // Función para manejar el cambio en el filtro de unidad
  const handleUnitFilterChange = (event) => {
    setUnitFilter(event.target.value);
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
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

  // Filtrar los recursos en función de los filtros y término de búsqueda
  const filteredResources = resources.filter((resource) => resource.type === "Material")
    .filter((resource) => {
      if (unitFilter === "") {
        return true;
      } else {
        return resource.unit === unitFilter;
      }
    })
    .filter((resource) => {
      if (searchTerm === "") {
        return true;
      } else {
        return resource.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

  // Obtener los recursos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);

  return (
    <div className="flex-container">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-semibold mb-6">Recursos</h1>

        <nav className="bg-blue-500">
          <br />
          <Link
            to="/resources/create"
            onClick={() => localStorage.setItem("type", "Material")}
            className="bg-blue-500 text-white px-4 py-2 mr-5 rounded mb-4 inline-block"
          >
            Crear Material
          </Link>
          <Link
            to="/resources/create"
            onClick={() => localStorage.setItem("type", "Personal")}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            Crear Personal
          </Link>
          

          <Link
          
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            Pagina Personal
          </Link>
        </nav>

        <h1 className="text-2xl font-semibold mb-3">TABLA DE MATERIALES</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar materiales"
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">
                  Unidad
                  <select
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
                  </select>
                </th>
                <th className="px-4 py-2">Costo por Unidad</th>
                <th className="px-4 py-2">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {currentResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-4 py-2">{resource.name}</td>
                  <td className="px-4 py-2">{resource.quantity}</td>
                  <td className="px-4 py-2">{resource.unit}</td>
                  <td className="px-4 py-2">{resource.costPerUnit}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/resources/details/${resource.id}`}
                      onClick={() => localStorage.setItem("type", "Material")}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Detalles
                    </Link>
                  </td>
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
      </div>
    </div>
  );
};

export default ResourceIndex;
