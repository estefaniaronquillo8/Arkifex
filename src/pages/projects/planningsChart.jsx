import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getAllReports,
  getLastReport,
  createReport,
} from "../../services/report.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";

function PlanningsChart() {
  const { report } = useGlobalContext();
  const [data, setData] = useState([]);

  const handleData = () => {
    if (
      report &&
      report.date &&
      report.actualBudget &&
      report.estimatedBudget
    ) {
      const newData = {
        name: report.date,
        PresupuestoActual: report.actualBudget,
        PresupuestoEstimado: report.estimatedBudget,
        amt: 2100,
      };
      setData([newData]);
      //console.log('VALUES planningChart', newData);
    } else {
      setData([]);
      //console.log('No hay datos disponibles');
    }
  };

  useEffect(() => {
    handleData();
  }, [report]);

  return (
    <div className="w-[20rem] h-[22rem]  bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">Indicador</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="PresupuestoActual" fill="#8884d8" />
              <Bar
                yAxisId="right"
                dataKey="PresupuestoEstimado"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
}

export default PlanningsChart;
