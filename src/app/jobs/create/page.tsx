'use client';
import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateJobPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    jamMulai: '',
    jamSelesai: '',
    hariPerMinggu: '',
    upah: '',
    tipeUpah: 'per jam',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim())
      newErrors.title = 'Judul pekerjaan tidak boleh kosong.';
    if (!form.description.trim())
      newErrors.description = 'Deskripsi tidak boleh kosong.';

    if (!form.jamMulai) newErrors.jamMulai = 'Wajib diisi.';
    if (!form.jamSelesai) newErrors.jamSelesai = 'Wajib diisi.';
    if (form.jamMulai && form.jamSelesai && form.jamMulai >= form.jamSelesai) {
      newErrors.jamSelesai = 'Harus setelah jam mulai.';
    }

    if (!form.hariPerMinggu) {
      newErrors.hariPerMinggu = 'Wajib diisi.';
    } else if (
      isNaN(Number(form.hariPerMinggu)) ||
      Number(form.hariPerMinggu) < 1 ||
      Number(form.hariPerMinggu) > 7
    ) {
      newErrors.hariPerMinggu = 'Harus angka 1-7.';
    }

    if (!form.upah) {
      newErrors.upah = 'Wajib diisi.';
    } else if (isNaN(Number(form.upah)) || Number(form.upah) <= 0) {
      newErrors.upah = 'Harus berupa angka valid lebih dari 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, save to backend
    router.push('/jobs');
  };

  const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const newTag = tagInput.trim();
    if (!newTag) return;

    if (form.tags.length >= 5) {
      setErrors({
        ...errors,
        tags: 'Maksimal hanya 5 tag yang diperbolehkan.',
      });
      return;
    }

    if (form.tags.includes(newTag)) {
      setErrors({ ...errors, tags: 'Tag sudah ada.' });
      return;
    }

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
    setTagInput('');
    const newErrors = { ...errors };
    delete newErrors.tags;
    setErrors(newErrors);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Lowongan
        </button>

        <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Buat Lowongan Pekerjaan
            </h1>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2 border border-destructive/20 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">
                Terdapat kesalahan pada form. Silakan periksa kembali field yang
                di-highlight.
              </span>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid gap-8">
              <div className="space-y-2.5">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Judul Pekerjaan
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="Contoh: Barista Paruh Waktu"
                  style={{ paddingLeft: '12px' }}
                  className={`h-12 shadow-sm ${errors.title ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-blue-500'}`}
                />
                {errors.title && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Deskripsi Pekerjaan
                </Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    if (errors.description)
                      setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan persyaratan..."
                  style={{ paddingLeft: '12px' }}
                  className={`flex w-full rounded-md border bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground placeholder:pl-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y ${errors.description ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-blue-500'}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">
                  Kategori / Tag{' '}
                  <span className="font-normal text-muted-foreground text-xs ml-1">
                    (Maks 5)
                  </span>
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Contoh: F&B, Pelayanan, dll"
                    style={{ paddingLeft: '12px' }}
                    disabled={form.tags.length >= 5}
                    className="shadow-sm focus-visible:ring-blue-500 h-11"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddTag()}
                    disabled={form.tags.length >= 5 || !tagInput.trim()}
                    className="px-6 gap-2 shrink-0 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline font-semibold">
                      Tambah
                    </span>
                  </Button>
                </div>
                {errors.tags && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.tags}
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5 mt-4 min-h-[40px] items-center p-4 bg-muted/30 border rounded-lg shadow-inner">
                  {form.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-2 text-sm font-semibold shadow-sm transition-all hover:shadow"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="bg-blue-200 text-blue-900 rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors focus:outline-none"
                        title="Hapus tag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {form.tags.length === 0 && (
                    <span className="text-sm text-muted-foreground/70 italic px-2">
                      Belum ada tag (min. 1 disarankan)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-foreground/80">
                    Jam Kerja (Mulai - Selesai)
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-input/50 shadow-sm hover:border-blue-300 transition-colors">
                    <div className="flex-1 space-y-1">
                      <Input
                        type="time"
                        value={form.jamMulai}
                        onChange={(e) => {
                          setForm({ ...form, jamMulai: e.target.value });
                          if (errors.jamMulai)
                            setErrors({ ...errors, jamMulai: '' });
                        }}
                        className={`h-12 bg-background border-0 shadow-none font-medium text-base ${errors.jamMulai ? 'text-destructive' : 'text-foreground'}`}
                      />
                      {errors.jamMulai && (
                        <p className="text-xs text-destructive font-medium">
                          {errors.jamMulai}
                        </p>
                      )}
                    </div>
                    <span className="text-muted-foreground font-medium px-2">
                      -
                    </span>
                    <div className="flex-1 space-y-1">
                      <Input
                        type="time"
                        value={form.jamSelesai}
                        onChange={(e) => {
                          setForm({ ...form, jamSelesai: e.target.value });
                          if (errors.jamSelesai)
                            setErrors({ ...errors, jamSelesai: '' });
                        }}
                        className={`h-12 bg-background border-0 shadow-none font-medium text-base ${errors.jamSelesai ? 'text-destructive' : 'text-foreground'}`}
                      />
                      {errors.jamSelesai && (
                        <p className="text-xs text-destructive font-medium">
                          {errors.jamSelesai}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="hariPerMinggu"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Jumlah Hari per Minggu
                  </Label>
                  <div className="relative">
                    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-xl border border-input/50 shadow-sm hover:border-blue-300 transition-colors">
                      <Input
                        id="hariPerMinggu"
                        type="number"
                        min="1"
                        max="7"
                        value={form.hariPerMinggu}
                        onChange={(e) => {
                          setForm({ ...form, hariPerMinggu: e.target.value });
                          if (errors.hariPerMinggu)
                            setErrors({ ...errors, hariPerMinggu: '' });
                        }}
                        placeholder="0"
                        style={{ paddingLeft: '12px' }}
                        className={`h-12 bg-background border-0 shadow-none font-medium text-base ${errors.hariPerMinggu ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-blue-500'}`}
                      />
                      <span className="text-muted-foreground font-medium text-sm pr-2">
                        hari/minggu
                      </span>
                    </div>
                    {errors.hariPerMinggu && (
                      <p className="text-sm text-destructive font-medium mt-1">
                        {errors.hariPerMinggu}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="upah"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Anggaran / Upah
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      Rp
                    </span>
                    <Input
                      id="upah"
                      type="number"
                      value={form.upah}
                      onChange={(e) => {
                        setForm({ ...form, upah: e.target.value });
                        if (errors.upah) setErrors({ ...errors, upah: '' });
                      }}
                      placeholder="0"
                      style={{ paddingLeft: '12px' }}
                      className={`h-11 pl-9 shadow-sm ${errors.upah ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-blue-500'}`}
                    />
                  </div>
                  <select
                    value={form.tipeUpah}
                    onChange={(e) =>
                      setForm({ ...form, tipeUpah: e.target.value })
                    }
                    className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-32 shrink-0"
                  >
                    <option value="per jam">/ Jam</option>
                    <option value="per hari">/ Hari</option>
                    <option value="per proyek">/ Proyek</option>
                  </select>
                </div>
                {errors.upah && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.upah}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                className="font-semibold shadow-sm w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                size="lg"
                onClick={handleSave}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                Posting Lowongan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
