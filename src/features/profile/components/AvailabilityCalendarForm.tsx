import { Button } from '@/components/ui/button';
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
import AvailabilitySummary from '@/features/profile/components/AvailabilitySummary';
import { formatHour } from '@/features/profile/utils/formatHour';
import {
  DAYS,
  HOURS,
} from '@/features/profile/constants/availability.constants';

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
    <div className="w-full select-none space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <Label className="font-semibold text-foreground/80 text-sm">
            Ketersediaan Kerja
          </Label>
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
              <SelectTrigger className="min-w-52 bg-secondary p-2 rounded-md">
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

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Selesai</Label>
            <Select
              value={endHour !== null ? String(endHour) : ''}
              onValueChange={handleEndHour}
              disabled={startHour === null}
            >
              <SelectTrigger className="min-w-52 bg-secondary p-2 rounded-md">
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

      {isComplete && (
        <>
          <Separator />
          <AvailabilitySummary
            selectedDays={selectedDays}
            startHour={startHour}
            endHour={endHour}
          />
        </>
      )}
    </div>
  );
}
