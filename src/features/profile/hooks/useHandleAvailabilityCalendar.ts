import { useState } from 'react';

export function useHandleAvailabilityCalendar() {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);

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
