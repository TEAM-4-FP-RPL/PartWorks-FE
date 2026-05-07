'use client';

import {
  User,
  PenLine,
  ArrowLeft,
  Loader2,
  MoreVertical,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEmployerProfile } from '@/features/profile/hooks/useEmployerProfile';
import { useAuthStore } from '@/store/auth';

export default function EmployerProfile() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const { data: profile, isLoading } = useEmployerProfile();

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    clearToken();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Gagal memuat profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="shadow-xl rounded-2xl mb-10 bg-card border">
          {/* Cover Photo / Banner */}
          <div className="h-40 sm:h-56 w-full rounded-t-2xl bg-(image:--gradient-hero) relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 p-2 sm:p-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all shadow-sm"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 sm:p-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all shadow-sm"
                  title="Opsi"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main Content Card */}
          <div className="text-card-foreground relative z-10 p-6 md:p-10">
            {/* Avatar and Edit Button Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-4 -mt-20 sm:-mt-28 mb-8">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-background flex items-center justify-center border-4 border-background shadow-lg">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-muted-foreground/30" />
                  )}
                </div>
              </div>

              <Button
                onClick={handleEdit}
                className="shrink-0 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-sm"
              >
                <PenLine className="w-4 h-4" />
                Edit Profil
              </Button>
            </div>

            <div className="w-full">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center sm:text-left space-y-1.5">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {profile.company_name}
                  </h1>
                  <p className="text-muted-foreground/80 font-medium">
                    EMPLOYER
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b pb-2">
                    Tentang Perusahaan
                  </h3>
                  <p className="text-foreground leading-relaxed md:text-lg opacity-90 whitespace-pre-wrap">
                    {profile.description ||
                      'Belum ada deskripsi yang ditambahkan.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
