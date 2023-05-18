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
    users,
    setUsers,
    user,
    setUser,
    resource,
    setResource,
    resources,
    setResources,
    cost,
    setCost,
    costs,
    setCosts,
    showNotification,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
