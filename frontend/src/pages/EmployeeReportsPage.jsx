import BaseLayout from '../layouts/BaseLayout';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import {BarChart3} from 'lucide-react';

function EmployeeSelector({
    employeesList,
    currentEmployee,
    onToggleEmployee,
    month,
    year
}) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full border border-slate-700'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-bold text-slate-200'>Employees</h3>
        </div>
        <div className='space-y-2 max-h-96 overflow-y-auto mb-6'>
          {employeesList.map(emp => {
            const isSelected = emp.id === currentEmployee.id;
            return (
              <button
                onClick={() => onToggleEmployee(emp, month, year)}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>{emp.name}</span>
                  {isSelected && <Check size={20}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmployeeReportsPage({
    onPageChange,
    isLoading,
    setLoading
}) {
    return (
        <BaseLayout 
            showSidebar={false}
            currentPage={10}
            onPageChange={onPageChange}
        >
            <Header title={"Employees Reports"} icon={BarChart3} >
                    <div className='flex items-center gap-4 ml-8 '>
                        {"< month >    < year >"}
                    </div>
            </Header>
            <div className='flex gap-8 p-8'>
                <div className=' w-1/6'>
                    <div className=' mb-4 font-bold text-lg'>
                        Employees
                    </div>

                    {/* Para cada funcionário fazer um botão para seleção do relatório do funcionário atual*/}
                    <div className=' mb-2 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer'>
                        Employee X
                    </div>
                </div>

                <div className=''>

                    <div className='flex gap-4 flex-wrap'>
                        {/* Aqui dentro colocar as quatro estatísticas de dados interassantes em formas de cards: 
                        Número de folgas no mês, dias trabalhados no mês, 
                        números de turnos de manhã, 
                        números de turnos da tarde
                         */}
                    </div>

                    <div className='mt-8'>
                        <div className='mb-4'>
                            Uma toolbar para seleção do do dado a ser exibido no gráfico
                        </div>
                        <div className=''>
                            Gráfico de barras mostrando os dias trablahados no mês ||
                            Folgas no mês ||
                            Turnos da manha no mês ||
                            Turnos da tarde no mês
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    )
}

export default EmployeeReportsPage;