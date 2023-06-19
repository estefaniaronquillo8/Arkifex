const {Report,Project,ProjectPlanning, sequelize, ResourceAssignment} = require ("../models");
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
        let taskfinshed = 0;
        let tasks = 0;
        let tasksEstimatedCost = 0;
        let tasksActualCost = 0;


        //Number of tasks and number of tasks completed
        projectplannings.forEach(async planning => {
          if(planning.status === 'Finished'){
            taskfinshed++;
          }
          // const resourceAssignments = await ResourceAssignment.findAll({where:{projectPlanningId:planning.id}});
          // //console.log(resoureAssignments)
          // for(const resourceAssignment of resourceAssignments){
          //   tasksEstimatedCost+=resourceAssignment.estimatedCost;
          //   tasksActualCost+=resourceAssignment.actualCost;
          // }
          console.log(tasksActualCost);
          tasks++;            
        });

        const [budgetByTask, metadatabudgetByTask] = await sequelize.query(
          "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualCostOfTask, SUM(RAS.estimatedCost) as EstimatedCostOfTask FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");

          const [budgetData, metadataBudgetData] = await sequelize.query(
            "SELECT PPS.projectId, SUM(RAS.actualCost) as ActualBudget, SUM(RAS.estimatedCost) as EstimatedBudget, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as CostVariance, DATEDIFF(MAX(PPS.endDate), CURDATE()) as dateVariance "+
             "FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE PPS.projectId = "+projectId+" GROUP BY PPS.projectId");
  
        
        
          console.log (tasksActualCost);
        return { status:200,projectplannings: budgetData, metadata:metadataBudgetData };



        
      
        

      
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