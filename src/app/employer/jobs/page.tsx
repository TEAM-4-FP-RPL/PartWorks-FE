import { Suspense } from 'react';
import EmployerJobsContent from '@/features/jobs/components/EmployerJobsContent';

export default function EmployerJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Memuat...
        </div>
      }
    >
      <EmployerJobsContent />
    </Suspense>
  );
}
