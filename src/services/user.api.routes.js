// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

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