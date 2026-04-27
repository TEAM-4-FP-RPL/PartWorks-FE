import { useState } from 'react';

export function useHandleAvailabilityCalendar() {
  const [fromDay, setFromDay] = useState<number | null>(null);
  const [toDay, setToDay] = useState<number | null>(null);
  const [shift, setShift] = useState<string | null>(null);

  const handleFrom = (val: string) => {
    const next = Number(val);
    setFromDay(next);
    if (toDay !== null && toDay < next) setToDay(null);
  };

  const handleTo = (val: string) => {
    setToDay(Number(val));
  };

  const handleShift = (val: string) => {
    setShift(val);
  };

  const reset = () => {
    setFromDay(null);
    setToDay(null);
    setShift(null);
  };

  return { fromDay, toDay, shift, handleFrom, handleTo, handleShift, reset };
}
