'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/features/jobs/components/JobCard';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/store';
import Link from 'next/link';
import HomeSearchBar from '@/features/home/components/HomeSearchBar';
import { JobCategory } from '@/types/job.type';
import { Shift } from '@/types/shift.type';
import { RoleGuard } from '@/components/RoleGuard';
import { UserRole } from '@/types/auth.type';
import { useAuthStore } from '@/store/auth';

export default function HomePage() {
  const router = useRouter();
  const { jobs } = useStore();
  const { hasRole } = useAuthStore();
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<JobCategory>('all');
  const [shift, setShift] = useState<Shift>('all');

  const featured = jobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {}
      <section className="relative overflow-hidden bg-(image:--gradient-hero) text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center md:py-28 md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Ratusan lowongan baru setiap minggu
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Cari kerja part-time yang
            <br /> cocok dengan jadwalmu
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-white/80 md:text-lg">
            Dari barista weekend sampai data entry remote — temukan pekerjaan
            fleksibel yang sesuai jam kosongmu.
          </p>

          {}
          <HomeSearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            shift={shift}
            setShift={setShift}
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {!hasRole([UserRole.EMPLOYER, UserRole.WORKER]) ? (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded-md"
                >
                  <Link href="/register">Daftar sebagai pencari kerja</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-md"
                >
                  <Link href="/register">Posting lowongan (Register)</Link>
                </Button>
              </>
            ) : (
              <>
                <RoleGuard allowedRoles={UserRole.WORKER}>
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="rounded-md"
                  >
                    <Link href="/jobs">Jelajahi Lowongan</Link>
                  </Button>
                </RoleGuard>

                <RoleGuard allowedRoles={UserRole.EMPLOYER}>
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="rounded-md"
                  >
                    <Link href="/employer/jobs">Dashboard Employer</Link>
                  </Button>
                </RoleGuard>
              </>
            )}
          </div>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Lowongan unggulan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilihan terbaik minggu ini
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/jobs">Lihat semua →</Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2025 PartWorks
      </footer>
    </div>
  );
}
