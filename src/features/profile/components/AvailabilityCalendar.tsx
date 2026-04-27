import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useHandleAvailabilityCalendar } from '@/features/profile/hooks/useHandleAvailabilityCalendar';
import { getDayRange } from '@/features/profile/utils/getDayRange';

const DAYS = [
  { id: 0, label: 'Senin' },
  { id: 1, label: 'Selasa' },
  { id: 2, label: 'Rabu' },
  { id: 3, label: 'Kamis' },
  { id: 4, label: 'Jumat' },
  { id: 5, label: 'Sabtu' },
  { id: 6, label: 'Minggu' },
];

const DAY_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const SHIFTS = [
  { id: 'pagi', label: 'Pagi', icon: '☀️' },
  { id: 'malam', label: 'Malam', icon: '🌙' },
];

const SHIFT_COLOR = {
  pagi: {
    active: 'bg-amber-100 border-amber-400 text-amber-800',
    dot: 'bg-amber-400',
  },
  malam: {
    active: 'bg-indigo-100 border-indigo-400 text-indigo-800',
    dot: 'bg-indigo-400',
  },
};

export default function AvailabilityCalendar() {
  const { fromDay, toDay, shift, handleFrom, handleTo, handleShift, reset } =
    useHandleAvailabilityCalendar();

  const range = getDayRange(fromDay, toDay);
  const isComplete = fromDay !== null && toDay !== null && shift !== null;

  return (
    <Card className="w-full max-w-md select-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-sans">Ketersediaan Kerja</CardTitle>
            <CardDescription className="mt-0.5">
              Tentukan hari dan shift yang kamu bisa
            </CardDescription>
          </div>
          {isComplete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={reset}
            >
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            1 · Hari kerja
          </p>

          <div className="flex items-center gap-4">
            <Select
              value={fromDay !== null ? String(fromDay) : ''}
              onValueChange={handleFrom}
            >
              <SelectTrigger className="flex-1 rounded-md bg-secondary px-4">
                <SelectValue placeholder="Dari hari..." />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(({ id, label }) => (
                  <SelectItem key={id} value={String(id)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground shrink-0">
              sampai
            </span>

            <Select
              value={toDay !== null ? String(toDay) : ''}
              onValueChange={handleTo}
              disabled={fromDay === null}
            >
              <SelectTrigger className="flex-1 rounded-md bg-secondary px-4">
                <SelectValue placeholder="Sampai hari..." />
              </SelectTrigger>
              <SelectContent>
                {DAYS.filter(({ id }) => fromDay === null || id >= fromDay).map(
                  ({ id, label }) => (
                    <SelectItem key={id} value={String(id)}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            2 · Preferred shift
          </p>
          <div className="flex gap-2">
            {SHIFTS.map(({ id, label, icon }) => {
              const active = shift === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleShift(id)}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-1 rounded-lg border py-3 px-2',
                    'transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]',
                    active
                      ? SHIFT_COLOR[id as keyof typeof SHIFT_COLOR].active
                      : 'bg-background border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  <span className="text-xl leading-none">{icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isComplete && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Ringkasan
                </p>
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded-md"
                >
                  {range.length} hari / minggu
                </Badge>
              </div>

              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
              >
                {DAYS.map(({ id, label }) => (
                  <div
                    key={id}
                    title={label}
                    className={cn(
                      'text-center text-[11px] font-semibold py-1 rounded-md',
                      range.includes(id)
                        ? 'text-foreground'
                        : 'text-muted-foreground/40'
                    )}
                  >
                    {DAY_SHORT[id]}
                  </div>
                ))}
                {DAYS.map(({ id }) => (
                  <div
                    key={id}
                    className={cn(
                      'h-6 rounded transition-all duration-200',
                      range.includes(id)
                        ? cn(
                            SHIFT_COLOR[shift as keyof typeof SHIFT_COLOR].dot,
                            'opacity-80'
                          )
                        : 'bg-muted/30'
                    )}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
