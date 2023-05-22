// src/context/GlobalContext.js
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: 0,
    name: "",
    lastname: "",
    email: "",
  });

  const [resources, setResources] = useState([]);
  const [resource, setResource] = useState({
    id: 0,
    name: "",
    type: "",
    role: "",
    quantity: 0,
    unit: "",
    costPerUnit: 0,
  });

  const [costs, setCosts] = useState([]);
  const [cost, setCost] = useState({
    id: 0,
    resourceId: 0,
    description: "",
    amount: 0,
    frequency: "",
    status: "",
  });

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    id: 0,
    parentId: 0,
    name: "",
    description: "",
  });

  const [projectPlannings, setProjectPlannings] = useState([]);
  const [projectPlanning, setProjectPlanning] = useState({
    id: 0,
    projectId: 0,
    name: "",
    startDate: null,
    endDate: null,
    estimatedBudget: 0,
  });

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({
    id: 0,
    projectId: 0,
    address: "",
    latitude: 0,
    longitude: 0,
    area: 0,
  });

  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [resourceAssignment, setResourceAssignment] = useState({
    id: 0,
    resourceId: 0,
    projectId: 0,
    quantity: 0,
  });

  const [lastNotification, setLastNotification] = useState(null);

  const showNotification = (currentNotification, type) => {
    if (currentNotification !== lastNotification) {
      switch (type) {
        case "success":
          toast.success(currentNotification, { autoClose: 1250 });
          setLastNotification(currentNotification);
          break;
        case "info":
          toast.info(currentNotification, { autoClose: 1250 });
          setLastNotification(currentNotification);
          break;
        case "error":
          toast.error(currentNotification, { autoClose: 1250 });
          setLastNotification(currentNotification);
          break;
        case "warn":
          toast.warn(currentNotification, { autoClose: 1250 });
          setLastNotification(currentNotification);
          break;

        default:
          break;
      }
    }
  };

  const value = {
    // Users
    users,
    setUsers,
    user,
    setUser,
    // Resources
    resource,
    setResource,
    resources,
    setResources,
    // Costs
    cost,
    setCost,
    costs,
    setCosts,
    // Project Plannings
    projectPlannings,
    setProjectPlannings,
    projectPlanning,
    setProjectPlanning,
    // Projects
    projects,
    setProjects,
    project,
    setProject,
    // Locations
    locations,
    setLocations,
    location,
    setLocation,
    // Resource Assignments
    resourceAssignments,
    setResourceAssignments,
    resourceAssignment,
    setResourceAssignment,
    
    showNotification,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
