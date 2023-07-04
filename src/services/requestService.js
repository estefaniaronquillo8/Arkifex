// src/services/request.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`
  return config;
});

export const requestHandler = async (method, url, data) => {
  try {
    const response = await api[method](url, data);
    console.log(response)
    return {
      response: response.data,
      success: response?.data?.message,
      error: null,
      notificationType: response?.data?.notificationType,
    };
  } catch (error) {
    console.log("erroor", error)
    return {
      response: error?.response?.data,
      success: null,
      error: error?.response?.data?.message ?? "Ha ocurrido un error inesperado.",
      notificationType: error?.response?.data?.notificationType ?? "error",
    };
  }
};