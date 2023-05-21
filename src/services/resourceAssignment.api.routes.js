// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const getAllassignments = () => {
  return requestHandler("get", "/assignments");
};

export const handleCreate = (assignment) => {
  return requestHandler("post", "/assignments/create", assignment);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/assignments/edit/${id}`);
};

export const handleUpdate = (id, assignment) => {
  return requestHandler("put", `/assignments/edit/${id}`, assignment);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/assignments/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllassignments() };
  }
  return { response, success, error, notificationType };
}