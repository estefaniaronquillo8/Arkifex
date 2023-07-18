import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllReports,
  getLastReport,
  createReport,
} from "../../services/report.api.routes";
import Swal from "sweetalert2";

function BudgetChart() {
  const { report, setReport, showNotification, project } = useGlobalContext();
  const [value, setValue] = useState(50);

  const data = [
    { name: "Manejable (0%-33.3%)", value: 33.33, color: "#00ff00" },
    { name: "Advertencia (33.3%-66.6%)", value: 33.33, color: "#FDA400" },
    { name: "En Riesgo (66.6% +)", value: 33.33, color: "#ff0000" },
  ];

  const RADIAN = Math.PI / 180;
  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    const total = 100;
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 20;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="#none"
        fill={color}
      />,
    ];
  };

  if (!report) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Tu Dashboard se encuentra un poco vacío, asigna recursos y crea nuevas tareas. ¡SUERTE!",
    });

    return (
      <div>
        <h1 className=" mt-auto problems">
          Parace que tu DASHBOARD se encuentra un poco vacío, Asigna recursos y
          Crea Tareas a tu proyecto existente. ¡Suerte!
        </h1>
      </div>
    );
  }
  return (
    <div className="w-[20rem] h-[22rem]  bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">
        Porcentaje de Tareas atrasadas
      </strong>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={500}>
            <Legend />
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              fill="#8884d8"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {needle(
              report.latePlanningRatio * 100,
              data,
              cx,
              cy,
              iR,
              oR,
              "#0000ff"
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BudgetChart;
