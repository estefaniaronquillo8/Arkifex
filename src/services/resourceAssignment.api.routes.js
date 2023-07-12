// src/services/resourceAssignment.api.routes.js
import { requestHandler } from "./requestService";

export const getAllResourceAssignments = () => {
  return requestHandler("get", "/resourceAssignments");
};

export const handleCreate = (resourceAssignment) => {
  return requestHandler("post", "/resourceAssignments/create", resourceAssignment);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/resourceAssignments/edit/${id}`);
};

export const handleUpdate = (id, resourceAssignment) => {
  return requestHandler("put", `/resourceAssignments/edit/${id}`, resourceAssignment);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/resourceAssignments/delete/${id}`);
  if (response?.status === 200){
    console.log("ENTRA AQUI", success, error, response)
    return { ... await getAllResourceAssignments() };
  }
  console.log("HANDLE DELETE DEL API.ROUTES", success, error, response)
  return { response, success, error, notificationType };
}