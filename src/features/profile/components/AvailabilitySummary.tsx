import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DAYS = [
  { id: 0, label: 'Senin', short: 'Sen' },
  { id: 1, label: 'Selasa', short: 'Sel' },
  { id: 2, label: 'Rabu', short: 'Rab' },
  { id: 3, label: 'Kamis', short: 'Kam' },
  { id: 4, label: 'Jumat', short: 'Jum' },
  { id: 5, label: 'Sabtu', short: 'Sab' },
  { id: 6, label: 'Minggu', short: 'Min' },
];

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}.00`;

interface AvailabilitySummaryProps {
  selectedDays: number[];
  startHour: number | null;
  endHour: number | null;
}

export default function AvailabilitySummary({
  selectedDays,
  startHour,
  endHour,
}: AvailabilitySummaryProps) {
  const isComplete =
    selectedDays.length > 0 && startHour !== null && endHour !== null;

  if (!isComplete) {
    return (
      <p className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg inline-block w-full">
        Belum ada ketersediaan yang diatur.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Ringkasan
        </p>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded-md"
        >
          {selectedDays.length} hari · {formatHour(startHour!)}–
          {formatHour(endHour!)}
        </Badge>
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {DAYS.map(({ id, label, short }) => (
          <div
            key={id}
            title={label}
            className={cn(
              'text-center text-[11px] font-semibold py-1 rounded-md',
              selectedDays.includes(id)
                ? 'text-foreground'
                : 'text-muted-foreground/40'
            )}
          >
            {short}
          </div>
        ))}
        {DAYS.map(({ id }) => (
          <div
            key={id}
            className={cn(
              'h-10 rounded transition-all duration-200',
              selectedDays.includes(id) ? 'bg-blue-800 opacity-80' : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}
