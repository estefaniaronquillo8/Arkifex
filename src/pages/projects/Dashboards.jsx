// src/pages/projects.js
import React, { useEffect, useState} from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import { getLastReport, getAllReports, getDetailReport } from "../../services/report.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import DashboardStateGrid from "./DashboardStatsGrid";
import ResourcesChart from "./ResourcesChart";
import BudgetChart from "./budgetChart.";
import LineChart from "./LineChart";
import Navbar from "../../components/Navbar";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 


const generateProjectBudgetReport = (reportData, linesData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Set font size and style for the report title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');

  // Add the report title
  doc.text('Project Budget Report', margin, y);
  y += 20;

  // Set font size and style for the section headers
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');

  // Project details section
  doc.text('Project Details', margin, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Project ID: ${reportData.id}`, margin, y);
  y += 10;

  // Budget details section
  doc.text('Budget Details', margin, y);
  y += 10;
  doc.text(`Total Budget: $${reportData.actualBudget}`, margin, y);
  y += 7;
  doc.text(`Expenses: $${reportData.estimatedBudget}`, margin, y);
  y += 7;
  doc.text(`Remaining Budget: $${-reportData.estimatedBudget - reportData.actualBudget}`, margin, y);
  y += 10;

  // Line items section
  doc.text('Line Items', margin, y);
  y += 10;

  // Filter linesData for elements with resource type "Personal"
  const personalLinesData = linesData.filter((line) => line.resourceType === 'Personal');

  if (personalLinesData.length > 0) {
    // Set font size and style for the "Personal Asignado" table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Add the table title "Personal Asignado"
    doc.text('Personal Asignado', margin, y);
    y += 10;

    // Table headers for "Personal Asignado"
    const personalTableHeaders = [
      'Project Planning Name',
      'Actual Unitary Cost',
      'Estimated Unitary Cost',
      'Actual Total Cost',
      'Estimated Total Cost',
      'Count of Resources',
      'Total Cost Variance',
      'Unitary Cost Variance',
    ];

    // Table data for "Personal Asignado"
    const personalTableData = personalLinesData.map((line) => [
      line.projectPlanningName,
      line.actualUnitaryCost,
      line.estimatedUnitaryCost,
      line.actualTotalCost,
      line.estimatedTotalCost,
      line.countOfResources,
      line.totalCostVariance,
      line.unitaryCostVariance,
    ]);

    // Set font size and style for the "Personal Asignado" table body
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Calculate the totals for each column
    const personalTotals = personalTableHeaders.map((header, columnIndex) => {
      if (columnIndex === 0) return 'Total'; // Placeholder for the first column
      return personalTableData.reduce((total, row) => total + Number(row[columnIndex]), 0);
    });

    // Add the "Personal Asignado" table with totals
    doc.autoTable({
      startY: y,
      head: [personalTableHeaders],
      body: personalTableData,
      margin: { top: margin },
      foot: [[...personalTotals]],
      didDrawPage: function (data) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, pageHeight - 10);
      },
    });

    // Adjust the y position after adding the "Personal Asignado" table
    y = doc.autoTable.previous.finalY + margin;
  }

  // Regular line items section
  // Set font size and style for the regular table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');

  // Add the regular table title
  doc.text('Other Line Items', margin, y);
  y += 10;

  // Table headers for regular line items
  const regularTableHeaders = [
    'Project Planning Name',
    'Resource Type',
    'Actual Unitary Cost',
    'Estimated Unitary Cost',
    'Actual Total Cost',
    'Estimated Total Cost',
    'Count of Resources',
    'Total Cost Variance',
    'Unitary Cost Variance',
  ];

  // Table data for regular line items
  const regularTableData = linesData
    .filter((line) => line.resourceType !== 'Personal')
    .map((line) => [
      line.projectPlanningName,
      line.resourceType,
      line.actualUnitaryCost,
      line.estimatedUnitaryCost,
      line.actualTotalCost,
      line.estimatedTotalCost,
      line.countOfResources,
      line.totalCostVariance,
      line.unitaryCostVariance,
    ]);

  // Set font size and style for the regular table body
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Calculate the totals for each column
  const regularTotals = regularTableHeaders.map((header, columnIndex) => {
    if (columnIndex === 0) return 'Total'; // Placeholder for the first column
    return regularTableData.reduce((total, row) => total + Number(row[columnIndex]), 0);
  });

  // Add the regular table with totals
  doc.autoTable({
    startY: y,
    head: [regularTableHeaders],
    body: regularTableData,
    margin: { top: margin },
    foot: [[...regularTotals]],
    didDrawPage: function (data) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, pageHeight - 10);
    },
  });

  // Adjust the y position after adding the regular table
  y = doc.autoTable.previous.finalY + margin;

  // Check if the remaining content can fit within the page height
  if (y + 20 >= pageHeight - margin) {
    doc.addPage(); // Add a new page if the content exceeds the page height
    y = margin;
  }

  doc.save('project_budget_report.pdf');
};



function ProjectDashboards () {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    setProjects,
    users,
    setUsers,
    userInSession,
    setSelectedProjectId,
    showNotification,
    report,
    setReport,
    reports,
    setReports,
    detailReports,
    setDetailReports
  } = useGlobalContext();
  
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  
 

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      const { response: userResponse } = await getAllUsers();
      const {
        response: projectResponse,
        success,
        error,
        notificationType,
      } = await getAllProjects();

      if (userResponse?.users) {
        setUsers(userResponse.users);
      }

      if (projectResponse?.projects) {
        setProjects(projectResponse.projects);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchProjectsAndUsers();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetailReport(id);
        setDetailReports(response.response.report);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (report !== null) {
  //     console.log("DATOSReporte", id);
  //   } else {
  //     console.log("EXISTE");
  //   }
  // }, [report]);


 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastReport(id);
        setReport(response.response.reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (report !== null) {
  //     console.log("PROJECTIDSSSS", reports);
  //   } else {
  //     console.log("EXISTE");
  //   }
  // }, [report]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllReports(id);
        setReports(response.response.reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    generateProjectBudgetReport(report,detailReports);
  };



  return (
    <div className="min-h-screen bg-white flex  justify-center">
      <button onClick={handleDownload}>
      Download PDF
    </button>
      <div className="container mx-auto px-4 py-6 mt-5">
      <Navbar />
      <div className="flex flex-col gap-4 mt-8">
        <DashboardStateGrid />
        
        <div className="flex flex-row gap-2 w-full">
        <LineChart />
          
        </div>

        <ResourcesChart/>
        
      </div>
    
      </div></div>
  );
};

export default ProjectDashboards;
