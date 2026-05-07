'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Banknote,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Navbar } from '@/components/Navbar';
import {
  useEmployerJobs,
  useDeleteJob,
  useUpdateJobStatus,
} from '@/features/jobs/hooks/useEmployerJobs';
import { Pagination } from '@/components/ui/pagination';
import { EmployerJob } from '../types';
import Link from 'next/link';
import { toTitleCase } from '@/lib/utils';

export default function EmployerJobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const status = searchParams.get('status') || 'open';
  const limit = 10;

  const { data, isLoading, isError } = useEmployerJobs({ page, limit, status });

  const jobs = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const deleteJobMutation = useDeleteJob();
  const updateStatusMutation = useUpdateJobStatus();

  const handlePageChange = (newPage: number) => {
    router.push(`/employer/jobs?status=${status}&page=${newPage}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
      try {
        await deleteJobMutation.mutateAsync(id);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan yang tidak diketahui';
        alert(`Gagal menghapus lowongan: ${errorMessage}`);
      }
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'open' | 'closed'
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan yang tidak diketahui';
      alert(`Gagal mengubah status: ${errorMessage}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
                Daftar Lowongan
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilihan lowongan yang telah Anda pasang.
              </p>
            </div>
            <Button
              onClick={() => router.push('/employer/jobs/create')}
              className="h-11 px-6 rounded-md font-medium gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Pasang Lowongan Baru
            </Button>
          </div>

          {/* Status tabs */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 gap-1">
            {(['open', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => router.push(`/employer/jobs?status=${s}&page=1`)}
                className={`px-5 py-1.5 rounded-md text-sm font-semibold capitalize transition-colors ${
                  status === s
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'open' ? 'Open' : 'Closed'}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-xs font-bold tracking-wider uppercase text-muted-foreground">
                    <th className="py-4 px-6">Judul Pekerjaan</th>
                    <th className="py-4 px-6">Lokasi & Gaji</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-muted-foreground"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Memuat data...
                      </td>
                    </tr>
                  )}
                  {!isLoading && isError && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-destructive font-medium"
                      >
                        Gagal memuat lowongan pekerjaan.
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    !isError &&
                    jobs.map((job: EmployerJob) => (
                      <tr
                        key={job.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold">
                          <Link href={`/employer/jobs/${job.id}`}>
                            {toTitleCase(job.title)}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />{' '}
                              {toTitleCase(job.location)}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Banknote className="w-3.5 h-3.5" /> Rp{' '}
                              {job.salary.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-muted-foreground font-medium">
                          {job.category?.name || '-'}
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            variant="secondary"
                            className={
                              job.status === 'open'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider'
                                : 'bg-red-50 text-red-700 border-red-200 text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider'
                            }
                          >
                            {job.status === 'open' ? 'Buka' : 'Tutup'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-border text-xs font-bold rounded-md"
                              onClick={() =>
                                router.push(`/employer/jobs/edit/${job.id}`)
                              }
                            >
                              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  disabled={job.status === 'open'}
                                  onClick={() =>
                                    handleStatusChange(job.id, 'open')
                                  }
                                >
                                  Tandai sebagai Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={job.status === 'closed'}
                                  onClick={() =>
                                    handleStatusChange(job.id, 'closed')
                                  }
                                >
                                  Tandai sebagai Closed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive focus:bg-destructive/5"
                                  onClick={() => handleDelete(job.id)}
                                  disabled={deleteJobMutation.isPending}
                                >
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && !isError && jobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-sm text-muted-foreground italic"
                      >
                        Tidak ada data lowongan yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-border">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
