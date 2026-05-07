'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useGetListJobs } from '@/features/jobs/hooks/useGetListJobs';
import { EmployerJob } from '@/features/jobs/types';
import { MapPin, Banknote, Clock, ChevronRight, Building2 } from 'lucide-react';
import { toTitleCase } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useGetListJobs({ limit: 6 });

  const featured: EmployerJob[] = data?.data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <section className="bg-[#00143a] text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center text-center py-16 md:py-24">
          <div className="max-w-3xl mb-10 md:mb-12">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
              Temukan pekerjaan yang tepat buat kamu
            </h1>
            <p className="text-white/80 text-base md:text-xl leading-relaxed">
              Pencarian lowongan praktis untuk langkah karier sesuai dengan
              ketersediaan kamu, temukan jadwal kerjamu selanjutnya bersama
              kami.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 font-bold px-8 rounded-lg"
                onClick={() => router.push('/login')}
              >
                Masuk Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/10 font-bold px-8 rounded-lg text-white"
                asChild
              >
                <Link href="/register">Daftar Baru</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <section>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Lowongan Unggulan
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                Pilihan shift terbaik minggu ini untukmu.
              </p>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-blue-600 font-bold hover:bg-blue-50 hidden sm:flex"
            >
              <Link href="/jobs">Lihat semua lowongan →</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-3 text-center py-12 text-slate-400 italic">
                Memuat data...
              </p>
            ) : featured.length > 0 ? (
              featured.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {job.employer?.logo_url ? (
                          <img
                            src={job.employer.logo_url}
                            alt={job.employer.company_name}
                            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                            {job.employer?.company_name}
                          </p>
                          <h3 className="text-base font-bold mt-0.5 text-foreground leading-tight group-hover:text-primary line-clamp-1">
                            {toTitleCase(job.title)}
                          </h3>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`rounded px-2.5 py-0.5 text-[9px] uppercase shrink-0 ${job.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                      >
                        {job.status === 'open' ? 'Buka' : 'Tutup'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {toTitleCase(job.location)} · {toTitleCase(job.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <Banknote className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        Rp {job.salary?.toLocaleString('id-ID')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {job.schedules?.length > 0
                            ? `${job.schedules.length} hari / minggu`
                            : 'Jadwal fleksibel'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Button
                      className="w-full h-9 rounded-lg text-xs font-bold gap-2"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center py-12 text-slate-400 italic">
                Belum ada lowongan tersedia.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Button
              variant="outline"
              asChild
              className="text-blue-600 font-bold border-blue-200 hover:bg-blue-50 w-full"
            >
              <Link href="/jobs">Lihat semua lowongan →</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 md:py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center gap-3 mb-4 md:mb-6">
            <div className="bg-blue-600 p-2 rounded-xl">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
              PartWorks
            </span>
          </div>
          <p className="text-slate-400 font-medium tracking-wide text-xs md:text-sm">
            © 2026 PartWorks Team 04 FP OPREC admin Lab RPL ITS
          </p>
        </div>
      </footer>
    </div>
  );
}
