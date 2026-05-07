'use client';

import React, { useState } from 'react';

import {
  useGetJobApplicants,
  useUpdateApplicationStatus,
} from '@/features/employer/hooks/useGetJobApplicants';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Calendar,
  FileText,
  User,
  ArrowLeft,
  MapPin,
  Banknote,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Spinner } from '@/components/ui/spinner';
import { useGetJobById } from '@/features/jobs/hooks/useGetJobById';
import { EmployerJob } from '@/features/jobs/types';
import { cn } from '@/lib/utils';

type Application = {
  id: string;
  status: string;
  applied_at: string;
  worker: { id: string; full_name: string; photo_url: string };
  cv: { id: string; file_url: string; category: { id: number; name: string } };
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Menunggu',
    className: 'bg-[var(--status-pending-bg)] text-[var(--status-pending-fg)]',
  },
  accepted: {
    label: 'Diterima',
    className:
      'bg-[var(--status-accepted-bg)] text-[var(--status-accepted-fg)]',
  },
  rejected: {
    label: 'Ditolak',
    className:
      'bg-[var(--status-rejected-bg)] text-[var(--status-rejected-fg)]',
  },
};

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));

export default function EmployerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { data, isLoading } = useGetJobApplicants(id);
  const { data: job, isLoading: isLoadingJob } = useGetJobById(id);
  const updateStatus = useUpdateApplicationStatus(id);

  const [confirm, setConfirm] = useState<{
    app: Application;
    action: 'accepted' | 'rejected';
  } | null>(null);

  const applications = data as Application[] | undefined;
  const jobDetail = job as EmployerJob | undefined;

  const handleConfirm = async () => {
    if (!confirm) return;
    await updateStatus.mutateAsync({
      id: confirm.app.id,
      status: confirm.action,
    });
    setConfirm(null);
  };

  if (isLoading || isLoadingJob) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        <section className="bg-primary text-primary-foreground py-6 md:py-10">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-transparent gap-2 mb-3 rounded-full -ml-2"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl font-extrabold tracking-tight md:text-3xl">
                {jobDetail?.title}
              </h1>
              <Badge
                className={cn(
                  'w-fit uppercase text-xs px-3 py-1 font-bold rounded-sm',
                  jobDetail?.status === 'open'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                )}
              >
                {jobDetail?.status === 'open' ? 'Buka' : 'Tutup'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-primary-foreground/80 mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {jobDetail?.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4" /> Rp{' '}
                {jobDetail?.salary.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {applications?.length ?? 0} pelamar
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          {!applications || applications.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <User className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                Belum ada pelamar
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pekerjaan ini belum menerima lamaran apapun.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applications.map((app) => {
                const statusCfg = STATUS_CONFIG[app.status.toLowerCase()] ?? {
                  label: app.status,
                  className: 'bg-muted text-muted-foreground',
                };
                const isPending = app.status.toLowerCase() === 'pending';
                return (
                  <div
                    key={app.id}
                    className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-primary/30 transition-all space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {app.worker.photo_url ? (
                          <img
                            src={app.worker.photo_url}
                            alt={app.worker.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground capitalize">
                            {app.worker.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.cv?.category?.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-full border-0',
                          statusCfg.className
                        )}
                      >
                        {statusCfg.label}
                      </Badge>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Dilamar {formatDate(app.applied_at)}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      {app.cv?.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:flex-1 rounded-lg"
                          asChild
                        >
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/${app.cv.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FileText className="mr-2 h-3.5 w-3.5" /> Lihat CV
                          </a>
                        </Button>
                      )}
                      {isPending && (
                        <div className="flex gap-2 w-full sm:flex-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                            onClick={() =>
                              setConfirm({ app, action: 'rejected' })
                            }
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                            onClick={() =>
                              setConfirm({ app, action: 'accepted' })
                            }
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Terima
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-sans">
              {confirm?.action === 'accepted'
                ? 'Terima Pelamar'
                : 'Tolak Pelamar'}
            </DialogTitle>
            <DialogDescription>
              {confirm?.action === 'accepted'
                ? `Apakah Anda yakin ingin menerima lamaran dari ${confirm?.app.worker.full_name}?`
                : `Apakah Anda yakin ingin menolak lamaran dari ${confirm?.app.worker.full_name}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={updateStatus.isPending}
              className={
                confirm?.action === 'accepted'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {updateStatus.isPending && <Spinner className="w-4 h-4 mr-2" />}
              {confirm?.action === 'accepted' ? 'Ya, Terima' : 'Ya, Tolak'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
