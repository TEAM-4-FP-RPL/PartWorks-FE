'use client';
import React, { useState } from 'react';
import { Camera, X, Plus, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditProfilePage() {
  const router = useRouter();
  const [error, setError] = useState('');

  // Dummy data, similar to the main profile page
  const [editForm, setEditForm] = useState({
    name: 'Himawan',
    bio: 'Saya adalah seorang pekerja lepas yang antusias untuk membantu proyek Anda.',
    skills: ['Mengetik', 'Microsoft Office', 'Desain Grafis'],
    avatar: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    if (!editForm.bio.trim()) {
      setError('Deskripsi singkat tidak boleh kosong.');
      return;
    }

    // In a real app, this would save to a backend or global state
    router.push('/profile');
  };

  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    if (editForm.skills.length >= 5) {
      setError('Maksimal hanya 5 skill yang diperbolehkan.');
      return;
    }

    if (editForm.skills.includes(newSkill)) {
      setError('Skill sudah ada.');
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setSkillInput('');
    setError('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
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
          Kembali ke Profil
        </button>

        <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Edit Profil
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2 border border-destructive/20 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-8">
            {/* Avatar Edit Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-background flex items-center justify-center border-4 border-muted shadow-sm">
                  {editForm.avatar ? (
                    <img
                      src={editForm.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl">
                      {editForm.name.charAt(0)}
                    </div>
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                  title="Ubah Foto"
                  onClick={() =>
                    alert('Ganti foto belum diimplementasi (Placeholder)')
                  }
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  Foto Profil
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gunakan foto yang profesional untuk menarik perhatian klien.
                  (Maks. 2MB)
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Pilih Foto
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Masukkan nama Anda"
                  className="h-12 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="bio"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Deskripsi Singkat
                </Label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Ceritakan sedikit tentang keahlian/pengalaman Anda"
                  className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">
                  Skill / Keahlian{' '}
                  <span className="font-normal text-muted-foreground text-xs ml-1">
                    (Maks 5)
                  </span>
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Contoh: Mengetik, Desain, dll"
                    disabled={editForm.skills.length >= 5}
                    className="shadow-sm focus-visible:ring-blue-500 h-11"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={editForm.skills.length >= 5 || !skillInput.trim()}
                    className="px-6 gap-2 shrink-0 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline font-semibold">
                      Tambah
                    </span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-4 min-h-[40px] items-center p-4 bg-muted/30 border rounded-lg shadow-inner">
                  {editForm.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-2 text-sm font-semibold shadow-sm transition-all hover:shadow"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="bg-blue-200 text-blue-900 rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors focus:outline-none"
                        title="Hapus skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {editForm.skills.length === 0 && (
                    <span className="text-sm text-muted-foreground/70 italic px-2">
                      Belum ada skill (min. 1 disarankan)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancel}
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
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
