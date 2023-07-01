import { requestHandler } from "./requestService";

export const getAllReports = (projectId) => {
  return requestHandler("get", `/reports/all/${projectId}`);
};

export const getLastReport = (projectId) => {
  return requestHandler("get", `/reports/${projectId}`);
};

export const createReport = (projectId) => {
  return requestHandler("post", `/reports/create/${projectId}`);
};

