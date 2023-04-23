// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const getAllResources = () => {
  return requestHandler("get", "/resources");
};

export const handleCreate = (data) => {
  return requestHandler("post", "/resources/create", data);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/resources/edit/${id}`);
};

export const handleUpdate = (id, cost) => {
  return requestHandler("put", `/resources/edit/${id}`, cost);
};

export const handleDelete = async (id) => {
  const { response, success, error } = await requestHandler("delete", `/resources/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllResources() };
  }
  return { response, success, error };
}