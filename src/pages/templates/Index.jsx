// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllTemplates } from "../../services/template.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/report.api.routes";



const TemplateIndex = () => {
  const [currentSection, setCurrentSection] = useState("templates");
  const {
    projects,
    setProjects,
    users,
    setUsers,
    setSelectedProjectId,
    roleInSession,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  const [showSubprojectsButton, setShowSubprojectsButton] = useState(true);
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
      } = await getAllTemplates();

      if (userResponse?.users) {
        setUsers(userResponse.users);
      }

      if (projectResponse?.projects) {
        setProjects(projectResponse.projects);
        /* const templateProjects = projectResponse.projects.filter(
          (project) => project.isTemplate
        );
        setProjects(templateProjects); */
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

  const handleCreateTemplate = () => {
    setSelectedProjectId(null);
    navigate("/templates/create");
  };
  
  const handleBack = () => {
    setShowSubprojectsButton(true); // Restablecer el estado de showSubprojectsButton a true
    if (projects.parentId) {
      navigate(`/templates/details/${projects.parentId}`);
    } else {
      navigate("/templates");
    }
  };

  const handleCreateReport = async (projectid) => {
    try{
      const { response, success, error, notificationType } = await createReport(
        projectid
      );
  
      console.log("ProjectReport", response);
  
      if (success) {
        showNotification(success, notificationType);
      }
  
      if (error) {
        showNotification(error, notificationType);
      }
  
      //setSelectedProjectId(projectid);
      window.location.reload();
    }catch{
      console.log("Sin datos suficientes");
    }
    
  };

  const TemplatesSection = ({ project }) => {
    return (
          <div>
            {!project.parentId && (
              <>
               {roleInSession && roleInSession.name !== "client" && (
            
      <button
        onClick={handleCreateTemplate}
        className="bg-green-500 text-white px-4 py-2 mr-2 mt-6 rounded mb-4 inline-block"
      >
        Crear Nueva Plantilla
      </button>
               )}
      {/* <Link
        to="/projects/create"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
        Crear Proyecto
      </Link> */}
      <h1 className="text-4xl font-semibold mb-6">Creadas desde 0</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto"> 
  <table className="table-auto w-full">
    <thead>
      <tr className="font-semibold border-b border-gray-200">
        <th className="ml-5">Nombre</th>
        <th>Descripción</th>
        <th>Status</th>
        <th colSpan="2">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {projects &&
        projects
          .filter((project) => project.status === "Template")
          .map((project) => {
            if (!project.parentId) {
              /* const user = users.find((user) => user.id === project.userId); */
              return (
                <tr
                  key={project.id}
                  className="border-b border-gray-200"
                >
                  <td className="ml-5">{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.status}</td>
                  <td colSpan="2">
                    <Link
                      to={`/templates/details/${project.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Detalles
                    </Link>
                    <Link
                    to={`/templates/dashboard/${project.id}`}
                    className="inline-block bg-[#FFBD0D] text-black font-bold px-4 py-2 rounded mr-2"
                    onClick={() => handleCreateReport(project.id)}
                  >
                    Dashboards
                  </Link>
                  </td>
                </tr>
              );
            }
            return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
          })}
    </tbody>
  </table>
</div>

              </>
            )}
          </div>
        );
      };
    //PROYECTOS AQUIII


    const getStatusColor = (status) => {
      switch (status) {
        case "No comenzado":
          return "#D41F1F";
        case "En Proceso":
          return "#F0C500 ";
        case "En Espera":
          return "#FA6F0E";
        case "Completado":
          return "#A8DA1A";
        case "Cancelado":
          return "#777777";
        default:
          return "black";
      }
    };


    const ProjectsSection = ({ project }) => {
      return(
        <div>
        <h1 className="text-4xl font-semibold mb-6">Proyectos</h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
  <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Encargado</th>
          <th>Status</th>
          <th>Fecha de Inicio</th>
          <th>Fecha de Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {projects &&
          projects
            .filter((project) => project.status !== "Template" && !project.parentId)
            .map((project) => {
              const user = users.find((user) => user.id === project.userId);
              return (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{user ? `${user.name} ${user.lastname}` : "Sin encargado"}</td>
                  <td>
                          <span
                            className="dot"
                            style={{
                              backgroundColor: getStatusColor(
                                project.status
                              ),
                            }}
                          ></span>
                          {project.status}
                        </td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>
                    <Link
                      to={`/projects/details/${project.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Detalles
                    </Link>
                  </td>
                </tr>
              );
              return null;
            })}
      </tbody>
    </table>
  </div>
</div>

      </div>

      
    );};


  //SUBPROYECTOS AQUIII
  // const SubprojectsSection = ({ project }) => {
  //   return (
  //     <div>
  //       <h1 className="text-4xl font-semibold mb-6">Subproyectos</h1>
  //     <div className="bg-white shadow-md rounded-lg">
  //       <div className="grid grid-cols-7 gap-4 font-semibold mb-2 py-3 border-b border-gray-200">
  //         <div className="col-span-1 ml-5">Nombre</div>
  //         <div className="col-span-1">Descripción</div>
  //         {/* <div className="col-span-1">Encargado</div> */}
  //         <div className="col-span-1">Status</div>
  //         <div className="col-span-1">Fecha de Inicio</div>
  //         <div className="col-span-1">Fecha de Fin</div>
  //         <div className="col-span-2">Acciones</div>
  //       </div>
  //       {projects &&
  //         projects.map((project) => {
  //           if (project.parentId) {
  //             const user = users.find((user) => user.id === project.userId);
  //             return (
  //               <div
  //                 key={project.id}
  //                 className="grid grid-cols-7 gap-4 py-2 border-b border-gray-200"
  //               >
  //                 <div className="col-span-1 ml-5">{project.name}</div>
  //                 <div className="col-span-1">{project.description}</div>
  //                 {/* <div className="col-span-1 pl-3">
  //                   {user ? user.name + " " + user.lastname : "Sin encargado"}
  //                 </div> */}
  //                 <div className="col-span-1">{project.status}</div>
  //                 <div className="col-span-1">{project.startDate}</div>
  //                 <div className="col-span-1">{project.endDate}</div>

  //                 <Link
  //                         to={`/projects/details/${project.id}`}
  //                         onClick={() => {
  //                           setShowSubprojectsButton(false);
  //                           setCurrentSection("details");
  //                         }}
  //                         className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
  //                       >
  //                         Detalles 2
  //                       </Link>
  //               </div>
  //             );
  //           }
  //           return null; // En caso de que `project.parentId` exista, retornamos null para que no se muestre nada en el renderizado.
  //         })}
  //     </div>
  //   </div>
    
  //   );
  // };


  return (
    <div className="container mx-auto px-4 py-6">
    <h2 className="mt-4 text-4xl font-semibold mb-6">
      Plantillas
    </h2>

    <div>
      <nav className="navtemp">
      <button
     className={`btnnavtemp text-white px-7 py-6 rounded inline-block ${currentSection === "templates" ? "activeButton" : ""} `}

     onClick={() => setCurrentSection("templates")}
    >
      Nuevas Plantillas
    </button>
        <button
         className={`btnnavtemp text-white px-7 py-6 rounded inline-block ${currentSection === "projects" ? "activeButton" : ""}`}
           onClick={() => setCurrentSection("projects")}
        >
          Proyectos
        </button>
        {/* {showSubprojectsButton && (
            <button
              className={`btnnavtemp text-white px-7 py-6 rounded inline-block ${
                currentSection === "psubprojects" ? "activeButton" : ""
              }`}
              onClick={() => setCurrentSection("psubprojects")}
            >
              SubProyectos
            </button>
          )} */}
      </nav>
      {currentSection === "templates" && <TemplatesSection project={projects} />}
     {currentSection === "projects" && <ProjectsSection project={projects} />}

    {/* {currentSection === "psubprojects" && <SubprojectsSection project={projects} />} */}
    </div>
  
  
  </div>
  );
};

export default TemplateIndex;
