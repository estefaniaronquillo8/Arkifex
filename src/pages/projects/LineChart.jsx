import React, { useState,useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {getAllReports,getLastReport, createReport} from  "../../services/report.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";


const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

function ResourcesChart() {

  const { reports, setReports, showNotification } = useGlobalContext();
  const [data,getData] = useState([]);
  //const [Yaxis,getYaxis] = useState([]);

  const handleData = ()=>{
    const NewData = reports.map((report)=>{
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
        const response = await getAllReports(1);
        setReports(response.response.reportData);
        handleData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (reports !== null) {
      console.log("DATOSLINEA", reports);
    } else {
      console.log("EXISTE");
    }
  }, [reports]);

  

    return (
        <div className="h-[22rem] bg-white p-4 rounded-sm border-gray-200 flex flex-col flex-1">
            <strong className="text-gray-700 font-medium">Cambio en el presupuesto</strong>
            <div className="w-full mt-3 flex-1 text-xs">
              
            <LineChart 
            width={800} 
            height={400} 
            data={data}>
                <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
          <Line type="monotone" dataKey="pv" stroke="#ff0000" strokeWidth={2} />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
                
            </div>
        </div>
    );
}

export default ResourcesChart;
