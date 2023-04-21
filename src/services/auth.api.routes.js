import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({ baseURL: "http://localhost:3001" });

const handleRequest = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    toast.success(response.data.message);
    return response;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Error al comunicarse con el servidor");
    }
    return null;
  }
};

const handleLogin = async ({ email, password }, navigate) => {
  const response = await handleRequest("/auth/login", { email, password });

  if (response) {
    localStorage.setItem("token", response.data.token);
    navigate("/users");
  }
};

const handleRegister = async (data, navigate) => {
  const response = await handleRequest("/auth/register", data);

  if (response) {
    navigate("/login");
  }
};

const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  navigate("/login");
};

export { handleLogin, handleRegister, handleLogout };
