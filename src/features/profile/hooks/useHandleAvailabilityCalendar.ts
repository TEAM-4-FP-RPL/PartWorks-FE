import { useState } from 'react';

interface UseHandleAvailabilityCalendarProps {
  initialDays?: number[];
  initialStartHour?: number | null;
  initialEndHour?: number | null;
}

export function useHandleAvailabilityCalendar({
  initialDays = [],
  initialStartHour = null,
  initialEndHour = null,
}: UseHandleAvailabilityCalendarProps = {}) {
  const [selectedDays, setSelectedDays] = useState<number[]>(initialDays);
  const [startHour, setStartHour] = useState<number | null>(initialStartHour);
  const [endHour, setEndHour] = useState<number | null>(initialEndHour);

  const toggleDay = (id: number) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleStartHour = (value: string) => {
    const next = Number(value);
    setStartHour(next);
    if (endHour !== null && endHour <= next) setEndHour(null);
  };

  const handleEndHour = (value: string) => {
    setEndHour(Number(value));
  };

  const reset = () => {
    setSelectedDays([]);
    setStartHour(null);
    setEndHour(null);
  };

  return {
    selectedDays,
    startHour,
    endHour,
    toggleDay,
    handleStartHour,
    handleEndHour,
    reset,
  };
}
