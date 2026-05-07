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
import { useUpdateCVs } from '../hooks/useCVs';
import { WorkerCV } from '../types';

interface UpdateCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCVs: WorkerCV[];
}

interface UpdateCVFormValues {
  cvs: {
    id?: string;
    category_id: number;
    file?: File;
    file_url?: string;
  }[];
}

export default function UpdateCVDialog({
  open,
  onOpenChange,
  initialCVs,
}: UpdateCVDialogProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const updateCVs = useUpdateCVs();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<UpdateCVFormValues>({
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
      reset({
        cvs: initialCVs.map((cv) => ({
          id: cv.id,
          category_id: cv.category.id,
          file_url: cv.file_url,
        })),
      });
    }
  }, [open, initialCVs, reset]);

  const onSubmit = async (data: UpdateCVFormValues) => {
    const formData = new FormData();
    data.cvs.forEach((cv, idx) => {
      const suffix = idx + 1;
      if (cv.id) formData.append(`cv_id_${suffix}`, cv.id);
      formData.append(`category_id_${suffix}`, String(cv.category_id));
      if (cv.file) formData.append(`file_${suffix}`, cv.file);
    });

    try {
      await updateCVs.mutateAsync(formData);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      alert('Gagal memperbarui CV');
    }
  };

  const isPending = updateCVs.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans">
            Perbarui Curriculum Vitae
          </DialogTitle>
          <DialogDescription>
            Ubah atau tambah CV Anda. Semua baris ini akan tersimpan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-3">
            {fields.map((field, index) => {
              const file = watch(`cvs.${index}.file`);
              const fileUrl = watch(`cvs.${index}.file_url`);

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
                      htmlFor={`cv-upload-update-${index}`}
                      className="flex-1 h-9 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 transition-colors px-3 overflow-hidden"
                    >
                      {file ? (
                        <span className="text-xs font-medium text-slate-700 truncate flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {file.name}
                        </span>
                      ) : fileUrl ? (
                        <span className="text-xs font-medium text-slate-700 truncate flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          File sudah diunggah
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                          <UploadIcon className="w-3.5 h-3.5" /> Pilih File PDF
                        </span>
                      )}
                    </label>
                    <input
                      id={`cv-upload-update-${index}`}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setValue(`cvs.${index}.file`, e.target.files[0]);
                          setValue(`cvs.${index}.file_url`, undefined); // mark as replaced
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

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
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
