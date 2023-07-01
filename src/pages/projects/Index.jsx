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
import CostCreate from "../projects/Create";
import { createReport, getLastReport } from "../../services/report.api.routes";


const ProjectIndex = () => {
  const { projects, setProjects, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { response, success, error, notificationType } =
        await getAllProjects();
      if (response?.projects) {
        setProjects(response.projects);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

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

    setSelectedProjectId(null);
    if (response?.status === 200) {
      navigate("/projects");
    }
  };

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setProjects(response.projects);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const filteredProjects = projects.filter(
    (project) =>
      !project.parentId &&
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link
          to="/projects/create"
          className="bg-gray-300 bg-opacity-60 text-white px-4 py-3 rounded flex flex-col items-center text-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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

        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-4"
              style={{
                backgroundImage: `linear-gradient(rgba(1, 1, 1, 0.6), rgba(1, 2, 5, 0.5)), url(/src/assets/map.png)`,
                backgroundPosition: "center",
              }}
            >
              <h2 className="text-xl font-bold mb-2 text-white">
                {project.name}
              </h2>
              <p className="mb-2 text-white">{project.description}</p>
              <h5 className=" font-bold mb-2 text-white">
                Inicio: {project.startDate}
              </h5>
              <h3 className="font-bold mb-2 text-white">
                Fin: {project.endDate}
              </h3>
              <div>
                <Link
                  to={`/projects/details/${project.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Detalles
                </Link>
                <Link
                  to={`/projects/dashboards/${project.id}`}
                  className="inline-block bg-[#FFBD0D] text-black font-bold px-4 py-2 rounded mr-2"
                  onClick={handleCreateReport(project.id)}
                >
                  Dashboards
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron proyectos.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectIndex;
