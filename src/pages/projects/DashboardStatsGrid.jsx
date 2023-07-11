import { IoBagHandle } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllReports,
  getLastReport,
  createReport,
} from "../../services/report.api.routes";
//import { getReports } from "../../../arkifex-backend/src/repositories/reportRepository";
import BudgetChart from "./budgetChart.";
import PlanningsChart from "./planningsChart";
import { useParams } from "react-router-dom";
function DashboardStateGrid() {
  const { report, setReport, showNotification, project } = useGlobalContext();
  //const {id} = useParams;
  //const [data, setData] = useState();

  /* useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastReport(id);
        setReport(response.response.reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); */

  // useEffect(() => {
  //   if (report !== null) {
  //     console.log("DATOSGRAPH", report);
  //   } else {
  //     console.log("EXISTE");
  //   }
  // }, [report]);

  return (
    <div>
      <div className="flex gap-4 w-full">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4 ">
            <span className="text-sm text-gray-500 font-light">
              Presupuesto
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                {report ? (
                  <ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Estimado</ul>
                        {report.estimatedBudget}
                      </strong>
                    </ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Actual</ul>
                        {report.actualBudget}
                      </strong>
                    </ul>
                    
                  </ul>
                ) : (
                  <p>No data available.</p>
                )}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <PlanningsChart />
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4 ">
            <span className="text-sm text-gray-500 font-light">
              Restante
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                {report ? (
                  <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Presupuesto Restante</ul>
                        {-report.budgetVariance}
                      </strong>
                    </ul>
                ) : (
                  <p>No data available.</p>
                )}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        
      </div>
      
      <div className="flex gap-4 w-full">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4 ">
            <span className="text-sm text-gray-500 font-light">
              Tareas en proyecto
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                {report ? (
                  <ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Total</ul>
                        {report.numberOfTasks}
                      </strong>
                    </ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Completadas</ul>
                        {report.taskCompleted}
                      </strong>
                    </ul>
                  </ul>
                ) : (
                  <p>No data available.</p>
                )}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <BudgetChart />
        </BoxWrapper>

        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4 ">
            <span className="text-sm text-gray-500 font-light">
              Tareas en proyecto
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                {report ? (
                  <ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Terminadas</ul>
                        {report.taskCompleted}
                      </strong>
                    </ul>
                    <ul>
                      <strong className="text-xl text-gray-700 font-semibold">
                        <ul>Dias atrasados</ul>
                        {report.timeVariance}
                      </strong>
                    </ul>
                  </ul>
                ) : (
                  <p>No data available.</p>
                )}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        
      </div>
    </div>
  );
}

export default DashboardStateGrid;

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-sm p-4 flex-1 border border-gray-300 flex items-center">
      {children}
    </div>
  );
}
