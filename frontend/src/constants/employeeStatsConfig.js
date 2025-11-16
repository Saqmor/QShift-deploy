// Color and style settings for employee metrics
export const METRIC_COLORS = {
  num_days_off: {
    color: 'blue',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    bgActive: 'bg-blue-500',
    bgInactive: 'bg-blue-600',
    bgButton: 'bg-blue-600'
  },
  num_days_worked: {
    color: 'green',
    borderColor: 'border-green-500',
    textColor: 'text-green-400',
    bgActive: 'bg-green-500',
    bgInactive: 'bg-green-600',
    bgButton: 'bg-green-600'
  },
  hours_worked: {
    color: 'purple',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    bgActive: 'bg-purple-500',
    bgInactive: 'bg-purple-600',
    bgButton: 'bg-purple-600'
  },
  num_morning_shifts: {
    color: 'yellow',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-400',
    bgActive: 'bg-yellow-500',
    bgInactive: 'bg-yellow-600',
    bgButton: 'bg-yellow-600'
  },
  num_afternoon_shifts: {
    color: 'orange',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-400',
    bgActive: 'bg-orange-500',
    bgInactive: 'bg-orange-600',
    bgButton: 'bg-orange-600'
  }
};

// Card configuration (structure, labels)
export const STATS_CONFIG = [
  { key: 'num_days_off', label: 'Days Off' },
  { key: 'num_days_worked', label: 'Days Worked' },
  { key: 'hours_worked', label: 'Hours Worked', suffix: 'h' },
  { key: 'num_morning_shifts', label: 'Morning Shifts' },
  { key: 'num_afternoon_shifts', label: 'Afternoon Shifts' }
];

// Chart titles
export const METRIC_TITLES = {
  num_days_worked: 'Days Worked per Month',
  hours_worked: 'Hours Worked per Month',
  num_days_off: 'Days Off per Month',
  num_morning_shifts: 'Morning Shifts per Month',
  num_afternoon_shifts: 'Afternoon Shifts per Month'
};