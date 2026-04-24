import { MapPin, Clock, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Job } from '@/types/job.type';
import { formatPay } from '@/features/jobs/utils/formatPay';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-(--shadow-card) transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-(--shadow-elevated)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {job.company}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
        </div>
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          {job.category}
        </Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Banknote className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{formatPay(job)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <span className="capitalize">{job.shifts.join(', ')}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Button size="sm" className="w-full relative rounded-md" asChild>
          <Link href={`/jobs/${job.id}/apply`}>Quick Apply</Link>
        </Button>
      </div>
    </div>
  );
}
