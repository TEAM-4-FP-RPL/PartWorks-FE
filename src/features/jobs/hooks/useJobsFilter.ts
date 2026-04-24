import { Job } from '@/types/job.type';
import { CATEGORIES, JobCategory } from '@/types/job.type';
import { Shift } from '@/types/shift.type';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function useJobsFilter(jobs: Job[]) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') ?? '';
  const initialCategory = searchParams.get('category') ?? '';
  const initialShift = searchParams.get('shift') ?? '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<Set<JobCategory>>(
    new Set(
      initialCategory && CATEGORIES.includes(initialCategory as JobCategory)
        ? [initialCategory as JobCategory]
        : []
    )
  );
  const [shifts, setShifts] = useState<Set<Shift>>(
    new Set(initialShift ? [initialShift as Shift] : [])
  );
  const [pay, setPay] = useState<number>(0);

  /*
    Toggle = fungsi untuk add atau remove sebuah value dari set yang kemudian 
    digunakan untuk filtering jobs 
  */

  const toggle = useCallback(
    <T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
      const next = new Set(set);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      setter(next);
    },
    []
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (search && !`${j.title}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (category.size && !category.has(j.category)) return false;
      if (shifts.size && !j.shifts.some((s: Shift) => shifts.has(s)))
        return false;
      if (pay && j.payRate < pay) return false;
      return true;
    });
  }, [jobs, search, category, shifts, pay]);

  const reset = () => {
    setSearch('');
    setCategory(new Set());
    setShifts(new Set());
    setPay(0);
  };

  return {
    search,
    setSearch,
    category,
    setCategory,
    shifts,
    setShifts,
    pay,
    setPay,
    filtered,
    reset,
    toggle,
  };
}
