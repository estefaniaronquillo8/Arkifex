// src/pages/projects.js
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAllProjects } from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";
import DashboardStateGrid from "./DashboardStatsGrid";
import ResourcesChart from "./ResourcesChart";
import LineChart from "./LineChart";
import BuyerChart from "./BuyerChart";
import Navbar from "../../components/Navbar";

const ProjectDashboards = () => {
  const {
    projects,
    setProjects,
    users,
    setUsers,
    userInSession,
    setSelectedProjectId,
    showNotification,
  } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();

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



  return (
    <div className="min-h-screen bg-red-100 flex  justify-center">
      <div className="container mx-auto px-4 py-6 mt-5">

      <Navbar />
      <div className="flex flex-col gap-4 mt-8">
        <DashboardStateGrid />
        <div className="flex flex-row gap-2 w-full">
          <ResourcesChart />
          <BuyerChart />
        </div>

        <LineChart />
        
      </div>
    
      </div></div>
  );
};

export default ProjectDashboards;
