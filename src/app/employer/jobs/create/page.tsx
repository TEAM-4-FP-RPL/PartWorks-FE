'use client';

import { JobForm } from '@/features/jobs/components/JobForm';
import { useCreateJob } from '@/features/jobs/hooks/useCreateJob';
import { JobFormValues } from '@/features/jobs/schemas';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();
  const { mutate: createJob, isPending } = useCreateJob();

  const handleSubmit = (data: JobFormValues) => {
    createJob(
      {
        ...data,
        category_id: Number(data.category_id),
        salary: Number(data.salary),
      },
      {
        onSuccess: () => {
          router.push('/employer/jobs');
        },
        onError: (err: Error) => {
          alert('Gagal membuat lowongan: ' + err.message);
        },
      }
    );
  };

  return (
    <JobForm
      title="TAMBAH LOWONGAN BARU"
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}
