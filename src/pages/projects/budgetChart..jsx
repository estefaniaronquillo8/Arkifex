import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useGlobalContext } from "../../contexts/GlobalContext";
import {
  getAllReports,
  getLastReport,
  createReport,
} from "../../services/report.api.routes";



function BudgetChart() {
    const { report, setReport, showNotification, project } = useGlobalContext();
  //const [data, setData] = useState([]);
  const [value, setValue] = useState(50);

  const data = [
    { name: 'OverBudget', value: 33.33, color: '#00ff00' },//'#ff0000' 
    { name: 'OnTarget', value: 33.33, color: '#FFFF00' },//'#00ff00'
    { name: 'OverTarget', value: 33.33, color: '#ff0000' },//'#0000ff'
  ];

    const RADIAN = Math.PI / 180;
    const cx = 150;
    const cy = 200;
    const iR = 50;
    const oR = 100;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    const total = 200;
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

  

  useEffect(() => {
    // Simulating API call

    setTimeout(() => {
      setValue(75);
    }, 2000);
  }, []);

  return (
    <div className="w-[20rem] h-[22rem]  bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">Tareas atrasadas</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={500}>
            <Legend/>
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
            {needle(((report.estimatedBudget/report.actualBudget)*200),data, cx, cy, iR, oR, '#0000ff')}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BudgetChart;     
