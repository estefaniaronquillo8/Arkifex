import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    {
        name: 'Pino',
        description: 'pino de arbol',
        costs: 40.23
    },
    {
        name: 'Madera',
        description: 'madera de roble',
        costs: 80.23
    },
    {
        name: 'Ripio',
        description: 'Ripio gravilla',
        costs: 120.23
    },
    {
        name: 'Cemento',
        description: 'cemento SELVA',
        costs: 70.23
    },
    {
        name: 'Arena',
        description: 'arena para mescla',
        costs: 10.23
    }
]

function ResourcesChart() {
    return (
        <div className="h-[22rem] bg-gray-100 p-4 rounded-3xl border border-gray-200 flex flex-col flex-1">
            <strong className="text-gray-700 font-medium">Recursos</strong>
            <div className="w-full mt-3 flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 10,
                            left: -10,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="description" fill="#8ea5e9" />
                        <Bar dataKey="costs" fill="#ea588c" />
                    </BarChart>
                    </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ResourcesChart;
