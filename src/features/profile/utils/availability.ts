import { WorkerAvailabilityData } from '../types';

const dayMap: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const reverseDayMap: Record<number, string> = {
  0: 'monday',
  1: 'tuesday',
  2: 'wednesday',
  3: 'thursday',
  4: 'friday',
  5: 'saturday',
  6: 'sunday',
};

export function parseBackendAvailability(
  availabilities: WorkerAvailabilityData[] | undefined
) {
  if (!availabilities || availabilities.length === 0) {
    return { selectedDays: [], startHour: null, endHour: null };
  }

  const selectedDays = availabilities
    .map((a) => dayMap[a.day?.toLowerCase()])
    .filter((d) => d !== undefined);

  // Assume all selected days have the same start and end time for this simple UI
  const first = availabilities[0];
  const startHour = first.start_time
    ? parseInt(first.start_time.split(':')[0], 10)
    : null;
  const endHour = first.end_time
    ? parseInt(first.end_time.split(':')[0], 10)
    : null;

  return { selectedDays, startHour, endHour };
}

export function formatToBackendAvailability(
  selectedDays: number[],
  startHour: number | null,
  endHour: number | null
) {
  if (startHour === null || endHour === null) return [];

  const start_time = `${startHour.toString().padStart(2, '0')}:00`;
  const end_time = `${endHour.toString().padStart(2, '0')}:00`;

  return selectedDays.map((dayId) => ({
    day: reverseDayMap[dayId],
    start_time,
    end_time,
  }));
}
