'use client';

import { JobForm } from '@/features/jobs/components/JobForm';
import { useUpdateJob } from '@/features/jobs/hooks/useUpdateJob';
import { useJob } from '@/features/jobs/hooks/useJob';
import { JobFormValues } from '@/features/jobs/schemas';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: job, isLoading, isError } = useJob(id as string);
  const { mutate: updateJob, isPending } = useUpdateJob();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">
          Lowongan tidak ditemukan atau gagal dimuat.
        </p>
      </div>
    );
  }

  const mapType = (rawType: string): 'Onsite' | 'Remote' | 'Hybrid' => {
    const t = rawType?.toLowerCase() || '';
    if (t === 'onsite') return 'Onsite';
    if (t === 'remote') return 'Remote';
    if (t === 'hybrid') return 'Hybrid';
    return 'Onsite';
  };

  const defaultValues: Partial<JobFormValues> = {
    title: job.title,
    description: job.description || '',
    category_id: job.category?.id || 1,
    location: job.location,
    salary: job.salary || 0,
    type: mapType(job.type),
    schedules:
      job.schedules?.length > 0
        ? job.schedules.map(
            (s: { day: string; start_time: string; end_time: string }) => ({
              day: s.day || 'monday',
              start_time: s.start_time || '',
              end_time: s.end_time || '',
            })
          )
        : [{ day: 'monday', start_time: '', end_time: '' }],
  };

  const handleSubmit = (data: JobFormValues) => {
    updateJob(
      {
        id: id as string,
        payload: {
          ...data,
          category_id: Number(data.category_id),
          salary: Number(data.salary),
        },
      },
      {
        onSuccess: () => {
          router.push('/employer/jobs');
        },
        onError: (err: Error) => {
          alert('Gagal mengupdate lowongan: ' + err.message);
        },
      }
    );
  };

  return (
    <JobForm
      title="EDIT LOWONGAN"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}
