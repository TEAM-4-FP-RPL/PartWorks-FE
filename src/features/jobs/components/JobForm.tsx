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
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-full gap-2 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI KE DASHBOARD
        </Button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-4xl border-2 border-slate-100 shadow-none overflow-hidden bg-white"
        >
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-slate-500 text-sm">
                Isi detail pekerjaan untuk mulai mencari kandidat.
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Judul Lowongan
                </Label>
                <Input
                  {...register('title')}
                  placeholder="Contoh: Barista Part-time"
                  className={`h-12 rounded-xl border-slate-200 ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''} px-4`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Deskripsi Lowongan
                </Label>
                <Textarea
                  {...register('description')}
                  placeholder="Deskripsikan pekerjaan, kriteria, dan tanggung jawab..."
                  className={`min-h-[100px] rounded-xl border-slate-200 bg-white ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''} px-4`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
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
                        className={`h-12 rounded-xl border-slate-200 w-full ${errors.category_id ? 'border-red-500 focus:ring-red-500' : ''} px-4`}
                      />
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Lokasi
                  </Label>
                  <Input
                    {...register('location')}
                    placeholder="Contoh: Jakarta Pusat"
                    className={`h-12 rounded-xl border-slate-200 ${errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''} px-4`}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Gaji / Upah (hanya angka)
                  </Label>
                  <Controller
                    control={control}
                    name="salary"
                    render={({ field: { onChange, value, ref } }) => {
                      const formattedValue = value
                        ? new Intl.NumberFormat('id-ID').format(value)
                        : '';
                      return (
                        <Input
                          type="text"
                          ref={ref}
                          value={formattedValue}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '');
                            onChange(rawValue ? Number(rawValue) : 0);
                          }}
                          placeholder="Contoh: 3.000.000"
                          className={`h-12 rounded-xl border-slate-200 ${errors.salary ? 'border-red-500 focus-visible:ring-red-500' : ''} px-4`}
                        />
                      );
                    }}
                  />
                  {errors.salary && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.salary.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
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
                          className={`w-full h-12 rounded-xl border-slate-200 bg-white ${errors.type ? 'border-red-500' : ''} px-4`}
                        >
                          <SelectValue placeholder="Pilih Tipe Pekerjaan" />
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
                    <p className="text-xs text-red-500 font-medium">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Jadwal Kerja
                </Label>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 relative"
                  >
                    <div className="space-y-2 flex-1">
                      <Label className="text-xs font-semibold text-slate-500">
                        Hari
                      </Label>
                      <Controller
                        control={control}
                        name={`schedules.${index}.day`}
                        render={({ field: { value, onChange } }) => (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger
                              className={`w-full h-10 rounded-lg border-slate-200 bg-white ${errors.schedules?.[index]?.day ? 'border-red-500' : ''} px-4`}
                            >
                              <SelectValue placeholder="Pilih Hari" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Senin</SelectItem>
                              <SelectItem value="tuesday">Selasa</SelectItem>
                              <SelectItem value="wednesday">Rabu</SelectItem>
                              <SelectItem value="thursday">Kamis</SelectItem>
                              <SelectItem value="friday">Jumat</SelectItem>
                              <SelectItem value="saturday">Sabtu</SelectItem>
                              <SelectItem value="sunday">Minggu</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.schedules?.[index]?.day && (
                        <p className="text-xs text-red-500">
                          {errors.schedules[index]?.day?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <Label className="text-xs font-semibold text-slate-500">
                        Mulai
                      </Label>
                      <Input
                        type="time"
                        {...register(`schedules.${index}.start_time`)}
                        className={`h-10 rounded-lg border-slate-200 bg-white ${errors.schedules?.[index]?.start_time ? 'border-red-500' : ''} px-4`}
                      />
                      {errors.schedules?.[index]?.start_time && (
                        <p className="text-xs text-red-500">
                          {errors.schedules[index]?.start_time?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <Label className="text-xs font-semibold text-slate-500">
                        Selesai
                      </Label>
                      <Input
                        type="time"
                        {...register(`schedules.${index}.end_time`)}
                        className={`h-10 rounded-lg border-slate-200 bg-white ${errors.schedules?.[index]?.end_time ? 'border-red-500' : ''} px-4`}
                      />
                      {errors.schedules?.[index]?.end_time && (
                        <p className="text-xs text-red-500">
                          {errors.schedules[index]?.end_time?.message}
                        </p>
                      )}
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 mt-7 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
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
                  className="w-full h-12 rounded-xl border-dashed border-2 border-slate-200 text-blue-600 font-bold hover:bg-blue-50/50 gap-2"
                  onClick={() =>
                    append({ day: 'monday', start_time: '', end_time: '' })
                  }
                >
                  <Plus className="w-4 h-4" /> TAMBAH JADWAL
                </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12 rounded-xl font-bold border-slate-200"
              >
                BATAL
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 disabled:opacity-50"
                disabled={isPending}
              >
                <Save className="w-4 h-4" />{' '}
                {isPending ? 'MENYIMPAN...' : 'SIMPAN LOWONGAN'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
