import BaseLayout from '../layouts/BaseLayout';
import Header from '../components/Header';
import ScheduleTable from '../components/ScheduleTable';
import { useState } from 'react';

// DADOS MOCKADOS
const MOCK_EMPLOYEES = ['Arthur', 'Artur', 'Gabriel', 'Guilherme', 'Ângelo', 'Mariana', 'Larissa', 'Beatriz'];
const INITIAL_SCHEDULE = {
  // Cada dia tem seus próprios horários
  monday: [
    { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2, employees: ['Gabriel'] },
    { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2, employees: ['Artur', 'Guilherme'] },
    { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2, employees: [] },
    { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3, employees: ['Arthur']},
  ],
  tuesday: [
    { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2, employees: ['Artur','Gabriel'] },
    { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2, employees: [] },
    { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2, employees: ['Guilherme'] },
    { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3, employees: ['Arthur','Ângelo'] },
  ],
  wednesday: [
    { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2, employees: [] },
    { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2, employees: [] },
    { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2, employees: [] },
    { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3, employees: [] },
  ],
  thursday: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2, employees: ['Guilherme', 'Ângelo']},
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2, employees: [] },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2, employees: ['Gabriel'] },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3, employees: ['Arthur', 'Artur'] },
  ],
  friday: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2, employees: ['Arthur'] },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2, employees: ['Guilherme', 'Gabriel'] },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2, employees: [] },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3, employees: ['Artur'] },
  ],
  saturday: [
      { id: 101, startTime: '09:00', endTime: '13:00', minEmployees: 3, employees: ['Gabriel', 'Artur', 'Guilherme'] },
      { id: 102, startTime: '09:00', endTime: '15:00', minEmployees: 4, employees: ['Arthur', 'Ângelo'] },
      { id: 103, startTime: '13:00', endTime: '18:00', minEmployees: 4, employees: [] },
      { id: 104, startTime: '14:00', endTime: '20:00', minEmployees: 5, employees: [] },
  ],
  sunday: []
};

const week = {
  id: 5,
  startDateWeek: new Date(2025, 9, 27),
  selectedDays: [27, 28, 29, 30, 31, 1],
  approved: false
}

function GeneratedSchedule({onPageChange}) {
    // TODO: Substituir pelos dados reais da API
    const [scheduleData, setScheduleData] = useState(INITIAL_SCHEDULE);
    const [employeeList, setEmployeeList] = useState(MOCK_EMPLOYEES);
    const [editMode, setEditMode] = useState(false);

    function handleCancel() {
        onPageChange(1);
    };

    function handleEdit() {
        setEditMode(!editMode);
        onPageChange(7);
    };

    function handleApproved() {
        // Lógica para aprovar a escala
        alert("Schedule approved!");
        onPageChange(1);
    };
    return (
        <BaseLayout
            showSidebar={false}
            currentPage={7}
        >
            <Header title="Generated Schedule" />
            <div className="p-3">
                <ScheduleTable
                    scheduleData={scheduleData}
                    setScheduleData={setScheduleData}
                    employeeList={employeeList}
                    week={week}
                    editMode={editMode}
                />

                {!editMode ? (
                  <div className="flex mt-4">
                      <div className="flex-1 justify-start flex">
                          <div className='px-2 py-1.5 rounded text-center font-medium'>
                              <button
                                  onClick={handleCancel}
                                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                  Cancel
                              </button>
                          </div>
                      </div>

                      <div className="justify-end flex flex-1">
                          <div className='px-2 py-1.5 rounded text-center font-medium'>
                              <button
                                  onClick={handleEdit}
                                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                  Edit
                              </button>
                          </div>
                          <div className='px-2 py-1.5 rounded text-center font-medium'>
                              <button
                                  onClick={handleApproved}
                                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                  Approved
                              </button>
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="flex mt-4">
                      <div className="flex-1 justify-end flex">
                          <div className='px-40 py-1.5 rounded text-center font-medium'>
                              <button
                                  onClick={handleEdit}
                                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                  Save
                              </button>
                          </div>
                      </div>
                  </div>
                )}
            </div>
        </BaseLayout>
    );
}

export default GeneratedSchedule;