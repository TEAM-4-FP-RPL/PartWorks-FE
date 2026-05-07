'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Banknote,
  Clock,
  ArrowLeft,
  FileText,
  User,
  Building,
  CalendarDays,
} from 'lucide-react';
import { useGetJobById } from '@/features/jobs/hooks/useGetJobById';
import { cn, toTitleCase } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import {
  EmployerProfileData,
  WorkerAvailabilityData,
} from '@/features/profile/types';
import AvailabilitySummary from '@/features/profile/components/AvailabilitySummary';

const DAYS_MAP: Record<string, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: job, isLoading, isError } = useGetJobById(id as string);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </>
    );
  }

  if (isError || !job) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Lowongan Tidak Ditemukan
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Pekerjaan yang Anda cari tidak ada atau sudah dihapus.
          </p>
          <Button
            onClick={() => router.back()}
            className="font-bold h-10 px-6 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </div>
      </>
    );
  }

  const isOpen = job.status === 'open';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2 mb-4 rounded-full -ml-2"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <div className="flex items-center gap-4">
              {job.employer?.logo_url ? (
                <img
                  src={job.employer.logo_url}
                  alt={job.employer.company_name}
                  className="w-14 h-14 rounded-full object-cover border-4 border-white/20 bg-white shadow-sm shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6 text-primary-foreground/60" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/70">
                  {job.employer?.company_name}
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl mt-0.5 leading-tight">
                  {job.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8 md:px-6 grid gap-6 md:grid-cols-3">
          {/* Main content — single card */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border h-full">
              {/* Summary */}
              <div className="px-6 py-10 space-y-4">
                <h3 className="text-sm font-bold text-foreground tracking-widest uppercase">
                  Ringkasan Pekerjaan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted-foreground font-bold uppercase">
                        Lokasi
                      </span>
                      <span className="font-semibold text-foreground text-sm capitalize">
                        {toTitleCase(job.location)} · {toTitleCase(job.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted-foreground font-bold uppercase">
                        Gaji
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        Rp {job.salary?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-10 space-y-3 flex-1">
                <h3 className="text-sm font-bold text-foreground tracking-widest uppercase flex items-center gap-2">
                  Deskripsi Pekerjaan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description ||
                    'Tidak ada deskripsi rinci untuk pekerjaan ini saat ini.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4 sticky top-20">
              {/* Schedule */}
              {job.schedules?.length > 0 && (
                <div className="border-border pt-4 space-y-3">
                  <h3 className="text-sm font-bold text-foreground tracking-widest uppercase">
                    Jadwal Pekerjaan
                  </h3>
                  <AvailabilitySummary
                    selectedDays={job.schedules
                      .map((s: WorkerAvailabilityData) =>
                        Object.keys(DAYS_MAP).indexOf(s.day)
                      )
                      .filter((i: number) => i !== -1)}
                    startHour={
                      job.schedules[0]?.start_time
                        ? parseInt(job.schedules[0].start_time)
                        : null
                    }
                    endHour={
                      job.schedules[0]?.end_time
                        ? parseInt(job.schedules[0].end_time)
                        : null
                    }
                  />
                  <div className="flex flex-col gap-1 pt-1">
                    {job.schedules.map(
                      (s: WorkerAvailabilityData, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-foreground">
                            {DAYS_MAP[s.day] ?? s.day}
                          </span>
                          <span className="text-muted-foreground">
                            {s.start_time} – {s.end_time}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <Button
                  disabled={!isOpen}
                  className={cn(
                    'w-full h-11 rounded-xl text-sm font-bold gap-2',
                    !isOpen && 'opacity-50'
                  )}
                  onClick={() => router.push(`/jobs/apply/${job.id}`)}
                >
                  <User className="w-4 h-4" />
                  {isOpen ? 'Lamar Pekerjaan Ini' : 'Lowongan Ditutup'}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
