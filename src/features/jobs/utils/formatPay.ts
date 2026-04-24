import { Job } from '@/types/job.type';

export function formatPay(job: Job) {
  const formatted = new Intl.NumberFormat('id-ID').format(job.payRate);
  return `Rp ${formatted}/${job.payType === 'hourly' ? 'jam' : 'hari'}`;
}
