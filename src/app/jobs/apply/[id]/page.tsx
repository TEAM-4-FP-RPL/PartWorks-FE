'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Send,
  FileText,
  MapPin,
  Banknote,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile';
import { useApplyJob } from '@/features/apply job/hooks/useApplyJob';
import { WorkerCV } from '@/features/cvs/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  applyJobSchema,
  ApplyJobFormValues,
} from '@/features/apply job/schemas';
import { useGetJobById } from '@/features/jobs/hooks/useGetJobById';
import { Navbar } from '@/components/Navbar';
import { cn, toTitleCase } from '@/lib/utils';

export default function QuickApplyPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: job, isLoading: isJobLoading } = useGetJobById(id as string);
  const { data: profile, isLoading: isProfileLoading } = useWorkerProfile();
  const { mutate: applyJob, isPending } = useApplyJob();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: { cv_id: '', cover_note: '' },
  });

  const selectedCvId = watch('cv_id');

  if (isJobLoading) return null;

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Lowongan Tidak Ditemukan
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Pekerjaan yang Anda lamar tidak tersedia.
          </p>
          <Button
            onClick={() => router.back()}
            className="font-bold h-10 px-6 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </div>
      </>
    );
  }

  const onSubmit = (data: ApplyJobFormValues) => {
    applyJob(
      { jobId: job.id, payload: data },
      { onSuccess: () => router.push('/jobs') }
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-8">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2 mb-4 rounded-full -ml-6"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
              {job.employer?.company_name}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl mt-1 leading-tight">
              Lamar Pekerjaan {job.title}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <h3 className="text-sm font-bold text-foreground tracking-widest uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Form Lamaran
              </h3>

              {/* Cover note */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Surat Lamaran (Cover Note){' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  {...register('cover_note')}
                  placeholder="Tuliskan alasan mengapa Anda cocok untuk posisi ini..."
                  className={cn(
                    'min-h-[120px] rounded-xl resize-none px-4',
                    errors.cover_note &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {errors.cover_note && (
                  <p className="text-xs text-destructive">
                    {errors.cover_note.message}
                  </p>
                )}
              </div>

              {/* CV selection — inline cards, no dialog */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Pilih CV{' '}
                  <span className="text-destructive">*</span>
                </Label>

                {isProfileLoading ? (
                  <p className="text-sm text-muted-foreground">Memuat CV...</p>
                ) : profile?.cvs?.length > 0 ? (
                  <div className="grid gap-2">
                    {profile.cvs.map((cv: WorkerCV) => (
                      <button
                        key={cv.id}
                        type="button"
                        onClick={() =>
                          setValue('cv_id', cv.id, { shouldValidate: true })
                        }
                        className={cn(
                          'flex items-center justify-between p-4 rounded-xl border text-left transition-all',
                          selectedCvId === cv.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40 hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FileText
                            className={cn(
                              'w-4 h-4',
                              selectedCvId === cv.id
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-semibold',
                              selectedCvId === cv.id
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {cv.category?.name || 'CV Umum'}
                          </span>
                        </div>
                        {selectedCvId === cv.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Belum ada CV. Unggah melalui halaman{' '}
                    <a href="/profile" className="text-primary underline">
                      Profil
                    </a>
                    .
                  </p>
                )}
                {errors.cv_id && (
                  <p className="text-xs text-destructive">
                    {errors.cv_id.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 rounded-xl font-bold gap-2"
              >
                {isPending ? (
                  'Mengirim...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Kirim Lamaran
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
