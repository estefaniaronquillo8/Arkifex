import React from 'react'
import { IoBagHandle } from "react-icons/io5";

function DashboardStateGrid(){
    return(

    <div className="flex gap-4 w-full">
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white'/>
        </div>
        <div className='pl-4 '>
          <span className='text-sm text-gray-500 font-light'>Materiales Utilizados</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>Total: 45</strong>
         
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
      <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-500'>
          <IoBagHandle className='text-2xl text-white'/>
        </div>
        <div className='pl-4 '>
          <span className='text-sm text-gray-500 font-light'>Personal Ocupado</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>Total: 20</strong>
         
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
      <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500'>
          <IoBagHandle className='text-2xl text-white'/>
        </div>
        <div className='pl-4 '>
          <span className='text-sm text-gray-500 font-light'>Subproyectos</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>Total: 2</strong>
         
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
      <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
          <IoBagHandle className='text-2xl text-white'/>
        </div>
        <div className='pl-4 '>
          <span className='text-sm text-gray-500 font-light'>Tareas Asignadas</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>Total: 80</strong>
         
          </div>
        </div>
      </BoxWrapper>
    </div>
    )
}

export default DashboardStateGrid

function BoxWrapper({children}){
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-300 flex items-center">{children}</div>
}