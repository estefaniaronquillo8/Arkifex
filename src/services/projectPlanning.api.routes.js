// src/services/cost.api.routes.js
import { getAllProjectsPlanning } from "../../arkifex-backend/src/repositories/projectPlanningRepository";
import { requestHandler } from "./requestService";

export const getAllProjectsPlanning = () => {
  return requestHandler("get", "/projectspl");
};

export const handleCreate = (cost) => {
  return requestHandler("post", "/projectspl/create", cost);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/projectspl/edit/${id}`);
};

export const handleUpdate = (id, cost) => {
  return requestHandler("put", `/projectspl/edit/${id}`, cost);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/projectspl/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllProjectsPlanning() };
  }
  return { response, success, error, notificationType };
}