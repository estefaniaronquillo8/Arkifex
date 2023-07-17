import { FaTasks } from "react-icons/fa";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { SiBitcoincash, SiCashapp } from "react-icons/si";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import PlanningsChart from "./planningsChart";
import LineChart from "./LineChart"; 

function DashboardStateGrid() {
  const { report, setReport, showNotification, project } = useGlobalContext();
 

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full">
  <BoxWrapper className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4">
    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500">
      <SiBitcoincash className="text-2xl text-white" />
    </div>
    <div className="pl-4">
      <span className="text-xl text-blue-500 font-bold">Presupuesto</span>
      <div className="flex items-center">
        <strong className="text-xl text-gray-700 font-semibold">
          {report ? (
            <ul>
              <strong className="text-lg text-green-500 font-semibold">
                <ul className="text-lg font-semibold">
                  Estimado: {report.estimatedBudget}
                </ul>
              </strong>
              <span
                className={`text-xl ${
                  report.actualBudget > report.estimatedBudget
                    ? "text-red-500"
                    : "text-gray-700"
                } font-semibold`}
              >
                <ul className="text-lg font-semibold">
                  Actual: {report.actualBudget}
                </ul>
              </span>
            </ul>
          ) : (
            <p>No data available.</p>
          )}
        </strong>
      </div>
    </div>
  </BoxWrapper>
  <BoxWrapper className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4">
    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500">
      <SiCashapp className="text-2xl text-white" />
    </div>
    <div className="pl-4">
      <span className="text-xl text-blue-500 font-bold">Restante</span>
      <div className="flex items-center">
        {report ? (
          <strong
            className={`text-xl font-semibold ${
              report.budgetVariance > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Presupuesto Restante: {report.budgetVariance}
          </strong>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  </BoxWrapper>
  <BoxWrapper className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4">
    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-500">
      <FaTasks className="text-2xl text-white" />
    </div>
    <div className="pl-4">
      <span className="text-lg text-blue-500 font-bold">Tareas en proyecto</span>
      <div className="flex items-center">
        <strong className="text-xl text-gray-700 font-semibold">
          {report ? (
            <ul>
              <ul>
                <strong className="text-xl text-gray-700 font-semibold">
                  <ul>Total: {report.numberOfTasks}</ul>
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

      </div>
    </>
  );
}

export default DashboardStateGrid;

function BoxWrapper({ children }) {
  return (
    <div
      className="bg-gray-100 rounded-xl p-4 flex-1 border border-gray-300 flex items-center"
      style={{ boxShadow: "0 8px 4px rgba(0, 0.2, 1, 0.5)" }}
    >
      {children}
    </div>
  );
}
