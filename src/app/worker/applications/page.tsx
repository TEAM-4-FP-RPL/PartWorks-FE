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
import { cn } from '@/lib/utils';
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
    switch (status.toLowerCase()) {
      case 'accepted':
        return {
          label: 'Diterima',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          className: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
        };
      case 'pending':
      default:
        return {
          label: 'Menunggu',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner color="blue" className="h-8 w-8" />
        </div>
      ) : (
        <div className="container mx-auto py-10 px-4 max-w-6xl min-h-[calc(100vh-4rem)]">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Lamaran Pekerjaan Saya
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Pantau status lamaran pekerjaan yang telah Anda kirim.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Pekerjaan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tanggal Melamar</th>
                    <th className="px-6 py-4">CV Dilampirkan</th>
                    <th className="px-6 py-4">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
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
                          <td className="px-6 py-5 align-top">
                            <div className="font-bold text-foreground text-base mb-1">
                              {app.job.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <Building className="w-3.5 h-3.5" />
                              <span className="font-medium">
                                {app.job.employer.company_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>
                                {app.job.location} &bull; {app.job.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 align-top">
                            <Badge
                              variant="outline"
                              className={cn(
                                'px-2.5 py-1 text-[11px] font-bold gap-1.5 border uppercase tracking-wider flex w-fit items-center',
                                getStatusConfig(app.status).className
                              )}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {getStatusConfig(app.status).label}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 align-top text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium text-sm">
                                {formatDate(app.applied_at)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 align-top">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL || ''}${app.cv.file_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                            >
                              <FileText className="w-4 h-4" />
                              <span className="font-bold text-xs">
                                {app.cv.category.name}
                              </span>
                            </a>
                          </td>
                          <td className="px-6 py-5 align-top text-muted-foreground">
                            <div className="bg-muted/50 border border-border rounded-lg p-3 text-xs leading-relaxed max-w-[280px]">
                              {app.cover_note ? (
                                <span
                                  className="line-clamp-3"
                                  title={app.cover_note}
                                >
                                  {app.cover_note}
                                </span>
                              ) : (
                                <span className="italic text-muted-foreground/60">
                                  Tidak ada catatan
                                </span>
                              )}
                            </div>
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
      )}
    </>
  );
}
