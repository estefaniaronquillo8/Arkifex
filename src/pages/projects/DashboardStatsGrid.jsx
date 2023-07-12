import { FaTasks } from "react-icons/fa";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { SiBitcoincash, SiCashapp } from "react-icons/si";
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
import LineChart from "./LineChart";

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
    <>
      <div className="flex gap-4 w-full">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500">
            <SiBitcoincash className="text-2xl text-white" />
          </div>

          <div className="pl-4 ">
            <span className="text-xl text-blue-500 font-bold">Presupuesto</span>

            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                {report ? (
                  <ul>
                    <strong className="text-lg text-green-500 font-semibold">
                      <ul className="text-lg font-semibold">Estimado</ul>
                      {report.estimatedBudget}
                    </strong>
                    <span
                      className={`text-xl ${
                        report.actualBudget > report.estimatedBudget
                          ? "text-red-500"
                          : "text-gray-700"
                      } font-semibold`}
                    >
                      <ul className="text-lg font-semibold">Actual</ul>
                      {report.actualBudget}
                    </span>
                  </ul>
                ) : (
                  <p>No data available.</p>
                )}
              </strong>
            </div>
          </div>
        </BoxWrapper>

        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500">
            <SiCashapp className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-xl text-blue-500 font-bold">Restante</span>
            <div className="flex items-center">
              <strong
                className={`text-xl font-semibold ${
                  report && report.budgetVariance < 0
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
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

        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-500">
            <FaTasks className="text-2xl text-white" />
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
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <BsFillCalendar2WeekFill className="text-2xl text-white" />
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

      <div className="mt-2 flex gap-4 w-full">
        <LineChart />

        <PlanningsChart />

        <BudgetChart />
      </div>
    </>
  );
}

export default DashboardStateGrid;

function BoxWrapper({ children }) {
  return (
    <div
      className="bg-gray-100 rounded-xl p-4 flex-1 border border-gray-300 flex items-center"
      style={{ boxShadow: '0 8px 4px rgba(0, 0.2, 1, 0.5)' }}
    >
      {children}
    </div>
  );
}