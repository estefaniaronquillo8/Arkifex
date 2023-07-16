import React, { useState,useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobalContext } from "../../contexts/GlobalContext";

function ResourcesChart() {

  const { reports } = useGlobalContext();
  const [data,getData] = useState();
  //const [Yaxis,getYaxis] = useState([]);

  const handleData = () => {
    const NewData = reports.map((report)=>{
      return{
        name: report.date,
        Presupuesto_Actual: report.actualBudget,
        Presupuesto_Estimado: report.estimatedBudget,
        amt: 2100,
      }
    });
    //console.log('VALUES', NewData);
    getData(NewData);

  }

  useEffect(() => {
    handleData();
  }, [reports]);


  

  

    return (
      <div className="w-[30rem] h-[22rem]  bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col">
            <strong className="text-gray-700 font-medium">Cambio en el presupuesto</strong>
            <div className="w-full mt-3 flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%"> 
            <LineChart 
            width={500} 
            height={300} 
            data={data}>
                <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
          <Line type="monotone" dataKey="Presupuesto_Actual" stroke="#ff0000" strokeWidth={2} />
          <Line type="monotone" dataKey="Presupuesto_Estimado" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
        </ResponsiveContainer>  
            </div>
        </div>
    );
}

export default ResourcesChart;
