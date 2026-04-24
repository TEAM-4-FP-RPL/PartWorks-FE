import { MapPin, Clock, Banknote } from 'lucide-react';
import type { Job } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function formatPay(job: Job) {
  const formatted = new Intl.NumberFormat('id-ID').format(job.payRate);
  return `Rp ${formatted}/${job.payType === 'hourly' ? 'jam' : 'hari'}`;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-(--shadow-card) transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-(--shadow-elevated)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {job.company}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            <Link
              href={`/jobs/${job.id}`}
              className="after:absolute after:inset-0"
            >
              {job.title}
            </Link>
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
        <Button size="sm" className="w-full relative z-10" asChild>
          <Link href={`/jobs/${job.id}`}>Quick Apply</Link>
        </Button>
      </div>
    </div>
  );
}
