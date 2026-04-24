import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { Shift, SHIFTS } from '@/types/shift.type';
import { CATEGORIES, JobCategory } from '@/types/job.type';
import { Button } from '@/components/ui/button';

interface JobsSidebarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: Set<JobCategory>;
  setCategory: React.Dispatch<React.SetStateAction<Set<JobCategory>>>;
  shifts: Set<Shift>;
  setShifts: React.Dispatch<React.SetStateAction<Set<Shift>>>;
  pay: number;
  setPay: React.Dispatch<React.SetStateAction<number>>;
  reset: () => void;
  toggle: <T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => void;
}

export default function JobsSidebar({
  search,
  setSearch,
  category,
  setCategory,
  shifts,
  setShifts,
  pay,
  setPay,
  reset,
  toggle,
}: JobsSidebarProps) {
  return (
    <aside className="space-y-6 rounded-xl border border-border bg-card p-5 h-fit lg:sticky lg:top-20">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari..."
          className="pl-9"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Kategori</h3>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${c}`}
                checked={category.has(c)}
                onCheckedChange={() => toggle(category, c, setCategory)}
              />
              <Label
                htmlFor={`cat-${c}`}
                className="cursor-pointer text-sm font-normal"
              >
                {c}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Shift</h3>
        <div className="space-y-2">
          {SHIFTS.map((s) => (
            <div key={s.value} className="flex items-center gap-2">
              <Checkbox
                id={`shift-${s.value}`}
                checked={shifts.has(s.value)}
                onCheckedChange={() => toggle(shifts, s.value, setShifts)}
              />
              <Label
                htmlFor={`shift-${s.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                {s.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Upah minimum</h3>
        <Slider
          value={[pay]}
          onValueChange={(v) => setPay(v[0])}
          max={300000}
          step={5000}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Min Rp {new Intl.NumberFormat('id-ID').format(pay)}
        </p>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={reset}>
        Reset filter
      </Button>
    </aside>
  );
}
