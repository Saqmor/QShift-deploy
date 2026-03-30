import { ObjAppLayout as BaseLayout } from '../atomic/ObjAppLayout';
import { MolPageHeader } from '../atomic/MolPageHeader';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, RotateCcw, Calendar, Trash2, ArrowLeft } from 'lucide-react';
import { daysOfWeek } from '../constants/constantsOfTable.js';
import { Button } from '../atomic/AtmButton/index.js';
import { AtmInput } from '../atomic/AtmInput/index.js';
import { ObjRetryStatusBanner } from '../atomic/ObjRetryStatusBanner';
import { useScheduleCreate } from '../hooks/useScheduleGeneration';
import { STATUS } from '../hooks/useRetryOnSleep';

function ShiftConfigPage({
  selectedDays,
  startDate,
  setWeekData,
  setShiftsData,
  setPreviewSchedule,
}) {
  const navigate = useNavigate();
  const openDaysMask = [];
  const selectedDaysMap = {};

  const { run, status, retryCountdown, retriesLeft, errorInfo, getMessage } = useScheduleCreate();
  const isBusy = status === STATUS.RUNNING || status === STATUS.WAKING_UP;

  useEffect(() => {
    if (!startDate || !selectedDays || selectedDays.length === 0) navigate('/staff');
  }, [startDate, selectedDays, navigate]);

  selectedDays.forEach((day) => {
    selectedDaysMap[day.getDay() === 0 ? 6 : day.getDay() - 1] = day;
    openDaysMask.push(day.getDay() === 0 ? 6 : day.getDay() - 1);
  });
  openDaysMask.sort((a, b) => a - b);

  const [weekShifts, setWeekShifts] = useState([
    {
      id: 1,
      config: [
        { weekday: 0, start_time: '', end_time: '', min_staff: null },
        { weekday: 1, start_time: '', end_time: '', min_staff: null },
        { weekday: 2, start_time: '', end_time: '', min_staff: null },
        { weekday: 3, start_time: '', end_time: '', min_staff: null },
        { weekday: 4, start_time: '', end_time: '', min_staff: null },
        { weekday: 5, start_time: '', end_time: '', min_staff: null },
        { weekday: 6, start_time: '', end_time: '', min_staff: null },
      ],
    },
  ]);

  const handleBack = () => navigate('/calendar');

  const addTurn = () => {
    const newWeekShift = {
      id: Date.now(),
      config: daysOfWeek.map((_, i) => ({ weekday: i, start_time: '', end_time: '', min_staff: null })),
    };
    setWeekShifts([...weekShifts, newWeekShift]);
  };

  const removeShift = (weekShiftId) => {
    if (weekShifts.length > 1) setWeekShifts(weekShifts.filter((ws) => ws.id !== weekShiftId));
  };

  const updateShiftConfig = (weekShiftId, dayOfWeek, field, value) => {
    setWeekShifts(
      weekShifts.map((weekShift) => {
        if (weekShift.id === weekShiftId) {
          return {
            ...weekShift,
            config: weekShift.config.map((dayConfig, index) =>
              index === dayOfWeek ? { ...dayConfig, [field]: value } : dayConfig,
            ),
          };
        }
        return weekShift;
      }),
    );
  };

  const saveConfigShift = () => {
    const configToSave = weekShifts.map((ws) => ({
      id: ws.id,
      config: ws.config.map((dc) => ({
        weekday: dc.weekday,
        start_time: dc.start_time,
        end_time: dc.end_time,
        min_staff: dc.min_staff ? Number(dc.min_staff) : null,
      })),
    }));
    localStorage.setItem('shiftConfigurations', JSON.stringify(configToSave));
  };

  const restoreConfigShift = () => {
    const savedConfig = localStorage.getItem('shiftConfigurations');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setWeekShifts(parsedConfig.map((ws) => ({
        ...ws,
        config: ws.config.map((dc) => ({ ...dc, min_staff: dc.min_staff !== null ? Number(dc.min_staff) : null })),
      })));
    }
  };

  const handleShiftsSchedule = () => {
    let shiftsSchedule = [];
    const errors = [];
    weekShifts.forEach((weekShift, weekShiftIndex) => {
      weekShift.config.forEach((shift) => {
        const labelShift = `${daysOfWeek[shift.weekday]} - Shift ${weekShiftIndex + 1}`;
        const isDaySelected = selectedDaysMap[shift.weekday] !== undefined;
        if (isDaySelected && (shift.start_time || shift.end_time || shift.min_staff)) {
          const hasAnyField = shift.start_time || shift.end_time || shift.min_staff;
          const hasAllFields = shift.start_time && shift.end_time && shift.min_staff;
          if (hasAnyField && !hasAllFields) {
            let missingFields = [];
            if (!shift.start_time) missingFields.push('start time');
            if (!shift.end_time) missingFields.push('end time');
            if (!shift.min_staff) missingFields.push('number of employees');
            errors.push(`${labelShift}: Missing ${missingFields.join(', ')}`);
            return;
          }
          if (shift.start_time && shift.end_time && shift.start_time >= shift.end_time) {
            errors.push(`${labelShift}: End time must be after start time.`); return;
          }
          if (shift.min_staff && Number(shift.min_staff) < 0) {
            errors.push(`${labelShift}: Minimum number of employees must be greater than 0.`); return;
          }
          if (hasAllFields) {
            shiftsSchedule.push({
              id: crypto.randomUUID(),
              weekday: shift.weekday,
              start_time: shift.start_time,
              end_time: shift.end_time,
              min_staff: Number(shift.min_staff),
            });
          }
        }
      });
    });
    if (errors.length > 0) return { success: false, errors };
    if (shiftsSchedule.length === 0)
      return { success: false, errors: ['Please configure at least one complete shift (with start time, end time, and number of employees).'] };
    setShiftsData(shiftsSchedule);
    return { success: true, data: shiftsSchedule };
  };

  const convertScheduleData = (shifts) => {
    let scheduleModified = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
    shifts.forEach((shift, index) => {
      const dayName = daysOfWeek[shift.weekday];
      scheduleModified[dayName].push({
        id: `${dayName}-${index}`,
        startTime: shift.start_time.slice(0, 5),
        endTime: shift.end_time.slice(0, 5),
        minEmployees: shift.min_staff,
        employees: shift.employees.map((emp) => ({ id: emp.employee_id, name: emp.name })),
      });
    });
    daysOfWeek.forEach((day) => {
      scheduleModified[day].sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        if (a.endTime < b.endTime) return -1;
        if (a.endTime > b.endTime) return 1;
        return 0;
      });
    });
    return scheduleModified;
  };

  const createSchedule = async () => {
    const result = handleShiftsSchedule();
    if (!result.success) {
      const errorMessage = result.errors.join('\n\n');
      alert(`Please fix the following issues:\n\n${errorMessage}`);
      return;
    }
    const shiftsSchedule = result.data;
    const week = { start_date: startDate.toISOString().split('T')[0], open_days: openDaysMask };
    setWeekData(week);

    const response = await run({ shift_vector: shiftsSchedule });

    if (response?.success) {
      const previewScheduleData = response.data.result;
      if (previewScheduleData?.possible && previewScheduleData.schedule) {
        const convertedData = convertScheduleData(previewScheduleData.schedule.shifts);
        setPreviewSchedule(convertedData);
        navigate('/schedule');
      } else {
        alert('Unable to generate a viable schedule with the current settings. Check shift and employee settings.');
        navigate('/staff');
      }
    }
  };

  return (
    <BaseLayout showSidebar={false} currentPage={6} showSelectionPanel={true} selectionPanelData={{ startDate, selectedDays }}>
      <MolPageHeader title="Shift Configuration" />

      <ObjRetryStatusBanner
        status={status}
        retryCountdown={retryCountdown}
        retriesLeft={retriesLeft}
        errorInfo={errorInfo}
        getMessage={getMessage}
        onRetry={createSchedule}
      />

      <div className="bg-slate-800 rounded-lg overflow-x-auto border border-slate-700 mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700">
              {daysOfWeek.map((day, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-center text-sm font-bold ${selectedDaysMap[idx] ? 'text-slate-200' : 'text-slate-500'}`}
                >
                  {day}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">Delete</th>
            </tr>
          </thead>
          <tbody>
            {weekShifts.map((weekShift) => (
              <tr key={weekShift.id} className="border-t border-slate-700 hover:bg-slate-750">
                {daysOfWeek.map((day, dayIdx) => (
                  <td key={dayIdx} className={`px-2 py-3 ${!selectedDaysMap[dayIdx] ? 'bg-slate-900' : ''}`}>
                    {selectedDaysMap[dayIdx] ? (
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex gap-1">
                          <AtmInput
                            type="time"
                            value={weekShift.config[dayIdx].start_time}
                            onChange={(e) => updateShiftConfig(weekShift.id, dayIdx, 'start_time', e.target.value)}
                            size="sm"
                            variant="shiftConfig"
                            placeholder="Begin"
                            disabled={isBusy}
                          />
                          <AtmInput
                            type="time"
                            value={weekShift.config[dayIdx].end_time}
                            onChange={(e) => updateShiftConfig(weekShift.id, dayIdx, 'end_time', e.target.value)}
                            size="sm"
                            variant="shiftConfig"
                            placeholder="End"
                            disabled={isBusy}
                          />
                        </div>
                        <AtmInput
                          type="number"
                          min="0"
                          max="50"
                          value={weekShift.config[dayIdx].min_staff ?? ''}
                          onChange={(e) => updateShiftConfig(weekShift.id, dayIdx, 'min_staff', e.target.value)}
                          size="sm"
                          variant="shiftConfig"
                          placeholder="Number of employees"
                          disabled={isBusy}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-slate-600 text-sm">-</div>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeShift(weekShift.id)}
                    disabled={weekShifts.length === 1 || isBusy}
                    className={`p-2 rounded-lg transition-colors ${weekShifts.length === 1 || isBusy
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    title="Delete shift"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addTurn}
        disabled={isBusy}
        className="w-full mb-6 px-6 py-3 bg-slate-700 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
        Add shift
      </button>

      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
        <div className="order-3 md:order-none col-span-1 md:flex-1 justify-start flex">
          <Button onClick={handleBack} variant='primary' size='lg' disabled={isBusy}>
            <ArrowLeft size={20} />
            Back
          </Button>
        </div>
        <Button onClick={restoreConfigShift} variant='secondary' className="order-1 md:order-none" size='lg' disabled={isBusy}>
          <RotateCcw className="w-4 h-4" />
          Restore settings
        </Button>
        <Button onClick={saveConfigShift} variant='secondary' className="order-2 md:order-none" size='lg' disabled={isBusy}>
          <Save className="w-4 h-4" />
          Save settings
        </Button>
        <Button onClick={createSchedule} variant='primary' className="order-4 md:order-none ml-auto" size='lg' disabled={isBusy}>
          <Calendar className="w-4 h-4" />
          {isBusy ? 'Generating…' : 'Create Schedule'}
        </Button>
      </div>
    </BaseLayout>
  );
}

export default ShiftConfigPage;
