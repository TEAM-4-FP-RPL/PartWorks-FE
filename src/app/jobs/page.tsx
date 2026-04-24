import { JobsContent } from '@/features/jobs/components/JobsContent';
import { Suspense } from 'react';

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}
