import React from 'react';
import { useState } from 'react';

function EmployeeSelector() {
  return (
    <div className='fixed inset-0'>
      <p>Employee Selector Placeholder</p>
    </div>
  );
}


function ScheduleTable({
    scheduleData, 
    week,
    editMode
}) {
    const days_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const maxSlots = Math.max(...days_of_week.map(day => scheduleData[day].length));
    const selecetedDaysMap = {};
    const year = week.startDateWeek.getFullYear();
    const month = week.startDateWeek.getMonth();
    const lastDay = new Date(year, month+1, 0);
    days_of_week.forEach((day, index) => {
      selecetedDaysMap[day] = index + week.startDateWeek.getDate() <= lastDay.getDate()
        ? index + week.startDateWeek.getDate()
        : index + week.startDateWeek.getDate() - lastDay.getDate();
    });
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700">
                  {days_of_week.map(day => (
                    <>
                        <th className="px-3 py-3 text-left text-xs font-bold text-slate-400 border-r border-slate-600 bg-slate-750 w-32">
                            Time Slot
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-200 border-r border-slate-600 last:border-r-0">
                        <div className="flex items-center justify-center gap-2">
                            <span>{day}</span>
                        </div>
                        <div className="text-center text-sm font-bold text-slate-200 mt-1">
                            <span>{selecetedDaysMap[day]}</span>
                        </div>
                        </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxSlots }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-slate-700">
                    {days_of_week.map(day => {
                        const dayData = scheduleData[day];
                        const slot = dayData[rowIndex];
                        const employees = slot ? (slot.employees || []) : [];
                        const isUnderStaffed = slot ? employees.length < slot.minEmployees : false;
                        
                        return (
                        <>
                            <td
                            
                            className="px-3 py-3 bg-slate-750 border-r border-slate-600 text-xs">
                                {slot ? (
                                <div>
                                    <div className="font-medium text-white">
                                    {slot.startTime}-{slot.endTime}
                                    </div>
                                </div>
                                ) : (
                                <div className="text-slate-700">—</div>
                                )}
                            </td>
                            <td
                            onClick={() => slot && editMode && EmployeeSelector()}
                            className={`px-2 py-3 border-r border-slate-600 last:border-r-0 
                              ${editMode && slot ? 'cursor-pointer hover:bg-slate-700' : ''} 
                              ${isUnderStaffed ? 'bg-red-900 bg-opacity-50' : ''}`}
                            >
                            <div className="min-h-[80px] flex flex-col gap-1">
                                {slot ? (
                                <>
                                    {employees.length > 0 ? (
                                    employees.map((emp, i) => (
                                        <div
                                        key={i}
                                        className="px-2 py-1.5 bg-blue-600/50 text-white text-xs rounded text-center font-medium"
                                        >
                                        {emp}
                                        </div>
                                    ))
                                    ) : (
                                    <div className="text-slate-500 text-center text-xs py-6">{slot && editMode ? "click" : "—"}</div>
                                    )}
                                </>
                                ) : (
                                <div className="text-slate-700 text-center py-6">—</div>
                                )}
                            </div>
                            </td>
                        </>
                        );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    )
}

export default ScheduleTable;