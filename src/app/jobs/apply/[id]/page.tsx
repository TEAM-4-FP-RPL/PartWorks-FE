'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Send,
  Briefcase,
  FileText,
  MapPin,
  Banknote,
  Clock,
  CheckCircle2,
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

export default function QuickApplyPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: job, isLoading: isJobLoading } = useGetJobById(id as string);

  const { data: profile, isLoading: isProfileLoading } = useWorkerProfile();
  const { mutate: applyJob, isPending } = useApplyJob();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      cv_id: '',
      cover_note: '',
    },
  });

  const selectedCvId = watch('cv_id');

  if (isJobLoading) return null;

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Lowongan Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Pekerjaan yang Anda lamar tidak tersedia.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-blue-600 text-white font-bold h-10 px-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI
        </Button>
      </div>
    );
  }

  const onSubmit = (data: ApplyJobFormValues) => {
    applyJob(
      { jobId: job.id, payload: data },
      {
        onSuccess: () => {
          router.push('/jobs');
        },
      }
    );
  };

  const selectedCv = profile?.cvs?.find(
    (cv: WorkerCV) => cv.id === selectedCvId
  );

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2 mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
            {job.company}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl mt-1 leading-tight">
            Lamar: {job.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-blue-600" /> Form Lamaran
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Surat Lamaran (Cover Note){' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  {...register('cover_note')}
                  placeholder="Tuliskan alasan mengapa Anda cocok untuk posisi ini..."
                  className={`min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-blue-600 resize-none ${errors.cover_note ? 'border-red-500 focus-visible:ring-red-500' : ''} px-4`}
                />
                {errors.cover_note && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.cover_note.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Pilih CV{' '}
                  <span className="text-red-500">*</span>
                </Label>

                {isProfileLoading ? (
                  <p className="text-sm text-slate-500">Memuat CV...</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`h-11 rounded-xl ${errors.cv_id ? 'border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50' : ''}`}
                        >
                          {selectedCv ? 'Ganti CV' : 'Pilih CV dari Profil'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-sans">
                            Pilih CV
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {profile?.cvs && profile.cvs.length > 0 ? (
                            <div className="grid gap-3">
                              {profile.cvs.map((cv: WorkerCV) => (
                                <div
                                  key={cv.id}
                                  onClick={() => {
                                    setValue('cv_id', cv.id, {
                                      shouldValidate: true,
                                    });
                                    setIsDialogOpen(false);
                                  }}
                                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedCvId === cv.id
                                      ? 'border-blue-600 bg-blue-50'
                                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText
                                      className={`w-5 h-5 ${selectedCvId === cv.id ? 'text-blue-600' : 'text-slate-400'}`}
                                    />
                                    <div>
                                      <p
                                        className={`font-semibold text-sm ${selectedCvId === cv.id ? 'text-blue-900' : 'text-slate-700'}`}
                                      >
                                        {cv.category?.name || 'CV Umum'}
                                      </p>
                                    </div>
                                  </div>
                                  {selectedCvId === cv.id && (
                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-center text-slate-500 py-4">
                              Anda belum mengunggah CV. Silakan unggah CV
                              melalui halaman{' '}
                              <a
                                href="/profile"
                                className="text-blue-600 underline"
                              >
                                Profil
                              </a>
                              .
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex-1 text-sm">
                      {selectedCv ? (
                        <span className="font-medium text-slate-700">
                          {selectedCv.category?.name || 'CV Umum'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          Belum ada CV yang dipilih
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {errors.cv_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.cv_id.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 mt-4"
            >
              {isPending ? (
                'MENGIRIM...'
              ) : (
                <>
                  <Send className="w-4 h-4" /> KIRIM LAMARAN
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-6">
            <div className="p-3 bg-blue-50/75 w-fit rounded-2xl text-blue-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {job.company}
              </p>
              <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                {job.title}
              </h4>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Banknote className="w-3.5 h-3.5 text-slate-400" />
                Rp {job.salary.toLocaleString()} / {job.payType}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {Array.isArray(job.shifts) ? job.shifts.join(', ') : 'Tersedia'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
