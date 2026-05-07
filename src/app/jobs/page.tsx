'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MapPin,
  Banknote,
  Clock,
  Search,
  ChevronRight,
  SlidersHorizontal,
  Building2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useInfiniteListJobs } from '@/features/jobs/hooks/useInfiniteListJobs';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { EmployerJob } from '@/features/jobs/types';
import { Spinner } from '@/components/ui/spinner';
import { toTitleCase } from '@/lib/utils';

export default function JobListPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(locationQuery, 500);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [jobType, setJobType] = useState<string>('all');

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteListJobs({
    search: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    category_id: categoryId !== 'all' ? categoryId : undefined,
    type: jobType !== 'all' ? jobType : undefined,
    limit: 12,
  });

  const jobs = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta?.total ?? 0;

  // Intersection observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const activeFilterCount =
    (categoryId !== 'all' ? 1 : 0) +
    (jobType !== 'all' ? 1 : 0) +
    (locationQuery ? 1 : 0);

  const handleResetFilters = () => {
    setLocationQuery('');
    setCategoryId('all');
    setJobType('all');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        {/* Header */}
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

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
          {/* Search Bar + Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari posisi atau pekerjaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-card rounded-xl border-border shadow-sm text-sm"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-4 rounded-xl border-border bg-card shadow-sm gap-2 relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-72 py-6 space-y-4 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Filter Lowongan</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reset semua
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Lokasi
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Kota atau daerah..."
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Kategori
                  </Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="Semua Kategori" />
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
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Tipe Pekerjaan
                  </Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="Semua Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 -mt-2">
              {locationQuery && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  <MapPin className="w-3 h-3" /> {locationQuery}
                  <button
                    onClick={() => setLocationQuery('')}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {categoryId !== 'all' && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {categories.find((c) => c.id.toString() === categoryId)?.name}
                  <button
                    onClick={() => setCategoryId('all')}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {jobType !== 'all' && (
                <Badge variant="secondary" className="gap-1 pr-1 capitalize">
                  {jobType}
                  <button
                    onClick={() => setJobType('all')}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Total count */}
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <span className="font-semibold text-foreground">
                {jobs.length}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-foreground">{total}</span>{' '}
              lowongan
            </p>
          )}

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner color="blue" className="w-8 h-8" />
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-destructive">
              Gagal memuat lowongan pekerjaan.
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job: EmployerJob) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Logo with fallback */}
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
                            {toTitleCase(job.location)} ·{' '}
                            {toTitleCase(job.type)}
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
                ))}

                {jobs.length === 0 && (
                  <div className="col-span-full text-center py-16 text-sm text-muted-foreground italic">
                    Tidak ada lowongan yang ditemukan sesuai kriteria Anda.
                  </div>
                )}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="flex justify-center py-6">
                {isFetchingNextPage && (
                  <Spinner color="blue" className="w-8 h-8" />
                )}
                {!hasNextPage && jobs.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Semua lowongan sudah ditampilkan
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
