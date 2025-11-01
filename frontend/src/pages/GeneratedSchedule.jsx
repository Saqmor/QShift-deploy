import BaseLayout from '../layouts/BaseLayout';
import Header from '../components/Header';
import ScheduleTable from '../components/ScheduleTable';
import { useState } from 'react';

// DADOS MOCKADOS
const INITIAL_SCHEDULE = {
  // Cada dia tem seus próprios horários
  monday: {
    slots: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2 },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2 },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2 },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3 },
    ],
    assignments: {
      1: ['Gabriel'],
      2: ['Artur', 'Guilherme'],
      4: ['Arthur']
    }
  },
  tuesday: {
    slots: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2 },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2 },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2 },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3 },
    ],
    assignments: {
        2:['Artur','Gabriel'],
        3:['Guilherme'],
        4:['Arthur','Ângelo']
    }
  },
  wednesday: {
    slots: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2 },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2 },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2 },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3 },
    ],
    assignments: {}
  },
  thursday: {
    slots: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2 },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2 },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2 },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3 },
    ],
    assignments: {
        1: ['Guilherme', 'Ângelo'],
        3: ['Gabriel'],
        4: ['Arthur', 'Artur']
    }
  },
  friday: {
    slots: [
      { id: 1, startTime: '08:00', endTime: '11:00', minEmployees: 2 },
      { id: 2, startTime: '08:00', endTime: '12:00', minEmployees: 2 },
      { id: 3, startTime: '13:00', endTime: '18:00', minEmployees: 2 },
      { id: 4, startTime: '14:00', endTime: '19:00', minEmployees: 3 },
    ],
    assignments: {
        1: ['Arthur'],
        2: ['Guilherme', 'Gabriel'],
        4: ['Artur']
    }
  },
  saturday: {
    slots: [
      { id: 101, startTime: '09:00', endTime: '13:00', minEmployees: 3 },
      { id: 102, startTime: '09:00', endTime: '15:00', minEmployees: 4 },
      { id: 103, startTime: '13:00', endTime: '18:00', minEmployees: 4 },
      { id: 104, startTime: '14:00', endTime: '20:00', minEmployees: 5 },
    ],
    assignments: {
      101: ['Gabriel', 'Artur', 'Guilherme'],
      102: ['Arthur', 'Ângelo'],
    }
  },
  sunday: {
    slots: [],
    assignments: {}
  }
};

const week = {
  id: 5,
  startDateWeek: new Date(2025, 9, 27),
  selectedDays: [27, 28, 29, 30, 31, 1],
  approved: false
}

function GeneratedSchedule({onPageChange}) {
    const [scheduleData, setScheduleData] = useState(INITIAL_SCHEDULE);
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