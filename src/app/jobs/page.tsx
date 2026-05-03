'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Banknote,
  Clock,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useGetListJobs } from '@/features/jobs/hooks/useGetListJobs';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { EmployerJob } from '@/features/jobs/types';

export default function JobListPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(locationQuery, 500);

  const [categoryId, setCategoryId] = useState<string>('all');
  const [jobType, setJobType] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const {
    data: jobsResponse,
    isLoading,
    isError,
  } = useGetListJobs({
    page,
    search: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    category_id: categoryId !== 'all' ? categoryId : undefined,
    type: jobType !== 'all' ? jobType : undefined,
  });

  const jobs = jobsResponse?.data || [];
  const meta = jobsResponse?.meta;

  const handleNextPage = () => {
    if (meta && page < Math.ceil(meta.total / meta.limit)) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 font-sans">
        {/* Header Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Cari Pekerjaan Impianmu
            </h1>
            <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl">
              Temukan berbagai pilihan lowongan pekerjaan yang sesuai dengan
              keahlianmu.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari posisi atau pekerjaan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-11 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Lokasi..."
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-11 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl"
                />
              </div>

              <Select
                value={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:ring-blue-600 rounded-xl">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={jobType}
                onValueChange={(val) => {
                  setJobType(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:ring-blue-600 rounded-xl">
                  <SelectValue placeholder="Tipe Pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs List */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-red-500">
              Gagal memuat lowongan pekerjaan.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job: EmployerJob) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-500 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {job.employer?.logo_url && (
                          <img
                            src={job.employer.logo_url}
                            alt={job.employer.company_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                          />
                        )}
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {job.employer?.company_name}
                          </p>
                          <h3 className="text-lg font-bold mt-0.5 text-slate-900 leading-tight group-hover:text-blue-600 line-clamp-1">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded px-2.5 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {job.status === 'open' ? 'Buka' : job.status}
                      </Badge>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-500 mb-6 mt-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{' '}
                        {job.location} ({job.type})
                      </div>
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" /> Rp{' '}
                        {job.salary?.toLocaleString('id-ID')}
                      </div>
                      <div className="flex items-start gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div>
                          {job.schedules?.length > 0
                            ? job.schedules.map((s, idx) => (
                                <div key={idx}>
                                  {s.day}: {s.start_time} - {s.end_time}
                                </div>
                              ))
                            : 'Tersedia'}
                        </div>
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

              {jobs.length === 0 && (
                <div className="col-span-full text-center py-16 text-sm text-slate-400 italic">
                  Tidak ada lowongan yang ditemukan sesuai kriteria Anda.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>
              <span className="text-sm font-medium text-slate-600">
                Halaman {page} dari {Math.ceil(meta.total / meta.limit) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= Math.ceil(meta.total / meta.limit)}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
