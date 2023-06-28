const {Report,Project,ProjectPlanning,DetailReport,Resource, sequelize, ResourceAssignment} = require ("../models");
const {createDetailReportPlanning} = require("./detailReportRepository");

const createReport  = async (projectId) => {
    const transaction = await sequelize.transaction();
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
        //let actualBudget = 0;
        let taskfinshed = 0;
        let tasks = 0;
        let tasksEstimatedCost = 0;
        let tasksActualCost = 0;
        
        const date = new Date();


        //Number of tasks and number of tasks completed
        projectplannings.map(async (planning) => {
          if(planning.status === 'Finished'){
            taskfinshed++;
          }
          const resourceAssignments = (await ResourceAssignment.findAll({where:{projectPlanningId:planning.id}})).map((x)=>{
            tasksEstimatedCost+=x.estimatedCost;
            tasksActualCost+=x.actualCost;
            return true;
          });
          //console.log(resoureAssignments)
          // for(const resourceAssignment of resourceAssignments){
          //   tasksEstimatedCost+=resourceAssignment.estimatedCost;
          //   tasksActualCost+=resourceAssignment.actualCost;
          // }
          // console.log(tasksActualCost);
          //console.log(tasksEstimatedCost);
          tasks++;            
        });          // const [budgetData, metadataBudgetData] = await sequelize.query(
          //   "SELECT PPS.projectId, SUM(RAS.actualCost) as ActualBudget, SUM(RAS.estimatedCost) as EstimatedBudget, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as CostVariance, DATEDIFF(MAX(PPS.endDate), CURDATE()) as dateVariance "+
          //    "FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE PPS.projectId = "+projectId+" GROUP BY PPS.projectId");
  
          const results = await ResourceAssignment.findAll({
            attributes: [
              'ProjectPlanning.projectId',
              [sequelize.fn('SUM', sequelize.col('actualCost')), 'ActualBudget'],
              [sequelize.fn('SUM', sequelize.col('estimatedCost')), 'EstimatedBudget'],
              [sequelize.literal('SUM(actualCost) - SUM(estimatedCost)'), 'CostVariance'],
              [sequelize.literal('DATEDIFF(MAX(endDate), CURDATE())'), 'dateVariance']
            ],
            include: [{
              model: ProjectPlanning,
              where: {
                projectId: projectId
              },
              attributes: []
            }],
            group: ['projectId']
          });

          let actualBudget = 0;
          let estimatedBudget = 0;
          let costVariance = 0;
          let dateVariance = 0;

       
    
          results.map(result => {
            actualBudget = result.getDataValue('ActualBudget');
            estimatedBudget = result.getDataValue('EstimatedBudget');
            costVariance = result.getDataValue('CostVariance');
            dateVariance = result.getDataValue('dateVariance');
          });


            const report = await Report.create({
            projectId: projectId,
            userId: 1,
            actualBudget: actualBudget,
            estimatedBudget: estimatedBudget,
            numberOfTasks: tasks,
            taskCompleted: taskfinshed,
            budgetVariance:costVariance,
            timeVariance: dateVariance,  
            date:  date,

          },{transaction});
          
          await createDetailReportPlanning(projectId,report.id);

          await transaction.commit();
          //console.log (tasksActualCost);
        return { status:200,message: 'Report Created Successfully', report: report};      
           
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

const getLastReport = async (projectId) => {
  try {
    const project = await Project.findAll({where: {id:projectId}});

    const maxdate = await Report.max('date');
    //console.log(response.toJSON);
    const report = await Report.findAll({where:{projectId: projectId, date: maxdate}});

    if (!project || !report) {
      return {
        status: 409,
        message: "Project doesn't exists",
        notificationType: "info",
        //return: response.toJSON(),
      };
    }
      // const [budgetByTask, metadatabudgetByTask] = await sequelize.query(
      //   "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualTotalCostOfTask, SUM(RAS.estimatedCost) as EstimatedTotalCostOfTask,  SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as CostVariance, DATEDIFF(MAX(PPS.endDate), CURDATE()) as dateVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");
      //const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
      //   "SELECT RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY RES.type"
      // );
      //const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
      //   "SELECT PPS.id,PPS.name,RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name,RES.type"
      // );

      return { status:200, reportData: report };
      

  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT BY PROJECT PLANNING",error)
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }

}

const getReports = async (projectId) => {
  try {
    //const project = await Project.findByPk(projectId);

    //const maxdate = await Report.max('date');
    //console.log(response.toJSON);
    const report = await Report.findAll({where:{projectId: projectId}});

    if (!report) {
      return {
        status: 409,
        message: "Project doesn't exists",
        notificationType: "info",
        //return: response.toJSON(),
      };
    }
      // const [budgetByTask, metadatabudgetByTask] = await sequelize.query(
      //   "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualTotalCostOfTask, SUM(RAS.estimatedCost) as EstimatedTotalCostOfTask,  SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as CostVariance, DATEDIFF(MAX(PPS.endDate), CURDATE()) as dateVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");
      //const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
      //   "SELECT RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY RES.type"
      // );
      //const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
      //   "SELECT PPS.id,PPS.name,RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name,RES.type"
      // );

      return { status:200, reportData: report };
      

  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT BY PROJECT PLANNING",error)
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }

}

module.exports = {
  createReport,
  getLastReport,
  getReports,
}