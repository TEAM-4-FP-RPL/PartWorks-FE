'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { useDeleteCVs } from '../hooks/useCVs';
import { WorkerCV } from '../types';

interface DeleteCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCVs: WorkerCV[];
}

export default function DeleteCVDialog({
  open,
  onOpenChange,
  initialCVs,
}: DeleteCVDialogProps) {
  const deleteCVs = useDeleteCVs();

  // Track selected IDs for deletion
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.size === 0) {
      alert('Pilih setidaknya satu CV untuk dihapus.');
      return;
    }

    // Build JSON payload: { id_1: "uuid", id_2: "uuid" }
    const payload: Record<string, string> = {};
    Array.from(selectedIds).forEach((id, idx) => {
      payload[`id_${idx + 1}`] = id;
    });

    try {
      await deleteCVs.mutateAsync(payload);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus CV');
    }
  };

  const isPending = deleteCVs.isPending;

  return (
    <Dialog open={open ? true : false} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">
            Hapus Curriculum Vitae
          </DialogTitle>
          <DialogDescription>
            Pilih CV yang ingin Anda hapus. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {initialCVs.length === 0 ? (
            <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
              Tidak ada CV yang bisa dihapus.
            </div>
          ) : (
            <div className="space-y-3">
              {initialCVs.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSelection(cv.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(cv.id)}
                    onChange={() => {}} // handled by div onClick
                    className="w-4 h-4 text-red-600 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-900">
                      {cv.category?.name || 'Kategori Tidak Diketahui'}
                    </p>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}/${cv.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Lihat File
                    </a>
                  </div>
                </div>
              ))}
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
              variant="destructive"
              disabled={isPending || selectedIds.size === 0}
              className="gap-2 rounded-lg"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Hapus Terpilih
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
