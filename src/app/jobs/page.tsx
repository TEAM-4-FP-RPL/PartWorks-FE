'use client';

import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/features/jobs/components/JobCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useStore } from '@/store/store';
import JobsSidebar from '@/features/jobs/components/JobsSidebar';
import { useJobsFilter } from '@/features/jobs/hooks/useJobsFilter';
import { Suspense } from 'react';

export default function JobsPage() {
  const { jobs } = useStore();
  const filter = useJobsFilter(jobs);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Semua Lowongan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter.filtered.length} lowongan ditemukan
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <JobsSidebar
              search={filter.search}
              setSearch={filter.setSearch}
              category={filter.category}
              setCategory={filter.setCategory}
              shifts={filter.shifts}
              setShifts={filter.setShifts}
              pay={filter.pay}
              setPay={filter.setPay}
              reset={filter.reset}
              toggle={filter.toggle}
            />

            {/* Results */}
            <div>
              {filter.filtered.length === 0 ? (
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
                  {filter.filtered.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
