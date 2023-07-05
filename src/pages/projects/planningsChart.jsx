import React, { useState,useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {getAllReports,getLastReport, createReport} from  "../../services/report.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";




function PlanningsChart() {
    const { report, setReport, showNotification } = useGlobalContext();
  const [data,getData] = useState([]);
  //const [Yaxis,getYaxis] = useState([]);

  const handleData = ()=>{
    const NewData = report.map((report)=>{
      return{
        name: report.date,
        uv: report.actualBudget,
        pv: report.estimatedBudget,
        amt: 2100,
      }
    });
    console.log('VALUES',NewData);
    getData(NewData);

  }


  //const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastReport(1);
        setReport(response.response.reportData);
        handleData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (report !== null) {
      console.log("DATOSBAR", report);
    } else {
      console.log("EXISTE");
    }
  }, [report]);

  return (
    <div className="w-[20rem] h-[22rem]  bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">Indicador</strong>
      <div className="w-full mt-3 flex-1 text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="pv" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PlanningsChart;     
