const {
  Report,
  Project,
  ProjectPlanning,
  DetailReport,
  Resource,
  sequelize,
  ResourceAssignment,
} = require("../models");
const { createDetailReportPlanning } = require("./detailReportRepository");

const createReport = async (projectId) => {
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
    let lateTasks = 0;
    let maxLateDate = new Date(project.endDate);

    const date = new Date();

    //Number of tasks and number of tasks completed

    
    projectplannings.map(async (planning) => {
      if (planning.status === "Completado") {
        taskfinshed++;
      }

      
      //console.log('DATEEEEEEEEEEEEEEEEEEEEEE', new Date(planning.endDate), date,new Date(planning.endDate) <= date);
      if (new Date(planning.endDate) <= date && planning.status !== "Completado"){
        lateTasks++;
        if (new Date(planning.endDate) >= maxLateDate){
          maxLateDate = new Date(planning.endDate);
        }
      }

      
      const resourceAssignments = (
        await ResourceAssignment.findAll({
          where: { projectPlanningId: planning.id },
        })
      ).map((x) => {
        tasksEstimatedCost += x.estimatedCost;
        tasksActualCost += x.actualCost;
        return true;
      });

      tasks++;
    });

    

    const results = await ResourceAssignment.findAll({
      attributes: [
        "ProjectPlanning.projectId",
        [
          sequelize.literal("SUM(actualCost*quantity)"),
          "ActualBudget",
        ],
        [
          sequelize.literal("SUM(estimatedCost*quantity)"),
          "EstimatedBudget",
        ],      
        [
          sequelize.literal("SUM(estimatedCost*quantity)-SUM(actualCost*quantity)"),
          "CostVariance",
        ],
        [sequelize.literal('DATEDIFF(MAX(endDate), CURDATE())'), 'dateVariance']
        /* [
          sequelize.literal("DATEDIFF(DAY, MAX(endDate), GETDATE())"),
          "dateVariance",
        ], */
      ],
      include: [
        {
          model: ProjectPlanning,
          where: {
            projectId: projectId,
          },
          attributes: [],
        },
      ],
      group: ["projectId"],
    });

    let actualBudget = 0;
    let estimatedBudget = 0;
    let costVariance = 0;
    let dateVariance = 0;
    

    if(maxLateDate === new Date('1999-01-01')){
      dateVariance =0;
    } else {
      const differenceInMilliseconds = maxLateDate - new Date();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      dateVariance = differenceInDays;
      
    };

    results.map((result) => {
      actualBudget = result.getDataValue("ActualBudget");
      estimatedBudget = result.getDataValue("EstimatedBudget");
      costVariance = result.getDataValue("CostVariance");
      //dateVariance = result.getDataValue("dateVariance");
    });

    //console.log("STATUSSSSSSSSSSSSS",project.status);
    if(project.status !== "Completado" && project.status !== "Cancelado"){
    const report = await Report.create(
      {
        projectId: projectId,
        projectName: project.name,
        userId: project.userId,
        actualBudget: actualBudget,
        estimatedBudget: estimatedBudget,
        numberOfTasks: tasks,
        taskCompleted: taskfinshed,
        budgetVariance: costVariance,
        timeVariance: dateVariance,
        latePlanningRatio: lateTasks/tasks,
        date: date,
      },
      //{ transaction }
    );

    

    await createDetailReportPlanning(projectId, report.id);

    await transaction.commit();

    return {
      status: 200,
      message: "Report Created Successfully",
      report: report,
    };

    }else{
      await transaction.rollback();

      return {
        status: 409,
        message: "Project status completed or finished",
        notificationType: "info",
        //return: response.toJSON(),
      };
    }
    
    //console.log (tasksActualCost);
   
  } catch (error) {
    await transaction.rollback();
    console.log("ERROR DEL CREATE PROJECT", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getLastReport = async (projectId) => {
  try {
    const project = await Project.findOne({ where: { id: projectId } });

    const maxdate = await Report.max("date", {
      where: {
        projectId: projectId,
      },
    });
    //console.log(response.toJSON);
    const report = await Report.findOne({
      where: { projectId: projectId, date: maxdate },
    });

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

    return { status: 200, reportData: report };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT BY PROJECT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getReports = async (projectId) => {
  try {
    // const maxdate = await Report.max('date',{
    //   where: {
    //     projectId: projectId
    //   }
    // });
    //console.log(response.toJSON);
    const report = await Report.findAll({ where: { projectId: projectId } });

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

    return { status: 200, reportData: report };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT BY PROJECT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

module.exports = {
  createReport,
  getLastReport,
  getReports,
};
