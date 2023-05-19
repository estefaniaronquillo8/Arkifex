const { ProjectPlanning, sequelize } = require("../models");
// const { Sequelize, Transaction } = require('sequelize');

const createProjectPlanning = async (projectPlanningData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectByName(projectPlanningData.name);
    if (response.project) {
      return { status: 409, message: "Ya existe un proyecto con ese nombre." };
    }
    const project = await Project.create(projectPlanningData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      project: project,
      message: "¡Proyecto creado exitosamente!",
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const updateProjectPlanning = async (id, projectPlanningData) => {
  const transaction = await sequelize.transaction();
  try {
    if (projectPlanningData.name) {
      const response = await findProjectByName(projectPlanningData.name);
      if (response.status === 200 && response.project.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Ya existe un proyecto con ese nombre.",
        };
      }
    }
    await ProjectPlanning.update(projectPlanningData, { where: { id }, transaction });
    await transaction.commit();
    const updatedProject = await findById(id);
    return {
      status: 200,
      message: "¡Proyecto actualizado exitosamente!",
      project: updatedProject.project,
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const deleteProjectPlanning = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await ProjectPlanning.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "¡Proyecto eliminado exitosamente!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const getAllProjectsPlanning = async () => {
    const projects = await ProjectPlanning.findAll();
  
    if (!projects || projects.length === 0) {
      return { status: 404, message: "No existen registros." };
    }
  
    return { status: 200, projects: projects };
  };
  
  const findProjectByNamePlanning = async (name) => {
    const project = await ProjectPlanning.findOne({ where: { name } });
    if (!project) {
      return { status: 404, message: 'Proyecto no encontrado.' };
    }
    return { status: 200, project };
  };
  
  const findProjectPlanning = async (where) => {
    const project = await ProjectPlanning.findOne(where);
    if (!project) {
      return { status: 404, message: "Proyecto no encontrado." };
    }
  
    return { status: 200, project: project };
  };
  
  const findById = async (id) => {
    const project = await ProjectPlanning.findByPk(id);
  
    if (!project) {
      return { status: 404, message: "Proyecto no encontrado." };
    }
  
    return { status: 200, project: project };
  };

module.exports = {
  createProjectPlanning,
  updateProjectPlanning,
  deleteProjectPlanning,
  getAllProjectsPlanning,
  findProjectByNamePlanning,
  findProjectPlanning,
  findById,
};
