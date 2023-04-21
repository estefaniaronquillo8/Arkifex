// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  editUser,
  updateUser,
  getUsers,
  deleteUser,
} from "../services/authenticated.api.routes";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const handleDelete = async (userId) => {
    await deleteUser(userId);
  };

  const handleEdit = async (id, navigate) => {
    return await editUser(id, navigate);
  };

  const handleUpdate = async (id, username, email, navigate) => {
    await updateUser(id, username, email, navigate);
  };

  const fetchUsers = async () => {
    const { users } = await getUsers();
    setUsers(users);
  };

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ users, handleDelete, handleEdit, handleUpdate, fetchUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};
