const {Report,Project,ProjectPlanning,resourceAssignments, sequelize} = require ("../models");
const {findById: findProject, findProjectByName} = require("../repositories/projectRepository");
const {findById: findProjectPlanning, getAllProjectPlanningsByProject} = require("../repositories/projectPlanningRepository");
const {findResourceAssignmentByProjectPlanningId} = require("../repositories/resourceAssignmentRepository");



const createReport  = async (projectId) => {
    //const transaction = await sequelize.transaction();
    try {
      const project = await Project.findByPk(projectId);
      //console.log(response.toJSON);

      if (!project) {
        return {
          status: 409,
          message: "Project doesn't exists",
          notificationType: "info",
          //return: response.toJSON(),
        };
      }
        //const project = response.project;
        const projectplannings = await project.getProjectPlannings();
        const numtaskfinshed = 0;
        projectplannings.forEach(planning =>{
          if(planning.status === 'Finished'){
            numtaskfinshed++;
          }
        });
        return { status:200,projectplannings: numtaskfinshed};

        
      
        

      
      //await transaction.commit();
      //return { projectplannings: projectplannings };
    } catch (error) {
      //await transaction.rollback();
      console.log("ERROR DEL CREATE PROJECT",error)
      return {
        status: 500,
        message: "Internal server error",
        notificationType: "error",
      };
    }
}; 

module.exports = {
  createReport
}