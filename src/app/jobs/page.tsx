'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Banknote, Clock, Search, Briefcase, Filter, ChevronRight } from 'lucide-react';

export default function JobListPage() {
  const router = useRouter();
  const { jobs } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua', ...Array.from(new Set(jobs.map((job) => job.category)))];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      
      {}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Cari Pekerjaan Impianmu
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl">
            Temukan berbagai pilihan lowongan pekerjaan yang sesuai dengan keahlianmu.
          </p>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-8">
        
        {}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari posisi, perusahaan, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              {categories.slice(0, 5).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full text-xs font-medium px-4 h-9 ${
                    selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Daftar Lowongan Pekerjaan */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-500 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {job.company}
                    </p>
                    <h3 className="text-lg font-bold mt-0.5 text-slate-900 leading-tight group-hover:text-blue-600">
                      {job.title}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="rounded px-2.5 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                    Buka
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 font-medium text-slate-600">
                    <Banknote className="w-3.5 h-3.5 text-slate-400" /> Rp {job.payRate.toLocaleString()} / {job.payType}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> 
                    {Array.isArray(job.shifts) ? job.shifts.join(', ') : 'Tersedia'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button
                  className="w-full h-10 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 gap-2 transition-colors"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm text-slate-400 italic">
              Tidak ada lowongan yang ditemukan sesuai kriteria Anda.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}