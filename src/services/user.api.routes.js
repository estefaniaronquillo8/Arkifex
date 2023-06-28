// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const handleRegister = (data) => {
  return requestHandler('post', '/auth/register', data);
}

export const handleLogin = (data) => {
  return requestHandler('post', '/auth/login', data);
}

export const handleLogout = (navigate) => {
  navigate("/login");
};

export const getAllUsers = () => {
  return requestHandler("get", "/users");
};

export const handleCreate = (data) => {
  return requestHandler("post", "/users/create", data);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/users/edit/${id}`);
};

export const handleUpdate = (id, user) => {
  return requestHandler("put", `/users/edit/${id}`, user);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/users/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllUsers() };
  }
  return { response, success, error, notificationType };
}