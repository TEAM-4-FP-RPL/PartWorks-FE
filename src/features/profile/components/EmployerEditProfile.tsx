'use client';

import { useEffect, useState } from 'react';
import { Camera, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
} from '@/features/profile/hooks/useEmployerProfile';
import { EmployerFormValues, employerSchema } from '../schemas';

export default function EmployerEditProfile() {
  const router = useRouter();

  const { data: profile, isLoading } = useEmployerProfile();
  const updateProfile = useUpdateEmployerProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(employerSchema),
    defaultValues: { name: '', bio: '', avatar: '' },
  });

  const avatarUrl = watch('avatar');
  const nameValue = watch('name');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.company_name || '',
        bio: profile.description || '',
        avatar: profile.logo_url || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: EmployerFormValues) => {
    try {
      await updateProfile.mutateAsync({
        company_name: data.name,
        description: data.bio,
        ...(logoFile && { logo: logoFile }),
      });
      router.push('/profile');
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : String(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Edit Profil Perusahaan
            </h1>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2 border border-destructive/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">
                Terdapat kesalahan pada form. Silakan periksa kembali.
              </span>
            </div>
          )}

          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-background flex items-center justify-center border-4 border-muted shadow-sm">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                      {nameValue ? nameValue.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLogoFile(file);
                    setValue('avatar', URL.createObjectURL(file));
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
                  title="Ubah Logo"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  Logo Perusahaan
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gunakan logo yang terlihat jelas. (Maks. 2MB)
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      Pilih Logo
                    </label>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setValue('avatar', '')}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Nama Perusahaan
                </Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama perusahaan"
                  {...register('name')}
                  className={
                    errors.name
                      ? 'border-destructive focus-visible:ring-destructive'
                      : ''
                  }
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Deskripsi Perusahaan
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Ceritakan tentang visi dan profil perusahaan Anda"
                  {...register('bio')}
                  className={`min-h-[120px] resize-y ${errors.bio ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={updateProfile.isPending}
                className="gap-2 w-full sm:w-auto"
              >
                {updateProfile.isPending ? (
                  <Spinner className="w-4 h-4" />
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
