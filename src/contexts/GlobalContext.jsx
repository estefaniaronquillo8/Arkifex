import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import jwtDecode from "jwt-decode";
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

  const [userInSession, setUserInSession] = useState(null);
  const [roleInSession, setRoleInSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
  
        // Verificamos la expiración del token
        const currentTime = Date.now().valueOf() / 1000;

        if (decodedToken.exp < currentTime) {
          console.error('Sesión Expirada');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setUserInSession(decodedToken.user);
          setRoleInSession(decodedToken.role);
        }
        
      } catch (error) {
        console.error('error', error);
      }
    }
  }, []);
  
  const setAuthData = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setUserInSession(decodedToken.user);
    setRoleInSession(decodedToken.role);
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    setUserInSession(null);
    setRoleInSession(null);
  };

  const [resources, setResources] = useState([]);
  const [resource, setResource] = useState({
    id: 0,
    name: "",
    type: "",
    role: "",
    description: "",
    marketPrice: 0,
  });

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    id: 0,
    userId: 0,
    parentId: 0,
    name: "",
    description: "",
    status: "",
    startDate: null,
    endDate: null,
    isTemplate: null,
  });

  const [projectPlannings, setProjectPlannings] = useState([]);
  const [projectPlanning, setProjectPlanning] = useState({
    id: 0,
    projectId: 0,
    name: "",
    description: "",
    status: "",
    startDate: null,
    endDate: null,
  });

  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [resourceAssignment, setResourceAssignment] = useState({
    id: 0,
    resourceId: 0,
    projectPlanningId: 0,
    quantity: 0,
    estimatedCost: 0,
    actualCost: 0,
    associatedDate: "",
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

  //reports

  const [reports, setReports] = useState([]);
  const [report, setReport] = useState({
    id:0,
    projectId: 0,
    userId: 1,
    actualBudget: 0,
    estimatedBudget: 0,
    numberOfTasks: 0,
    taskCompleted: 0,
    budgetVariance:0,
    timeVariance: 0,  
    latePlanningRatio: 0,
    date:  '',    
  });

  const [detailReports, setDetailReports] = useState([]);
  const [detailReport, setDetailReport] = useState({
    projectPlanningId: 0,
            projectPlanningName: "",
            
            actualTotalCost: 0,
            estimatedTotalCost: 0,
            countOfResources: 0,
            totalCostVariance: 0
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

    userInSession, 
    setUserInSession,
    roleInSession, 
    setRoleInSession,
    setAuthData,
    clearAuthData,

    // Resources
    resource,
    setResource,
    resources,
    setResources,

    // Projects
    projects,
    setProjects,
    project,
    setProject,

    selectedProjectId,
    setSelectedProjectId,
    
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

    // Project Plannings
    projectPlannings,
    setProjectPlannings,
    projectPlanning,
    setProjectPlanning,

    //reports
    report,
    setReport,
    reports,
    setReports,

    //detailReports
    detailReport,
    setDetailReport,
    detailReports,
    setDetailReports,

    showNotification,


  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
