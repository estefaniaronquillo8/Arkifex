// src/services/location.api.routes.js
import { requestHandler } from "./requestService";

export const getAllLocations = () => {
  return requestHandler("get", "/locations");
};

export const handleCreate = (location) => {
  console.log(location)
  return requestHandler("post", "/locations/create", location);
};

export const handleEdit = (id) => {
  return requestHandler("get", `/locations/edit/${id}`);
};

export const handleUpdate = (id, location) => {
  return requestHandler("put", `/locations/edit/${id}`, location);
};

export const handleDelete = async (id) => {
  const { response, success, error, notificationType } = await requestHandler("delete", `/locations/delete/${id}`);
  if (response?.status === 200){
    return { ... await getAllLocations() };
  }
  return { response, success, error, notificationType };
}