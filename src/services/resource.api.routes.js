// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const getAllResources = () => {
  return requestHandler("get", "/resources");
};

export const handleCreate = (resource) => {
  return requestHandler("post", "/resources/create", resource);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/resources/edit/${id}`);
};

export const handleUpdate = (id, resource) => {
  return requestHandler("put", `/resources/edit/${id}`, resource);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/resources/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllResources() };
  }
  return { response, success, error, notificationType };
}