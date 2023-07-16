// src/pages/projects.js
import React, {useEffect, useState, useRef} from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/project.api.routes";
import { getAllUsers } from "../../services/user.api.routes";
import {
  getLastReport,
  getAllReports,
  getDetailReport,
} from "../../services/report.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import DashboardStateGrid from "./DashboardStatsGrid";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from "/src/assets/logo.png";
import Swal from "sweetalert2";


function TemplateDashboards() {
  const { id } = useParams();
  const graphPageRef = useRef(null);
  const navigate = useNavigate();
  const {
    projects,
    project,
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
    setDetailReports,
  } = useGlobalContext();

  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();

  useEffect(() => {
    //console.log(report?.id)
    //if(report?.actualBudget === 0) navigate("/projects");
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
        console.log("DETAILGET",response.response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastReport(id);
        setReport(response.response.reportData);
        //console.log('REPUESTAAAAAAAAA',response.response.reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (report !== null) {
      console.log("PROJECTIDSSSS", detailReports);
    } else {
      console.log("EXISTE");
    }
  }, [detailReports]);

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

  useEffect(() => {
    const generateProjectBudgetReport = (reportData, linesData) => {
      const graphPageContainer = graphPageRef.current;
      const doc = new jsPDF();
      const logoWidth = 40; // Ancho del logo en puntos (ajusta según tus necesidades)
      const logoHeight = 20; // Alto del logo en puntos (ajusta según tus necesidades)
      const margin = 25;
      const marginl = 10;
      const marginq = 1; // Mover la declaración de la variable 'margin' antes de su uso
      //const logoX = doc.internal.pageSize.getWidth() - logoWidth - marginq;
      const logoX = marginq; // Posic // Posición horizontal del logo
      const logoY = marginq; // Posición vertical del logo
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = margin;

      doc.setDrawColor(0, 0, 0); // Establecer el color de la línea a negro (RGB)
      doc.setLineWidth(0.8); // Establecer el ancho de la línea a 0.5 puntos
      doc.line(marginl, marginl, pageWidth - marginl, marginl); // Línea horizontal en el margen superior

      // Agregar línea de margen inferior
      doc.line(
        marginl,
        pageHeight - marginl,
        pageWidth - marginl,
        pageHeight - marginl
      ); // Línea horizontal en el margen inferior

      // Agregar línea de margen izquierdo
      doc.line(marginl, marginl, marginl, pageHeight - marginl); // Línea vertical en el margen izquierdo

      // Agregar línea de margen derecho
      doc.line(
        pageWidth - marginl,
        marginl,
        pageWidth - marginl,
        pageHeight - marginl
      ); // Línea vertical en el margen derecho Dibujar línea horizontal en el margen inferior

      // Set font size and style for the report title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(8, 4, 87); // Define el color del texto en rojo RGB
     doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
      // Calculate the width of the title
      const title = "Reporte Detallado del Proyecto";
      const titleWidth = doc.getTextWidth(title);

      // Calculate the x-position to center the title
      const titleX = (pageWidth - titleWidth) / 2;

      // Add the report title
      doc.text(title, titleX, y);
      y += 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Define el color del texto en rojo RGB

      const dateTime = new Date(reportData.date); // Replace this with your datetime value
      const reportDate = dateTime.toLocaleDateString();

      // Calculate the width of the title
      const date = `Fecha: ${reportDate}`;
      const dateWidth = doc.getTextWidth(date);

      // Calculate the x-position to center the title
      const dateX = (pageWidth - dateWidth) / 2;

      // Add the report title
      doc.text(date, dateX, y);
      y += 10;

      // Add the user who generated the report
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const user = `Generado por: ${userInSession.name} ${userInSession.lastname}`;
      const userWidth = doc.getTextWidth(user);

      // Calculate the x-position to center the user info
      const userX = (pageWidth - userWidth) / 2;

      // Add the user info to the report
      doc.text(user, userX, y);
      y += 15;

      // Set font size and style for the section headers
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");

      // Project details section
      doc.text(`Proyecto  ${report.projectName}`, margin, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      // doc.text(`Project ID: ${reportData.id}`, margin+5, y);
      // y += 10;

      // Budget details section
      doc.text("Resumen del presupuesto", margin, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const descriptionGeneral = `El proyecto actualmente tiene un presupuesto estimado de $${reportData.estimatedBudget} USD, que se calcula mediante el valor de mercado de los recursos y personal utilizado por cada tarea en el proyecto. Por otro lado el presupeusto actual, que se calcula mediante el calculo de costos por tarea se encuentra en los $${reportData.actualBudget} `;

      // Dividir la descripción en palabras
      const wordsGeneral = descriptionGeneral.split(" ");
      const maxWidthGeneral = pageWidth - 2 * margin; // Ancho máximo del texto

      let line = "";
      let lines = [];

      // Construir las líneas del texto con saltos de línea automáticos
      for (let i = 0; i < wordsGeneral.length; i++) {
        const word = wordsGeneral[i];
        const newLine = line === "" ? word : line + " " + word;

        if (doc.getTextWidth(newLine) <= maxWidthGeneral) {
          line = newLine;
        } else {
          lines.push(line);
          line = word;
        }

        if (i === wordsGeneral.length - 1) {
          lines.push(line);
        }
      }

      // Agregar las líneas del texto al PDF
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], margin, y);
        y += 7;
      }
      y += 10;

      const reportDataLabel1 = "Presupuesto Actual:";
      const reportDataValue1 = `$${reportData.actualBudget}`;

      const reportDataLabel2 = "Presupuesto Estimado:";
      const reportDataValue2 = `$${reportData.estimatedBudget}`;

      const reportDataLabel3 = "Presupuesto Restante:";
      const reportDataValue3 = `$${
        reportData.estimatedBudget - reportData.actualBudget
      }`;

      const labelWidth1 =
        doc.getStringUnitWidth(reportDataLabel1) * doc.internal.getFontSize();
      const valueWidth1 =
        doc.getStringUnitWidth(reportDataValue1) * doc.internal.getFontSize();

      const labelWidth2 =
        doc.getStringUnitWidth(reportDataLabel2) * doc.internal.getFontSize();
      const valueWidth2 =
        doc.getStringUnitWidth(reportDataValue2) * doc.internal.getFontSize();

      const labelWidth3 =
        doc.getStringUnitWidth(reportDataLabel3) * doc.internal.getFontSize();
      const valueWidth3 =
        doc.getStringUnitWidth(reportDataValue3) * doc.internal.getFontSize();

      const maxWidth = Math.max(
        labelWidth1,
        valueWidth1,
        labelWidth2,
        valueWidth2,
        labelWidth3,
        valueWidth3
      );

      doc.text(reportDataLabel1, margin + 15, y);
      doc.text(reportDataValue1, margin + maxWidth, y);
      y += 7;

      doc.text(reportDataLabel2, margin + 15, y);
      doc.text(reportDataValue2, margin + maxWidth, y);
      y += 7;

      doc.line(margin + 15, y, 2 * margin - 5 + maxWidth, y);

      y += 10;

      doc.text(reportDataLabel3, margin + 15, y);

      // Verifica si reportDataValue3 es negativo
      if (reportData.estimatedBudget - reportData.actualBudget < 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 0, 0); // Define el color del texto en rojo RGB
      } else {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 0); // Define el color del texto en verde RGB
      }

      doc.text(reportDataValue3, margin + maxWidth, y);
      doc.setTextColor(0, 0, 0); // Vuelve a establecer el color del texto a negro para el resto del documento
      doc.setFont("helvetica", "normal");

      y += 15;

      // Descripción de reportDataValue3
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const reportDataValue3Description =
        reportData.estimatedBudget - reportData.actualBudget < 0
          ? `Como se puede observar, la diferencia que existe entre el presupuesto estimado del proyecto y el presupuesto actual del mismo es de un valor negativo siendo ${reportDataValue3}, por lo que esté valor se sobresale de lo que se pensó desde un inicio que iba a valer el proyecto en su totalidad. Siendo una pérdida.`
          : `Como se puede observar, la diferencia que existe entre el presupuesto estimado del proyecto y el presupuesto actual del mismo es de un valor positivo siendo ${reportDataValue3}, por lo que este valor es un ahorro en comparación a lo que se creía que se iba a pagar del proyecto en su totalidad. Siendo una ganancia`;

      // Dividir la descripción en palabras
      const wordsReportDataValue3Description =
        reportDataValue3Description.split(" ");
      const maxWidthReportDataValue3Description = pageWidth - 2 * margin; // Ancho máximo del texto

      line = "";
      lines = [];

      // Construir las líneas del texto con saltos de línea automáticos
      for (let i = 0; i < wordsReportDataValue3Description.length; i++) {
        const word = wordsReportDataValue3Description[i];
        const newLine = line === "" ? word : line + " " + word;

        if (doc.getTextWidth(newLine) <= maxWidthReportDataValue3Description) {
          line = newLine;
        } else {
          lines.push(line);
          line = word;
        }

        if (i === wordsReportDataValue3Description.length - 1) {
          lines.push(line);
        }
      }

      // Agregar las líneas del texto al PDF
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], margin, y);
        y += 7;
      }
      y += 10;

      // Line items section
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de Presupuesto por Tareas", margin, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const description =
        "A continuación se muestra información detallada sobre diferentes tipos de recursos y persona asignado por cada tarea en el proyecto, incluyendo su costo unitario, costo total, cantidad y diferencias entre los valores reales y estimados. Proporciona una visión general de los recursos utilizados y sus características financieras en el proyecto.";

      // Dividir la descripción en palabras
      const words = description.split(" ");
      const maxWidthD = pageWidth - 2 * margin; // Ancho máximo del texto

      line = "";
      lines = [];

      // Construir las líneas del texto con saltos de línea automáticos
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const newLine = line === "" ? word : line + " " + word;

        if (doc.getTextWidth(newLine) <= maxWidthD) {
          line = newLine;
        } else {
          lines.push(line);
          line = word;
        }

        if (i === words.length - 1) {
          lines.push(line);
        }
      }

      // Agregar las líneas del texto al PDF
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], margin, y);
        y += 7;
      }
      y += 10;

      // Group the linesData by project planning name
      const lineItemsByPlanning = linesData.reduce((acc, line) => {
        if (!acc[line.projectPlanningName]) {
          acc[line.projectPlanningName] = [];
        }
        acc[line.projectPlanningName].push(line);
        return acc;
      }, {});

      // Loop through each project planning group
      Object.entries(lineItemsByPlanning).forEach(
        ([planningName, lineItems]) => {
          // Set font size and style for the table title
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");

          // Add the table title with the project planning name
          doc.text(`Tarea: ${planningName}`, margin + 10, y);
          //doc.text(planningName, margin, y);
          y += 10;

          // Filter the line items for the current project planning name
          const personalLinesData = lineItems.filter(
            (line) => line.resourceType === "Personal"
          );

          if (personalLinesData.length > 0) {
            // Set font size and style for the "Personal Asignado" table
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            // Add the table title "Personal Asignado"
            doc.text("Personal Asignado", margin + 15, y);
            y += 10;

            // Table headers for "Personal Asignado"
            const personalTableHeaders = [
              "Nombre",
              "Costo Actual por hora",
              "Costo Estimado por hora",
              "Costo Total",
              "Costo Total Estimado",
              "Variacion con Total Estimado",
              "Variacion con Costo Unitario Estimado",
            ];

            // Table data for "Personal Asignado"
            const personalTableData = personalLinesData.map((line) => [
              line.resourceName,
              line.actualUnitaryCost,
              line.estimatedUnitaryCost,
              line.actualTotalCost,
              line.estimatedTotalCost,
              line.totalCostVariance,
              line.unitaryCostVariance,
            ]);

            // Set font size and style for the "Personal Asignado" table body
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            // Calculate the totals for each column
            const personalTotals = personalTableHeaders.map(
              (header, columnIndex) => {
                if (columnIndex === 0) return "Total"; // Placeholder for the first column
                return personalTableData.reduce(
                  (total, row) => total + Number(row[columnIndex]),
                  0
                );
              }
            );

            // Add the "Personal Asignado" table with totals
            doc.autoTable({
              startY: y,
              head: [personalTableHeaders],
              body: personalTableData,
              margin: { top: margin },
              foot: [[...personalTotals]],
              didDrawPage: function (data) {
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(
                  `Page ${data.pageNumber}`,
                  data.settings.margin.left,
                  pageHeight - 10
                );
              },
            });

            // Adjust the y position after adding the "Personal Asignado" table
            y = doc.autoTable.previous.finalY + margin;

            const personalTotalsDescription = `
              - Costo Total:                           ${personalTotals[3]}
              - Costo Total Estimado:                  ${personalTotals[4]}
              - Variación con Total Estimado:          ${personalTotals[5]}
              - Variación con Costo Unitario Estimado: ${personalTotals[6]}`;

            y += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(
              "Resumen de resultados de personal: ",
              margin + 25,
              doc.autoTable.previous.finalY + margin + 10
            );
            y += 5;

            doc.setFontSize(10);
            doc.text(
              personalTotalsDescription,
              margin + 30,
              doc.autoTable.previous.finalY + margin + 10
            );

            y += 20;
          }
          // Regular line items section
          // Set font size and style for the regular table
          y += 20;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");

          // Add the regular table title
          doc.text("Recursos Asignados", margin + 15, y);
          y += 10;

          // Table headers for regular line items
          const regularTableHeaders = [
            "Tipo de Recurso",
            "Nombre de Recurso",
            "Costo Unitario",
            "Costo Unitario Estimado",
            "Count of Resources",
            "Costo Total",
            "Costo Total Estimado",
            "Diferencia con Total Estimado",
            "Diferencia con Costo Unitario Estimado",
          ];

          // Table data for regular line items
          const regularTableData = lineItems
            .filter((line) => line.resourceType !== "Personal")
            .map((line) => [
              line.resourceType,
              line.resourceName,
              line.actualUnitaryCost,
              line.estimatedUnitaryCost,
              line.countOfResources,
              line.actualTotalCost,
              line.estimatedTotalCost,
              line.totalCostVariance,
              line.unitaryCostVariance,
            ]);

          // Set font size and style for the regular table body
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");

          // Calculate the totals for each column
          const regularTotals = regularTableHeaders.map(
            (header, columnIndex) => {
              if (columnIndex === 0) return "Total"; // Placeholder for the first column
              return regularTableData.reduce(
                (total, row) => total + Number(row[columnIndex]),
                0
              );
            }
          );

          // Add a description of the totals
          

          // Add the regular table with totals
          doc.autoTable({
            startY: y,
            head: [regularTableHeaders],
            body: regularTableData,
            margin: { top: margin },
            foot: [[...regularTotals]],
            didDrawPage: function (data) {
              doc.setFontSize(12);
              doc.setFont("helvetica", "bold");
              doc.text(
                `Page ${data.pageNumber}`,
                data.settings.margin.left,
                pageHeight - 10
              );
            },
          });

          // Adjust the y position after adding the regular table
          y = doc.autoTable.previous.finalY + margin;

          const regularTotalsDescription = `
            - Costo Total:                            ${regularTotals[5]}
            - Costo Total Estimado:                   ${regularTotals[6]}
            - Diferencia con Total Estimado:          ${regularTotals[7]}
            - Diferencia con Costo Unitario Estimado: ${regularTotals[8]}`;

          y += 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(
            "Resumen de resultados de materiales: ",
            margin + 25,
            doc.autoTable.previous.finalY + margin + 10
          );
          y += 10;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");

          // Add the description after the table
          doc.text(
            regularTotalsDescription,
            margin + 15,
            doc.autoTable.previous.finalY + margin + 10
          );

          y+=25;


          

          // Set font size and style for the description
          

          // Check if the remaining content can fit within the page height
          if (y + 20 >= pageHeight - margin) {
            doc.addPage(); // Add a new page if the content exceeds the page height
            y = margin;
          }
        }
      );

      y = margin;

      html2canvas(graphPageRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");

        // Calculate the aspect ratio of the PDF page based on the canvas dimensions
        const imgWidth = pageHeight - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const xOffset = margin;
        const yOffset = (pageWidth - imgHeight) / 2;

        // Add the image to the PDF
        doc.addPage([pageWidth, pageHeight], "landscape");
        doc.setFontSize(20);
        const titleWidth =
          (doc.getStringUnitWidth("Dasboard Proyecto") *
            doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const titleX = (pageHeight - titleWidth) / 2;
        const titleY = margin;
        doc.text("Dasboard Proyecto", titleX, titleY);
        doc.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);

        // Save the PDF
        doc.save("project_budget_report.pdf");
      });

      //doc.save('project_budget_report.pdf');
    };

    const handleDownload = () => {
      generateProjectBudgetReport(report, detailReports);
    };

    const button = document.getElementById("generate-report-button");
    button.addEventListener("click", handleDownload);

    // Cleanup function
    return () => {
      // Remove event listener
      button.removeEventListener("click", handleDownload);
    };
  }, [report, detailReports]);

  // const handleDownload = () => {
  //   generateProjectBudgetReport(report, detailReports);
  // };
  return (
    <div className="min-h-full bg-[#eaf0f0] flex justify-center">
      <div className="container mx-auto px-4 py-6 mt-5">
        <Navbar />
        <div className="mt-6 flex justify-center">
          <button
            id="generate-report-button"
            className="btn-custom btn-primary"
            onClick={() => {
              let timerInterval;
              Swal.fire({
                title: "Estamos generando tu reporte...",
                html: "Se cierra <b></b> milliseconds.",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                  const b = Swal.getHtmlContainer().querySelector("b");
                  timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft();
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                },
              }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                  console.log("I was closed by the timer");
                }
              });
            }}
          >
            Genera tu reporte
          </button>
        </div>
        <div ref={graphPageRef} className="flex flex-col gap-4 mt-2">
          <DashboardStateGrid />
        </div>
      </div>
    </div>
  );
}

export default TemplateDashboards;
