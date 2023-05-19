// src/services/project.api.routes.js
import { getAllProjects } from "../../arkifex-backend/src/repositories/projectRepository";
import { requestHandler } from "./requestService";

export const getAllProjects = () => {
  return requestHandler("get", "/projects");
};

export const handleCreate = (project) => {
  return requestHandler("post", "/projects/create", project);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/projects/edit/${id}`);
};

export const handleUpdate = (id, project) => {
  return requestHandler("put", `/projects/edit/${id}`, project);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/projects/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllProjects() };
  }
  return { response, success, error, notificationType };
}