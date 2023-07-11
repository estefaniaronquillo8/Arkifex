import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllProjects,
  handleDelete,
} from "../../services/project.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { getAllUsers } from "../../services/user.api.routes";
import Swal from "sweetalert2";
import { createReport, getLastReport } from "../../services/report.api.routes";


const ProjectIndex = () => {
  const {
    projects,
    setProjects,
    users,
    setUsers,
    userInSession,
    roleInSession,
    setSelectedProjectId,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isClient = roleInSession && roleInSession.name === "client";

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      const { response: userResponse } = await getAllUsers();
      const {
        response: projectResponse,
        success,
        error,
        notificationType,
      } = await getAllProjects();

      if (userResponse?.users) {
        setUsers(userResponse.users);
      }

      if (projectResponse?.projects) {
        setProjects(projectResponse.projects);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjectsAndUsers();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  useEffect(() => {
    // Limpiar los datos relevantes cuando el usuario cambie
    setProjects([]);
    setUsers([]);
    setSelectedProjectId(null);
    setSuccess(null);
    setError(null);
    setNotificationType(null);
  }, [userInSession]);

  const handleCreateProject = () => {
    setSelectedProjectId(null);
    navigate("/projects/create");
  };

  const handleClick = () => {
    Swal.fire({
      title: '¿Qué deseas crear?',
      showCancelButton: true,
      confirmButtonText: 'Proyecto desde 0',
      cancelButtonText: 'Desde plantilla',
      confirmButtonColor: '#405BF1', // Color de fondo del botón de confirmación (rojo)
      cancelButtonColor: '#7C63BA', // Color de
    }).then((result) => {
      if (result.value === true) {
        // Redirigir a la página "Desde 0"
        navigate('/projects/create');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Redirigir a la página "Desde plantilla"
        navigate('/templates');
      }
    });
    

  };

  const [isHovered, setIsHovered] = useState(false);

  const handleCreateReport = async (projectid) => {
    
    const { response, success, error, notificationType } = await createReport(
      projectid
    );

    console.log("ProjectReport", response.report);

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    //setSelectedProjectId(projectid);
   
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const filterProjects = () => {
    if (roleInSession && (roleInSession.name === "superAdmin" || roleInSession.name === "admin")) {
      // Mostrar todos los proyectos para los usuarios con roles de "SuperAdmin" y "Admin"
      return projects.filter(
        (project) =>
          !project.parentId &&
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (roleInSession && roleInSession.name === "client") {
      // Mostrar solo los proyectos del tipo "Client" para los usuarios con el rol de "Client"
      return projects.filter(
        (project) =>
          !project.parentId &&
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          project.userId === userInSession.id
      );
    } else {
      // Otro caso (por ejemplo, si no se ha cargado el rol del usuario)
      return [];
    }
  };
  
  const filteredProjects = filterProjects();
  

  return (
    <div className="container mx-auto px-4 py-6 mt-5">
      <h1 className="text-4xl font-semibold mb-6">Proyectos</h1>
      <input
        type="text"
        placeholder="Buscar proyectos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded mb-4"
      />

      <div className="grid grid-cols-3 gap-4">
        {!isClient && (
          <Link
            //to="/projects/create"
            className="bg-gray-300 bg-opacity-60 text-white px-4 py-3 rounded flex flex-col items-center text-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            <br />

            <span className="mb-2">
              <BsFillPlusCircleFill
                size={50}
                color={isHovered ? "#4D14D9" : "#7256EE"}
              />
            </span>
            <span className="text-xl font-semibold text-gray-800">
              Crear Proyecto
            </span>
          </Link>
        )}
        {filteredProjects.length > 0 ? (
          filteredProjects.map(({ id, name, startDate, endDate, userId }) => {
            const user = users.find((user) => user.id === userId);
            return (
              <div
                key={id}
                className="bg-white shadow-md rounded-lg p-4"
                style={{
                  backgroundImage: `linear-gradient(rgba(1, 1, 1, 0.6), rgba(1, 2, 5, 0.5)), url(/src/assets/map.png)`,
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-xl font-bold mb-2 text-white">{name}</h2>
                <h5 className=" font-bold mb-2 text-white">
                  Encargado: {user ? `${user.name} ${user.lastname}` : "Unknown"}
                </h5>
                <h5 className=" font-bold mb-2 text-white">
                  Inicio: {startDate}
                </h5>
                <h3 className="font-bold mb-2 text-white">
                  Fin: {endDate}
                </h3>
                <div>
                  <Link
                    to={`/projects/details/${id}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Detalles
                  </Link>
                  <Link
                    to={`/projects/dashboards/${id}`}
                    className="inline-block bg-[#FFBD0D] text-black font-bold px-4 py-2 rounded mr-2"
                    onClick={()=> handleCreateReport(id)}
                  >
                    Dashboards
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p>No se encontraron proyectos.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectIndex;
