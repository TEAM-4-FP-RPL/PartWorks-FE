'use client';

import React, { useState } from 'react';
import {
  User,
  PenLine,
  X,
  Plus,
  Save,
  Camera,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Himawan',
    bio: 'Saya adalah seorang pekerja lepas yang antusias untuk membantu proyek Anda.',
    skills: ['Mengetik', 'Microsoft Office', 'Desain Grafis'],
    avatar: '',
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  const handleEdit = () => {
    setEditForm({ ...profile });
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
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

    setProfile({ ...editForm });
    setIsEditing(false);
    setError('');
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
      <div className="max-w-4xl mx-auto">
        <div className="shadow-xl rounded-2xl mb-10 bg-card border">
          {/* Cover Photo / Banner */}
          <div className="h-40 sm:h-56 w-full rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 p-2 sm:p-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all shadow-sm"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Main Content Card */}
          <div className="text-card-foreground relative z-10 p-6 md:p-10">
            {/* Avatar and Edit Button Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-4 -mt-20 sm:-mt-28 mb-8">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-background flex items-center justify-center border-4 border-background shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-muted-foreground/30" />
                  )}
                </div>
                {isEditing && (
                  <button
                    className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    title="Ubah Foto Placeholder"
                    onClick={() =>
                      alert('Ganti foto belum diimplementasi (Placeholder)')
                    }
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  className="shrink-0 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm"
                >
                  <PenLine className="w-4 h-4" />
                  Edit Profil
                </Button>
              )}
            </div>

            <div className="w-full">
              {!isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center sm:text-left space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground/80 font-medium">
                      WORKER
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b pb-2">
                      Tentang Saya
                    </h3>
                    <p className="text-foreground leading-relaxed md:text-lg opacity-90">
                      {profile.bio}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b pb-2">
                      Keahlian
                    </h3>
                    {profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                        {profile.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-800 border border-blue-200/50 shadow-sm text-sm font-semibold uppercase tracking-wide"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg inline-block">
                        Belum ada skill yang ditambahkan.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 border border-blue-100 bg-blue-50/30 rounded-xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      Edit Profil
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {error && (
                    <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2 border border-destructive/20 shadow-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  <div className="space-y-6">
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
                          disabled={
                            editForm.skills.length >= 5 || !skillInput.trim()
                          }
                          className="px-6 gap-2 shrink-0 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline font-semibold">
                            Tambah
                          </span>
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2.5 mt-4 min-h-[40px] items-center p-4 bg-background border rounded-lg shadow-inner">
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

                  <div className="flex justify-end gap-4 pt-6 border-t mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleCancel}
                      className="font-semibold shadow-sm"
                    >
                      Batal
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleSave}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
