'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Briefcase, Plus, Trash2 } from 'lucide-react';
import { CategoryDropdown } from '@/features/categories/components/CategoryDropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobFormValues, jobSchema } from '../schemas';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { HOURS } from '@/features/profile/constants/availability.constants';
import { formatHour } from '@/features/profile/utils/formatHour';
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface JobFormProps {
  title: string;
  defaultValues?: Partial<JobFormValues>;
  onSubmit: (data: JobFormValues) => void;
  isPending: boolean;
}

export function JobForm({
  title,
  defaultValues,
  onSubmit,
  isPending,
}: JobFormProps) {
  const router = useRouter();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    createCategory(newCategoryName.trim(), {
      onSuccess: () => {
        setNewCategoryName('');
        setCategoryDialogOpen(false);
      },
    });
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      category_id: defaultValues?.category_id || 1,
      location: defaultValues?.location || '',
      salary: defaultValues?.salary || 0,
      type: defaultValues?.type || 'Onsite',
      schedules: defaultValues?.schedules?.length
        ? defaultValues.schedules
        : [{ day: 'monday', start_time: '', end_time: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background font-sans">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-8">
          <div className="mx-auto max-w-2xl px-4 md:px-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-transparent gap-2 mb-4 rounded-full -ml-6"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-primary-foreground/70">
                  Isi detail pekerjaan untuk mulai mencari kandidat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border"
          >
            {/* Basic info */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Judul Lowongan
                </Label>
                <Input
                  {...register('title')}
                  placeholder="Contoh: Barista Part-time"
                  className={cn(
                    'h-11 rounded-xl px-4',
                    errors.title &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Deskripsi Lowongan
                </Label>
                <Textarea
                  {...register('description')}
                  placeholder="Deskripsikan pekerjaan, kriteria, dan tanggung jawab..."
                  className={cn(
                    'min-h-[100px] rounded-xl resize-none px-4',
                    errors.description &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Kategori
                  </Label>
                  <Controller
                    control={control}
                    name="category_id"
                    render={({ field }) => (
                      <CategoryDropdown
                        value={field.value.toString()}
                        onChange={(e) => field.onChange(Number(e))}
                        placeholder="Pilih Kategori"
                        className={cn(
                          'h-11 rounded-xl w-full px-4',
                          errors.category_id && 'border-destructive'
                        )}
                        onAddCategory={() => setCategoryDialogOpen(true)}
                      />
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-xs text-destructive">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Lokasi
                  </Label>
                  <Input
                    {...register('location')}
                    placeholder="Contoh: Jakarta Pusat"
                    className={cn(
                      'h-11 rounded-xl px-4',
                      errors.location &&
                        'border-destructive focus-visible:ring-destructive'
                    )}
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Gaji / Upah
                  </Label>
                  <Controller
                    control={control}
                    name="salary"
                    render={({ field: { onChange, value, ref } }) => (
                      <Input
                        type="text"
                        ref={ref}
                        value={
                          value
                            ? new Intl.NumberFormat('id-ID').format(value)
                            : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          onChange(raw ? Number(raw) : 0);
                        }}
                        placeholder="Contoh: 3.000.000"
                        className={cn(
                          'h-11 rounded-xl px-4',
                          errors.salary &&
                            'border-destructive focus-visible:ring-destructive'
                        )}
                      />
                    )}
                  />
                  {errors.salary && (
                    <p className="text-xs text-destructive">
                      {errors.salary.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Tipe Pekerjaan
                  </Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full h-11 rounded-xl px-4',
                            errors.type && 'border-destructive'
                          )}
                        >
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Onsite">On-Site</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-xs text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedules */}
            <div className="p-6 space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Jadwal Kerja
              </Label>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-3 items-start bg-muted/40 p-4 rounded-xl border border-border"
                >
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Hari
                    </Label>
                    <Controller
                      control={control}
                      name={`schedules.${index}.day`}
                      render={({ field: { value, onChange } }) => (
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger
                            className={cn(
                              'w-full h-10 rounded-lg px-4',
                              errors.schedules?.[index]?.day &&
                                'border-destructive'
                            )}
                          >
                            <SelectValue placeholder="Pilih Hari" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              ['monday', 'Senin'],
                              ['tuesday', 'Selasa'],
                              ['wednesday', 'Rabu'],
                              ['thursday', 'Kamis'],
                              ['friday', 'Jumat'],
                              ['saturday', 'Sabtu'],
                              ['sunday', 'Minggu'],
                            ].map(([v, l]) => (
                              <SelectItem key={v} value={v}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Mulai
                    </Label>
                    <Controller
                      control={control}
                      name={`schedules.${index}.start_time`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={cn(
                              'w-full h-10 rounded-lg px-4',
                              errors.schedules?.[index]?.start_time &&
                                'border-destructive'
                            )}
                          >
                            <SelectValue placeholder="00.00" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map((h) => (
                              <SelectItem key={h} value={formatHour(h)}>
                                {formatHour(h)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Selesai
                    </Label>
                    <Controller
                      control={control}
                      name={`schedules.${index}.end_time`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={cn(
                              'w-full h-10 rounded-lg px-4',
                              errors.schedules?.[index]?.end_time &&
                                'border-destructive'
                            )}
                          >
                            <SelectValue placeholder="00.00" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map((h) => (
                              <SelectItem key={h} value={formatHour(h)}>
                                {formatHour(h)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 mt-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-xl border-dashed gap-2 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  append({ day: 'monday', start_time: '', end_time: '' })
                }
              >
                <Plus className="w-4 h-4" /> Tambah Jadwal
              </Button>
            </div>

            {/* Actions */}
            <div className="p-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 rounded-xl font-bold gap-2"
                disabled={isPending}
              >
                <Save className="w-4 h-4" />{' '}
                {isPending ? 'Menyimpan...' : 'Simpan Lowongan'}
              </Button>
            </div>
          </form>
        </section>
      </div>
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-sans">
              Tambah Kategori Baru
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Nama Kategori
            </Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Contoh: Teknologi"
              className="h-11 rounded-xl px-4"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={isCreatingCategory || !newCategoryName.trim()}
            >
              {isCreatingCategory ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
