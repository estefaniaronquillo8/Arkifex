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
  const [lastNotification, setLastNotification] = useState(null);

  const showNotification = (currentNotification, isSuccess) => {
    if (currentNotification !== lastNotification) {
      if (isSuccess) {
        toast.success(currentNotification, { autoClose: 1250 });
        setLastNotification(currentNotification);
      } else {
        toast.error(currentNotification, { autoClose: 1250 });
        setLastNotification(currentNotification);
      }
    }
  };

  const value = {
    users,
    setUsers,
    user,
    setUser,
    showNotification,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
