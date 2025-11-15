import BaseLayout from '../layouts/BaseLayout';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import {BarChart3} from 'lucide-react';

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