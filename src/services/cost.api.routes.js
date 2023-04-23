// src/services/user.api.routes.js
import { requestHandler } from "./requestService";

export const getAllCosts = () => {
  return requestHandler("get", "/costs");
};

export const handleCreate = (data) => {
  return requestHandler("post", "/costs/create", data);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/costs/edit/${id}`);
};

export const handleUpdate = (id, cost) => {
  return requestHandler("put", `/costs/edit/${id}`, cost);
};

export const handleDelete = async (id) => {
  const { response, success, error } = await requestHandler("delete", `/costs/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllCosts() };
  }
  return { response, success, error };
}