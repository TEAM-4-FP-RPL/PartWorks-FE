'use client';

import useGetApplications from '@/features/worker/hooks/useGetApplications';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  MapPin,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { cn, toTitleCase } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Application } from '@/features/worker/types';
import { Spinner } from '@/components/ui/spinner';

export default function ApplicationsPage() {
  const { data, isLoading } = useGetApplications();

  const applications = data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    const map: Record<
      string,
      { label: string; className: string; icon: typeof CheckCircle }
    > = {
      accepted: {
        label: 'Diterima',
        className:
          'bg-[var(--status-accepted-bg)] text-[var(--status-accepted-fg)]',
        icon: CheckCircle,
      },
      rejected: {
        label: 'Ditolak',
        className:
          'bg-[var(--status-rejected-bg)] text-[var(--status-rejected-fg)]',
        icon: XCircle,
      },
      pending: {
        label: 'Menunggu',
        className:
          'bg-[var(--status-pending-bg)] text-[var(--status-pending-fg)]',
        icon: Clock,
      },
    };
    return map[status.toLowerCase()] ?? map.pending;
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : (
        <>
          <section className="bg-primary text-primary-foreground py-8">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Lamaran Pekerjaan Saya
              </h1>
              <p className="text-primary-foreground/80 mt-1 text-sm">
                Pantau status lamaran pekerjaan yang telah Anda kirim.
              </p>
            </div>
          </section>

          <div className="container mx-auto py-8 px-4 max-w-6xl min-h-[calc(100vh-4rem)]">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Pekerjaan</th>
                      <th className="px-6 py-4">Perusahaan</th>
                      <th className="px-6 py-4">Lokasi</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Tanggal Melamar</th>
                      <th className="px-6 py-4">CV Dilampirkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
                            <p className="text-base font-medium text-foreground">
                              Belum ada lamaran
                            </p>
                            <p className="text-sm mt-1">
                              Anda belum melamar pekerjaan apapun.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      applications.map((app: Application) => {
                        const StatusIcon = getStatusConfig(app.status).icon;
                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            <td className="px-6 py-5 align-middle font-bold text-foreground">
                              <a
                                href={`/jobs/${app.job.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {app.job.title}
                              </a>
                            </td>
                            <td className="px-6 py-5 align-middle">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-medium">
                                  {toTitleCase(app.job.employer.company_name)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 align-middle">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {toTitleCase(app.job.location)} ·{' '}
                                  {toTitleCase(app.job.type)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 align-top">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'px-2.5 py-1 text-[11px] font-bold gap-1.5 border uppercase tracking-wider flex w-fit items-center rounded-md',
                                  getStatusConfig(app.status).className
                                )}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {getStatusConfig(app.status).label}
                              </Badge>
                            </td>
                            <td className="px-6 py-5 align-middle text-muted-foreground whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                  {formatDate(app.applied_at)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 align-middle">
                              {app.cv ? (
                                <a
                                  href={app.cv.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span className="font-bold text-xs">
                                    {app.cv.category?.name ?? 'CV'}
                                  </span>
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  Tidak ada CV
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
