// src/services/template.api.routes.js
import { requestHandler } from "./requestService";

export const getAllTemplates = () => {
  return requestHandler("get", "/templates");
};

export const handleCreate = (template) => {
  return requestHandler("post", "/templates/create", template);
};

export const duplicateProject = (id) => {
  return requestHandler("post", `/templates/duplicate/${id}`);
};

export const duplicateSubproject = (id, parentId) => {
  return requestHandler("post", `/templates/duplicate-subpry/${id}`, { parentId });
};

