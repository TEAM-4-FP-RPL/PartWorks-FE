import { Suspense } from 'react';
import EmployerJobsContent from '@/features/jobs/components/EmployerJobsContent';
import { Spinner } from '@/components/ui/spinner';

export default function EmployerJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <EmployerJobsContent />
    </Suspense>
  );
}
