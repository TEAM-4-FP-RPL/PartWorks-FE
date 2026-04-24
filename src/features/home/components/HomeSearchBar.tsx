import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, JobCategory } from '@/types/job.type';
import { Shift, SHIFTS } from '@/types/shift.type';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HomeSearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: JobCategory;
  setCategory: React.Dispatch<React.SetStateAction<JobCategory>>;
  shift: Shift;
  setShift: React.Dispatch<React.SetStateAction<Shift>>;
}

export default function HomeSearchBar({
  search,
  setSearch,
  category,
  setCategory,
  shift,
  setShift,
}: HomeSearchBarProps) {
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-3 shadow-2xl z-10">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto] items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari posisi atau perusahaan"
            className="border-0 bg-transparent pl-9 text-foreground shadow-none focus-visible:ring-0"
          />
        </div>
        <Select
          value={category}
          onValueChange={(val) => setCategory(val as JobCategory)}
        >
          <SelectTrigger className="w-full border-0 bg-secondary text-foreground md:w-35 p-2 rounded-md">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="p-2">
              Semua kategori
            </SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="p-2">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={shift} onValueChange={(val) => setShift(val as Shift)}>
          <SelectTrigger className="w-full border-0 bg-secondary text-foreground md:w-35 p-2 rounded-md">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="p-2">
              Semua shift
            </SelectItem>
            {SHIFTS.map((s) => (
              <SelectItem key={s.value} value={s.value} className="p-2">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="lg" asChild className="rounded-md">
          <Link href="/jobs">Cari</Link>
        </Button>
      </div>
    </div>
  );
}
