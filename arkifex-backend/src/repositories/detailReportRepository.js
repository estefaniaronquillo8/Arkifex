const { where } = require("sequelize");
const {
  Report,
  Project,
  ProjectPlanning,
  DetailReport,
  Resource,
  sequelize,
  ResourceAssignment,
} = require("../models");

const createDetailReportPlanning = async (projectId, reportId) => {
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

    //Number of tasks and number of tasks completed
    const PlanningResults = await ProjectPlanning.findAll({
      where: { projectId: projectId },
      attributes: [
        "id",
        "name",
        "ProjectPlanning.projectId",
        [
          sequelize.fn("SUM", sequelize.col("ResourceAssignments.actualCost")),
          "ActualTotalCostOfTask",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.col("ResourceAssignments.estimatedCost")
          ),
          "EstimatedTotalCostOfTask",
        ],
        [
          sequelize.literal("COUNT(ResourceAssignments.resourceId)"),
          "ResourcesCount",
        ],
        [
          sequelize.literal("SUM(actualCost) - SUM(estimatedCost)"),
          "CostVariance",
        ],
        [
          sequelize.literal("DATEDIFF(MAX(endDate), CURDATE())"),
          //sequelize.literal("DATEDIFF(DAY, MAX(endDate), GETDATE())"),
          "dateVariance",
        ],
      ],
      include: [
        {
          model: ResourceAssignment,
          attributes: [],
        },
      ],
      group: ["id", "name"],
    });

    const mappedPlanningResults = PlanningResults.map(async (result) => {
      const {
        id,
        name,
        ActualTotalCostOfTask,
        EstimatedTotalCostOfTask,
        ResourcesCount,
        CostVariance,
        dateVariance,
      } = result.toJSON();

      // Assign values to variables or perform any other operations
      const formattedId = id.toString();
      const formattedName = name.toUpperCase();
      const costDifference = CostVariance;

      const newDetailReport = await DetailReport.create({
        projectId: projectId,
        reportId: reportId,
        isProjectPlanning: "Si",
        projectPlanningId: id,
        projectPlanningName: formattedName,
        actualTotalCost: ActualTotalCostOfTask,
        estimatedTotalCost: EstimatedTotalCostOfTask,
        countOfResources: ResourcesCount,
        totalCostVariance: CostVariance,
        timeVariance: dateVariance,
        date: new Date(),
      });
      
    });

    const ResourceResults = await ResourceAssignment.findAll({
      //where: { projectId: projectId },
      attributes: [
        [sequelize.col("ProjectPlanning.id"), "ProjectPlanningId"],
        [sequelize.col("ProjectPlanning.name"), "ProjectPlanningName"],
        [sequelize.col("Resource.name"), "ResourceName"],
        [sequelize.col("Resource.type"), "resourceType"],
        [
          sequelize.fn("SUM", sequelize.col("ResourceAssignment.actualCost")),
          "ActualCostOfResource",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.col("ResourceAssignment.estimatedCost")
          ),
          "EstimatedCostOfResource",
        ],
        [
          sequelize.literal("ResourceAssignment.quantity"),
          "ResourcesCount",
        ],
        [
          sequelize.literal("SUM(actualCost) - SUM(estimatedCost)"),
          "CostVariance",
        ],
      ],
      include: [
        {
          model: ProjectPlanning,
          attributes: [],
          where: {
            projectId: projectId,
          },
        },
        {
          model: Resource,
          attributes: [],
        },
      ],
      group: [
        "ProjectPlanning.id",
        "ProjectPlanning.name",
        "Resource.name",
        "Resource.type",
        "quantity"
      ],
      //raw: true, // To retrieve raw data instead of Sequelize model instances
    });

    const mappedResults = ResourceResults.map(async (result) => {
      const {
        ProjectPlanningId,
        ProjectPlanningName,
        ResourceName,
        resourceType,
        ActualCostOfResource,
        EstimatedCostOfResource,
        ResourcesCount,
        CostVariance,
      } = result.toJSON();

      // Assign values to variables or perform any other operations
      const formattedId = ProjectPlanningId.toString();
      const formattedName = ProjectPlanningName.toUpperCase();
      const UnitaryActualCostOfTask = ActualCostOfResource / ResourcesCount;
      const UnitaryEstimatedTotalCostOfTask =
        EstimatedCostOfResource / ResourcesCount;
      const costDifference =
        UnitaryActualCostOfTask - UnitaryEstimatedTotalCostOfTask;
      //console.log(UnitaryActualCostOfTask);

      const newDetailResourceReport = await DetailReport.create({
        projectId: projectId,
        reportId: reportId,
        isProjectPlanning: "No",
        projectPlanningId: ProjectPlanningId,
        projectPlanningName: formattedName,
        resourceName: ResourceName,
        resourceType: resourceType,
        actualUnitaryCost: UnitaryActualCostOfTask,
        estimatedUnitaryCost: UnitaryEstimatedTotalCostOfTask,
        actualTotalCost: ActualCostOfResource,
        estimatedTotalCost: EstimatedCostOfResource,
        countOfResources: ResourcesCount,
        totalCostVariance: CostVariance,
        unitaryCostVariance: costDifference,
        //timeVariance: dateVariance,
        date: new Date(),
      });
      console.log("NEW DETAIL REPORT", newDetailResourceReport);
    });
    //await transaction.commit();
    //console.log (tasksActualCost);
    return {
      status: 200,
      message: "DetailReportPlanning Created Successfully",
    };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR DEL CREATE DETAIL REPORT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getBudgetByProjectPlanningReport = async (projectId) => {
  try {
    const project = await Project.findByPk(projectId);

    const maxdate = await Report.max("date");
    //console.log(response.toJSON);
    const report = await Report.findAll({
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
    //   "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualCostOfTask, SUM(RAS.estimatedCost) as EstimatedCostOfTask FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");
    // const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
    //   "SELECT RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY RES.type"
    // );

    const budgetPlanning = await DetailReport.findAll({
      attributes: [
        "projectPlanningId",
        "projectPlanningName",
        "actualTotalCost",
        "estimatedTotalCost",
        "countOfResources",
        "totalCostVariance",
        "timeVariance",
      ],
      where: { isProjectPlanning: "Si", reportId: report.id },
      group: ["projectPlanningId"],
    });

    return {
      status: 200,
      report: budgetPlanning,

      // projectplannings: budgetByTask,
      // resourcebudget:budgetByResources
    };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT PROJECT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getLateTasks = async (projectId) => {
  try {
    const project = await Project.findByPk(projectId);

    const maxdate = await Report.max("date");
    //console.log(response.toJSON);
    const report = await Report.findAll({
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
    //   "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualCostOfTask, SUM(RAS.estimatedCost) as EstimatedCostOfTask FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");
    // const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
    //   "SELECT RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY RES.type"
    // );

    const lateTasks = await DetailReport.findAll({
      attributes: [
        "projectPlanningId",
        "projectPlanningName",
        "actualTotalCost",
        "estimatedTotalCost",
        "countOfResources",
        "totalCostVariance",
        "timeVariance",
      ],
      where: {
        isProjectPlanning: "Si",
        reportId: report.id,
        timeVariance: { [Op]: 0 },
      },
      group: ["projectPlanningId"],
    });

    return {
      status: 200,
      report: lateTasks,

      // projectplannings: budgetByTask,
      // resourcebudget:budgetByResources
    };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT PROJECT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getDetailResources = async (projectId) => {
  try {
    const project = await Project.findByPk(projectId);

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

    //console.log(report.id);

    // const [budgetByTask, metadatabudgetByTask] = await sequelize.query(
    //   "SELECT PPS.id as ProjectPlanningId, PPS.name,SUM(RAS.actualCost) as ActualCostOfTask, SUM(RAS.estimatedCost) as EstimatedCostOfTask FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id WHERE projectId = "+projectId+" GROUP BY PPS.id,PPS.name");
    // const [budgetByResources, metadaBudgetByResources] = await sequelize.query(
    //   "SELECT RES.type, SUM(RAS.actualCost) as ActualCostOfResource, SUM(RAS.estimatedCost) as EstimatedCostOfResource, SUM(RAS.actualCost)-SUM(RAS.estimatedCost) as ResourceCostVariance  FROM ResourceAssignments RAS INNER JOIN ProjectPlannings PPS ON RAS.id = PPS.id LEFT JOIN Resources RES ON RAS.resourceId = RES.id WHERE projectId = "+projectId+" GROUP BY RES.type"
    // );

    const detailResources = await DetailReport.findAll({
      attributes: [
        "projectId",
        "reportId",
        "isProjectPlanning",
        "projectPlanningId",
        "projectPlanningName",
        "resourceName",
        "resourceType",
        "actualUnitaryCost",
        "estimatedUnitaryCost",
        "actualTotalCost",
        "estimatedTotalCost",
        "countOfResources",
        "totalCostVariance",
        "unitaryCostVariance",
      ],
      where: { isProjectPlanning: "No", reportId: report.id },
      limit: 10,
    });

    return {
      status: 200,
      report: detailResources,

      // projectplannings: budgetByTask,
      // resourcebudget:budgetByResources
    };
  } catch (error) {
    //await transaction.rollback();
    console.log("ERROR GET REPORT PROJECT PLANNING", error);
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

module.exports = {
  createDetailReportPlanning,
  getBudgetByProjectPlanningReport,
  getDetailResources,
};
