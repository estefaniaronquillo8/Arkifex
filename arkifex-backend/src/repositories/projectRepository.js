const { Project, sequelize } = require("../models");
// const { Sequelize, Transaction } = require('sequelize');

const createProject = async (projectData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectByName(projectData.name);
    if (response.project) {
      return { status: 409, message: "Ya existe un proyecto con ese nombre." };
    }
    const project = await Project.create(projectData, { transaction });
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

const updateProject = async (id, projectData) => {
  const transaction = await sequelize.transaction();
  try {
    if (projectData.name) {
      const response = await findProjectByName(projectData.name);
      if (response.status === 200 && response.project.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Ya existe un proyecto con ese nombre.",
        };
      }
    }
    await Project.update(projectData, { where: { id }, transaction });
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

const deleteProject = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Project.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "¡Proyecto eliminado exitosamente!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const getAllProjects = async () => {
    const projects = await Project.findAll();
  
    if (!projects || projects.length === 0) {
      return { status: 404, message: "No existen registros." };
    }
  
    return { status: 200, projects: projects };
  };
  
  const findProjectByName = async (name) => {
    const project = await Project.findOne({ where: { name } });
    if (!project) {
      return { status: 404, message: 'Proyecto no encontrado.' };
    }
    return { status: 200, project };
  };
  
  const findProject = async (where) => {
    const project = await Project.findOne(where);
    if (!project) {
      return { status: 404, message: "Proyecto no encontrado." };
    }
  
    return { status: 200, project: project };
  };
  
  const findById = async (id) => {
    const project = await Project.findByPk(id);
  
    if (!project) {
      return { status: 404, message: "Proyecto no encontrado." };
    }
  
    return { status: 200, project: project };
  };

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  findProjectByName,
  findProject,
  findById,
};
