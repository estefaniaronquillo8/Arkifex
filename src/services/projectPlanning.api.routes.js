// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const getAllProjectPlannings = () => {
  return requestHandler("get", "/projectPlannings");
};

export const handleCreate = (projectPlanning) => {
  return requestHandler("post", "/projectPlannings/create", projectPlanning);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/projectPlannings/edit/${id}`);
};

export const handleUpdate = (id, projectPlanning) => {
  return requestHandler("put", `/projectPlannings/edit/${id}`, projectPlanning);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/projectPlannings/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllProjectPlannings() };
  }
  return { response, success, error, notificationType };
}