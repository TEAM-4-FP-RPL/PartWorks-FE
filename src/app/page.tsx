'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store/store';
import { CATEGORIES, SHIFTS } from '@/types/types';
import Link from 'next/link';

export default function HomePage() {
  const { jobs } = useStore();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [shift, setShift] = useState<string>('all');

  const featured = jobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[image:var(--gradient-hero)] text-primary-foreground">
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

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-3 shadow-2xl">
            <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari posisi atau perusahaan"
                  className="border-0 bg-transparent pl-9 text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full border-0 bg-secondary text-foreground md:w-[140px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kategori</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="w-full border-0 bg-secondary text-foreground md:w-[140px]">
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua shift</SelectItem>
                  {SHIFTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild size="lg">
                <Link
                  href="/jobs"
                  search={{
                    q: q || undefined,
                    category: category !== 'all' ? category : undefined,
                    shift: shift !== 'all' ? shift : undefined,
                  }}
                >
                  Cari
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Daftar sebagai pencari kerja</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/employer/post">Posting lowongan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
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
        © 2025 PartIn. Demo MVP.
      </footer>
    </div>
  );
}
