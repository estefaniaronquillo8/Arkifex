import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`
  return config;
});

const handleRequest = async (method, endpoint, data) => {
  try {
    const response = await api[method](endpoint, data);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Error al comunicarse con el servidor";
    return { data: null, error: errorMessage };
  }
};

const editUser = async (id, navigate) => {
  const response = await handleRequest("get", `/users/edit/${id}`);

  if (!response.error) {
    return { user: response.data.user };
  } else {
    localStorage.setItem("errorMessage", response.error);
    navigate("/users");
  }
};

const updateUser = async (id, data, navigate) => {
  const response = await handleRequest("put", `/users/edit/${id}`, {
    data,
  });

  if (!response.error) {
    localStorage.setItem("successMessage", response.data.message);
    navigate("/users");
  } else {
    toast.error(response.error);
  }
};

const getUsers = async () => {
  const response = await handleRequest("get", "/users");
  if (!response.error) {
    return { users: response.data.users };
  } else {
    localStorage.setItem("errorMessage", response.error);
  }
};

const deleteUser = async (userId) => {
  const response = await handleRequest("delete", `/users/delete/${userId}`);

  if (!response.error) {
    toast.success(response.data.message);
  } else {
    toast.error(response.error);
  }
};

export { editUser, updateUser, getUsers, deleteUser };
