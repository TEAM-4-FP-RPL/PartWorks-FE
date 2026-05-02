'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  X,
  Plus,
  Save,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AvailabilityCalendarForm from '@/features/profile/components/AvailabilityCalendarForm';
import {
  useWorkerProfile,
  useUpdateWorkerProfile,
} from '@/features/profile/hooks/useWorkerProfile';
import {
  useWorkerAvailability,
  useUpdateWorkerAvailability,
} from '@/features/profile/hooks/useWorkerAvailability';
import { useHandleAvailabilityCalendar } from '@/features/profile/hooks/useHandleAvailabilityCalendar';
import {
  parseBackendAvailability,
  formatToBackendAvailability,
} from '@/features/profile/utils/availability';
import { WorkerFormValues, workerSchema } from '../schemas';

export default function WorkerEditProfile() {
  const router = useRouter();

  const { data: profile, isLoading: isProfileLoading } = useWorkerProfile();
  const { data: availability, isLoading: isAvailabilityLoading } =
    useWorkerAvailability();

  const updateProfile = useUpdateWorkerProfile();
  const updateAvailability = useUpdateWorkerAvailability();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      bio: '',
      skills: [],
      avatar: '',
    },
  });

  const [skillInput, setSkillInput] = useState('');
  const avatarUrl = watch('avatar');
  const nameValue = watch('name');
  const currentSkills = watch('skills') || [];

  const initialAvailability = parseBackendAvailability(availability);

  const calendarProps = useHandleAvailabilityCalendar({
    initialDays: initialAvailability.selectedDays,
    initialStartHour: initialAvailability.startHour,
    initialEndHour: initialAvailability.endHour,
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.full_name || '',
        bio: profile.bio || '',
        skills: profile.skills
          ? profile.skills
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        avatar: profile.photo_url || '',
      });
    }
  }, [profile, reset]);

  const handleCancel = () => {
    router.back();
  };

  const onSubmit = async (data: WorkerFormValues) => {
    try {
      await updateProfile.mutateAsync({
        full_name: data.name,
        bio: data.bio,
        skills: data.skills.join(','),
      });

      const formattedAvailability = formatToBackendAvailability(
        calendarProps.selectedDays,
        calendarProps.startHour,
        calendarProps.endHour
      );

      await updateAvailability.mutateAsync(formattedAvailability);

      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(errorMessage);
    }
  };

  if (isProfileLoading || isAvailabilityLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    if (currentSkills.length >= 5) {
      return;
    }

    if (currentSkills.includes(newSkill)) {
      return;
    }

    setValue('skills', [...currentSkills, newSkill], { shouldValidate: true });
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
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
            {/* Avatar Edit Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-background flex items-center justify-center border-4 border-muted shadow-sm">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl">
                      {nameValue ? nameValue.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
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

            <div className="grid gap-8">
              <div className="space-y-2.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama Anda"
                  {...register('name')}
                  className={`h-12 shadow-sm ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-blue-500'} px-4 rounded-lg`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.name.message}
                  </p>
                )}
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
                  placeholder="Ceritakan sedikit tentang keahlian/pengalaman Anda"
                  {...register('bio')}
                  className={`flex w-full rounded-md border bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y ${errors.bio ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-blue-500'}`}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.bio.message}
                  </p>
                )}
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
                    disabled={currentSkills.length >= 5}
                    className="shadow-sm focus-visible:ring-blue-500 h-11 rounded-lg px-4"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={currentSkills.length >= 5 || !skillInput.trim()}
                    className="px-6 gap-2 shrink-0 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline font-semibold">
                      Tambah
                    </span>
                  </Button>
                </div>
                {errors.skills && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.skills.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5 mt-4 min-h-[40px] items-center p-4 bg-muted/30 border rounded-lg shadow-inner">
                  {currentSkills.map((skill, index) => (
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
                  {currentSkills.length === 0 && (
                    <span className="text-sm text-muted-foreground/70 italic px-2">
                      Belum ada skill (min. 1 disarankan)
                    </span>
                  )}
                </div>
              </div>

              <AvailabilityCalendarForm {...calendarProps} />
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
                type="button"
                size="lg"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  updateProfile.isPending || updateAvailability.isPending
                }
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm w-full sm:w-auto"
              >
                {updateProfile.isPending || updateAvailability.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
