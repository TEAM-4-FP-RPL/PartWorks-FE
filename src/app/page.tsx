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

  const featured = jobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <section className="bg-[#00143a] text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center text-center py-24">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Temukan pekerjaan yang tepat buat kamu
            </h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Pencarian lowongan praktis untuk langkah karier sesuai dengan
              ketersediaan kamu, temukan jadwal kerjamu selanjutnya bersama
              kami.
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
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <section>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Lowongan Unggulan
              </h2>
              <p className="mt-2 text-slate-500">
                Pilihan shift terbaik minggu ini untukmu.
              </p>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-blue-600 font-bold hover:bg-blue-50"
            >
              <Link href="/jobs">Lihat semua lowongan →</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length > 0 ? (
              featured.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="col-span-3 text-center py-12 text-slate-400 italic">
                Belum ada lowongan tersedia.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              PartWorks
            </span>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">
            © 2026 PartWorks Team 04 FP OPREC admin Lab RPL ITS
          </p>
        </div>
      </footer>
    </div>
  );
}
