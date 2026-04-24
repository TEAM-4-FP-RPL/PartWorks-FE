'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/features/jobs/components/JobCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useStore } from '@/store/store';
import { CATEGORIES, JobCategory } from '@/types/job.type';
import { Shift } from '@/types/shift.type';
import JobsSidebar from '@/features/jobs/components/JobsSidebar';

export default function JobsPage() {
  const { jobs } = useStore();
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

  const toggle = <T,>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Semua Lowongan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} lowongan ditemukan
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <JobsSidebar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            shifts={shifts}
            setShifts={setShifts}
            pay={pay}
            setPay={setPay}
            reset={reset}
            toggle={toggle}
          />

          {/* Results */}
          <div>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Tidak ada lowongan yang cocok dengan filter Anda.
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/jobs">Lihat semua lowongan</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
