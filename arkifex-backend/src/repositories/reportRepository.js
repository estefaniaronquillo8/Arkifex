const {Report, sequelize} = require ("../models");
const {findById: findProject, findProjectByName} = require("../repositories/projectRepository");
const {findById: findProjectPlanning, getAllProjectPlanningsByProject} = require("../repositories/projectPlanningRepository");

const createReport  = async (projectId) => {
    const transaction = await sequelize.transaction();
    try {
      const response = await findProject(projectId);

      if (response?.project) {
        return {
          status: 409,
          message: "Project doesn't exists",
          notificationType: "info",
        };
      }else{
        const project = response.project;
        const projectplanning = await getAllProjectPlanningsByProject(project.id)
      }
        

      
      await transaction.commit();
      return {
        status: 200,
        project: project,
        message: "Project created successfully!",
        notificationType: "success",
      };
    } catch (error) {
      await transaction.rollback();
      console.log("ERROR DEL CREATE PROJECT",error)
      return {
        status: 500,
        message: "Internal server error",
        notificationType: "error",
      };
    }
}; 


