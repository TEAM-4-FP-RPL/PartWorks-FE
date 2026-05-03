'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, FileText, UploadIcon, Loader2 } from 'lucide-react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCreateCVs } from '../hooks/useCVs';

interface UploadCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadCVFormValues {
  cvs: {
    category_id: number;
    file?: File;
  }[];
}

export default function UploadCVDialog({
  open,
  onOpenChange,
}: UploadCVDialogProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const createCVs = useCreateCVs();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<UploadCVFormValues>({
      defaultValues: {
        cvs: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cvs',
  });

  useEffect(() => {
    if (open) {
      reset({ cvs: [] });
    }
  }, [open, reset]);

  const onSubmit = async (data: UploadCVFormValues) => {
    // Validation: Make sure at least one CV has a file
    if (data.cvs.length === 0) {
      alert('Silakan tambah setidaknya 1 CV');
      return;
    }
    const hasEmptyFile = data.cvs.some((cv) => !cv.file);
    if (hasEmptyFile) {
      alert('Terdapat CV yang belum dipilih filenya.');
      return;
    }

    const formData = new FormData();
    data.cvs.forEach((cv, idx) => {
      const suffix = idx + 1;
      formData.append(`category_id_${suffix}`, String(cv.category_id));
      if (cv.file) formData.append(`file_${suffix}`, cv.file);
    });

    try {
      await createCVs.mutateAsync(formData);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      alert('Gagal mengunggah CV');
    }
  };

  const isPending = createCVs.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans">
            Unggah Curriculum Vitae
          </DialogTitle>
          <DialogDescription>
            Pilih kategori dan unggah file PDF CV Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ category_id: categories[0]?.id || 1 })}
              className="h-8 gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Tambah CV
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
              Belum ada file yang ditambahkan. Klik &quot;Tambah CV&quot; untuk
              mulai.
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => {
                const file = watch(`cvs.${index}.file`);

                return (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row gap-3 p-3 bg-white border border-slate-200 rounded-xl items-start sm:items-center"
                  >
                    <div className="flex-1 w-full">
                      <Select
                        value={String(watch(`cvs.${index}.category_id`))}
                        onValueChange={(val) =>
                          setValue(`cvs.${index}.category_id`, Number(val))
                        }
                      >
                        <SelectTrigger className="h-9 w-full bg-slate-50 rounded-lg px-4">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full flex items-center gap-2 relative">
                      <label
                        htmlFor={`cv-upload-new-${index}`}
                        className="flex-1 h-9 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 transition-colors px-3 overflow-hidden"
                      >
                        {file ? (
                          <span className="text-xs font-medium text-slate-700 truncate flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            {file.name}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                            <UploadIcon className="w-3.5 h-3.5" /> Pilih File
                            PDF
                          </span>
                        )}
                      </label>
                      <input
                        id={`cv-upload-new-${index}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setValue(`cvs.${index}.file`, e.target.files[0]);
                          }
                        }}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || fields.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Unggah
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
