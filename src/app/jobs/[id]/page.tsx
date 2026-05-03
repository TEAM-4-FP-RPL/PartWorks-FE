'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Banknote,
  Clock,
  ArrowLeft,
  CheckCircle,
  FileText,
  User,
  Building,
} from 'lucide-react';
import { useGetJobById } from '@/features/jobs/hooks/useGetJobById';
import { cn } from '@/lib/utils';
import {
  EmployerProfileData,
  WorkerAvailabilityData,
} from '@/features/profile/types';

const DAYS_MAP = [
  { day: 'monday', label: 'Senin', short: 'Sen' },
  { day: 'tuesday', label: 'Selasa', short: 'Sel' },
  { day: 'wednesday', label: 'Rabu', short: 'Rab' },
  { day: 'thursday', label: 'Kamis', short: 'Kam' },
  { day: 'friday', label: 'Jumat', short: 'Jum' },
  { day: 'saturday', label: 'Sabtu', short: 'Sab' },
  { day: 'sunday', label: 'Minggu', short: 'Min' },
];

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: job, isLoading, isError } = useGetJobById(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Lowongan Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Pekerjaan yang Anda cari tidak ada atau sudah dihapus.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-blue-600 text-white font-bold h-10 px-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI
        </Button>
      </div>
    );
  }

  const selectedDays =
    job.schedules?.map((s: WorkerAvailabilityData) => s.day) || [];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2 mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            {job.employer?.logo_url ? (
              <img
                src={job.employer.logo_url}
                alt={job.employer.company_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/20 bg-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 bg-slate-100 flex items-center justify-center shadow-sm">
                <Building className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
                {job.employer?.company_name}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl mt-1 leading-tight">
                {job.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center justify-between">
              Ringkasan Pekerjaan
              {job.category?.name && (
                <Badge variant="outline" className="bg-slate-50 font-medium">
                  {job.category.name}
                </Badge>
              )}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Lokasi
                  </span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {job.location} ({job.type})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Gaji
                  </span>
                  <span className="font-semibold text-slate-900">
                    Rp {job.salary?.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Jadwal Pekerjaan (Availability Style) */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[10px] text-slate-400 font-bold uppercase mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Jadwal Pekerjaan
                </span>
                {job.work_hours_per_week > 0 && (
                  <span className="text-[10px] font-medium text-slate-500 normal-case bg-slate-100 px-2 py-0.5 rounded-full">
                    {job.work_hours_per_week} jam / minggu
                  </span>
                )}
              </h4>

              <div className="space-y-4">
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
                >
                  {DAYS_MAP.map(({ day, label, short }) => (
                    <div
                      key={day}
                      title={label}
                      className={cn(
                        'text-center text-[11px] font-semibold py-1 rounded-md transition-colors',
                        selectedDays.includes(day)
                          ? 'text-slate-900'
                          : 'text-slate-400/50'
                      )}
                    >
                      {short}
                    </div>
                  ))}
                  {DAYS_MAP.map(({ day }) => (
                    <div
                      key={`block-${day}`}
                      className={cn(
                        'h-10 rounded transition-all duration-200',
                        selectedDays.includes(day)
                          ? 'bg-blue-600 opacity-90 shadow-inner'
                          : 'bg-slate-100'
                      )}
                    />
                  ))}
                </div>

                {job.schedules && job.schedules.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {job.schedules.map(
                      (s: WorkerAvailabilityData, idx: number) => {
                        const dayLabel = DAYS_MAP.find(
                          (d) => d.day === s.day
                        )?.label;
                        return (
                          <div
                            key={idx}
                            className="bg-slate-50 p-2 rounded-lg text-xs border border-slate-100 flex flex-col"
                          >
                            <span className="font-bold text-slate-700">
                              {dayLabel}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {s.start_time} - {s.end_time}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center">
                    Jadwal belum ditentukan.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Deskripsi Pekerjaan
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {job.description ||
                'Tidak ada deskripsi rinci untuk pekerjaan ini saat ini.'}
            </p>
          </div>

          {(job.employer as EmployerProfileData)?.description && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-600" /> Tentang
                Perusahaan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {(job.employer as EmployerProfileData).description}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Status Lowongan
              </span>
              <Badge
                className={cn(
                  'px-3 py-1 rounded-full text-[10px] uppercase tracking-wider block w-fit mt-1 text-center font-bold',
                  job.status === 'open'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                )}
              >
                {job.status === 'open' ? 'Buka' : 'Ditutup'}
              </Badge>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <Button
                disabled={job.status !== 'open'}
                className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm gap-2 disabled:bg-slate-200 disabled:text-slate-400"
                onClick={() => {
                  router.push(`/jobs/apply/${job.id}`);
                }}
              >
                <User className="w-4 h-4" /> Lamar Pekerjaan Ini
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
