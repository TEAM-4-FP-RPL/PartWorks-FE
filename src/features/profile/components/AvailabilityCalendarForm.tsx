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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useHandleAvailabilityCalendar } from '@/features/profile/hooks/useHandleAvailabilityCalendar';

const DAYS = [
  { id: 0, label: 'Senin', short: 'Sen' },
  { id: 1, label: 'Selasa', short: 'Sel' },
  { id: 2, label: 'Rabu', short: 'Rab' },
  { id: 3, label: 'Kamis', short: 'Kam' },
  { id: 4, label: 'Jumat', short: 'Jum' },
  { id: 5, label: 'Sabtu', short: 'Sab' },
  { id: 6, label: 'Minggu', short: 'Min' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}.00`;

export default function AvailabilityCalendarForm() {
  const {
    selectedDays,
    startHour,
    endHour,
    toggleDay,
    handleStartHour,
    handleEndHour,
    reset,
  } = useHandleAvailabilityCalendar();

  const isComplete =
    selectedDays.length > 0 && startHour !== null && endHour !== null;

  return (
    <Card className="w-full max-w-md select-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-sans">Ketersediaan Kerja</CardTitle>
            <CardDescription className="mt-0.5">
              Tentukan hari dan jam shift yang kamu bisa
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
          <p className="text-xs font-semibold uppercase tracking-wide">
            Hari kerja
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(({ id, label, short }) => {
              const active = selectedDays.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  title={label}
                  onClick={() => toggleDay(id)}
                  className={cn(
                    'h-9 w-9 rounded-full text-xs font-semibold border transition-all duration-150',
                    'hover:scale-105 active:scale-95',
                    active
                      ? 'bg-blue-500 text-background'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground/40'
                  )}
                >
                  {short}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide">
            Jam shift
          </p>
          <div className="flex items-end justify-between">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Mulai</Label>
              <Select
                value={startHour !== null ? String(startHour) : ''}
                onValueChange={handleStartHour}
              >
                <SelectTrigger className="min-w-36 bg-secondary p-2 rounded-md">
                  <SelectValue placeholder="00.00" />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {formatHour(h)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-sm text-muted-foreground pb-2.5">–</span>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Selesai</Label>
              <Select
                value={endHour !== null ? String(endHour) : ''}
                onValueChange={handleEndHour}
                disabled={startHour === null}
              >
                <SelectTrigger className="min-w-36 bg-secondary p-2 rounded-md">
                  <SelectValue placeholder="00.00" />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.filter((h) => startHour === null || h > startHour).map(
                    (h) => (
                      <SelectItem key={h} value={String(h)}>
                        {formatHour(h)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Preview ── */}
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
                      selectedDays.includes(id)
                        ? 'bg-blue-800 opacity-80'
                        : 'bg-muted'
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
