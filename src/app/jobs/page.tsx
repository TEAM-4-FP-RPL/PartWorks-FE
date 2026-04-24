'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useStore } from '@/store/store';
import { CATEGORIES, JobCategory } from '@/types/job.type';
import { Shift, SHIFTS } from '@/types/shift.type.';

export default function JobsPage() {
  const { jobs } = useStore();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') ?? '';
  const initialCategory = searchParams.get('category') ?? '';
  const initialShift = searchParams.get('shift') ?? '';

  const [q, setQ] = useState(initialQ);
  const [cats, setCats] = useState<Set<JobCategory>>(
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
      if (
        q &&
        !`${j.title} ${j.company} ${j.location}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      if (cats.size && !cats.has(j.category)) return false;
      if (shifts.size && !j.shifts.some((s: Shift) => shifts.has(s)))
        return false;
      if (pay && j.payRate < pay) return false;
      return true;
    });
  }, [jobs, q, cats, shifts, pay]);

  const reset = () => {
    setQ('');
    setCats(new Set());
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
          <aside className="space-y-6 rounded-xl border border-border bg-card p-5 h-fit lg:sticky lg:top-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari..."
                className="pl-9"
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Kategori</h3>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${c}`}
                      checked={cats.has(c)}
                      onCheckedChange={() => toggle(cats, c, setCats)}
                    />
                    <Label
                      htmlFor={`cat-${c}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {c}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Shift</h3>
              <div className="space-y-2">
                {SHIFTS.map((s) => (
                  <div key={s.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`shift-${s.value}`}
                      checked={shifts.has(s.value)}
                      onCheckedChange={() => toggle(shifts, s.value, setShifts)}
                    />
                    <Label
                      htmlFor={`shift-${s.value}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {s.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Upah minimum</h3>
              <Slider
                value={[pay]}
                onValueChange={(v) => setPay(v[0])}
                max={300000}
                step={5000}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Min Rp {new Intl.NumberFormat('id-ID').format(pay)}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={reset}
            >
              Reset filter
            </Button>
          </aside>

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
