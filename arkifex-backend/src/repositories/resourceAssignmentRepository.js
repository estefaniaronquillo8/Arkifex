const { ResourceAssignment, sequelize } = require("../models");

const createResourceAssignment  = async (assignmentData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findAssignmentByResourceProject(assignmentData);
    if (response.assignment) {
      return { status: 409, message: "Ya existe una Recurso asignado con ese nombre." };
    }
    const assignment = await ResourceAssignment.create(assignmentData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      assignment: assignment,
      message: "¡Recurso asignado creada exitosamente!",
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const updateResourceAssignment = async (id, assignmentData) => {
  const transaction = await sequelize.transaction();
  try {
    if (assignmentData) {
      const response = await findAssignmentByResourceProject(assignmentData);
      if (response.status === 200 && response.location.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Ya existe una Recurso asignado con ese nombre.",
        };
      }
    }
    await ResourceAssignment.update(assignmentData, { where: { id }, transaction });
    await transaction.commit();
    const updatedAssignment = await findById(id);
    return {
      status: 200,
      message: "!Recurso asignado actualizado exitosamente!",
      assignment: updatedAssignment.assignment,
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const deleteAssignment = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await ResourceAssignment.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "¡Recurso asignado eliminado exitosamente!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const getAllAsignments = async () => {
    const assignment = await ResourceAssignment.findAll();
  
    if (!assignment || assignment.length === 0) {
      return { status: 404, message: "No existen registros." };
    }
  
    return { status: 200, assignment: assignment };
  };


  const findAssignmentByResourceProject = async (assignmentData) => {
    const assignment = await ResourceAssignment.findOne({ where: { projecId: assignmentData.projectId, resourceId: assignmentData.resourceId } });
    if (!assignment) {
      return { status: 404, message: 'Recurso asignado no encontrada.' };
    }
    return { status: 200, project };
  };

  const findAssignmentByProject = async (projectId) => {
    const assignment = await ResourceAssignment.findOne({ where: { projecId: projectId} });
    if (!assignment) {
      return { status: 404, message: 'Recurso asignado no encontrada.' };
    }
    return { status: 200, project };
  };
  
  const findById = async (id) => {
    const assignment = await ResourceAssignment.findByPk(id);
  
    if (!assignment) {
      return { status: 404, message: "Recurso asignado no encontrado." };
    }
  
    return { status: 200, assignment: assignment };
  };

module.exports = {
  createResourceAssignment,
  updateResourceAssignment,
  deleteAssignment,
  getAllAsignments,
  findAssignmentByResourceProject,
  findAssignmentByProject,
  findById,
};
