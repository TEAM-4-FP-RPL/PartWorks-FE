'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/features/jobs/components/JobCard';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/store';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { jobs } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('jobs');
  const featured = jobs.slice(0, 6);
  const topCompanies = [
    { name: 'Mitracomm Ekasarana', jobs: 95, logo: 'ME' },
    { name: 'Coway', jobs: 5, logo: 'CW' },
    { name: 'Indomobil Finance', jobs: 25, logo: 'IMFI' },
    { name: 'Rusli Vinilon Sakti', jobs: 3, logo: 'RVS' },
    { name: 'DBS Bank', jobs: 28, logo: 'DBS' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* --- SECTION ATAS TEMUKAN PERKERJAAN--- */}
      <section className="bg-[#00143a] text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center text-center py-24">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Temukan pekerjaan yang tepat untuk kamu
            </h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Pencarian lowongan yang praktis untuk langkah karier sesuai dengan
              jadwal ketersediaan kerjamu selanjutnya.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {!isLoggedIn && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Secondary Navigation Bar - Switcher Slide 1 & 2 */}
        <div className="bg-[#18366E] border-t border-white/10 overflow-x-auto no-scrollbar">
          <div className="mx-auto flex w-full max-w-7xl justify-center">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-12 py-4 text-center text-sm font-medium transition-colors border-b-4 ${
                activeTab === 'jobs'
                  ? 'bg-[#28519B] text-white border-white'
                  : 'text-white/80 hover:bg-[#204585] hover:text-white border-transparent'
              }`}
            >
              Cari Part-Time
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-12 py-4 text-center text-sm font-medium transition-colors border-b-4 ${
                activeTab === 'companies'
                  ? 'bg-[#28519B] text-white border-white'
                  : 'text-white/80 hover:bg-[#204585] hover:text-white border-transparent'
              }`}
            >
              Lihat Berdasarkan Perusahaan
            </button>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Tampilan Slide 2: Berdasarkan Perusahaan */}
        {activeTab === 'companies' && (
          <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Perusahaan Terpopuler
              </h2>
              <p className="mt-2 text-slate-500 text-sm">
                Pilih perusahaan favoritmu dan temukan shift yang tersedia.
              </p>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
              {topCompanies.map((comp, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all bg-white flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center mb-4 font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {comp.logo}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mb-4 h-10 line-clamp-2">
                    {comp.name}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">
                    {comp.jobs} Pekerjaan
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="border-slate-300 font-bold px-6"
              >
                Lihat Semua Perusahaan <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </section>
        )}

        {/* Tampilan Slide 1: Berdasarkan Lowongan */}
        {activeTab === 'jobs' && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Lowongan Unggulan
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Shift fleksibel untuk mahasiswa dan profesional.
                </p>
              </div>
              <Button
                variant="ghost"
                asChild
                className="text-blue-600 font-bold"
              >
                <Link href="/jobs">Lihat semua →</Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.length > 0 ? (
                featured.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <p className="col-span-3 text-center py-12 text-slate-400 italic">
                  Belum ada lowongan tersedia saat ini.
                </p>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 text-center mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1 rounded-md">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-slate-900">PartWorks</span>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 PartWorks. Solusi kerja paruh waktu cerdas.
          </p>
        </div>
      </footer>
    </div>
  );
}
