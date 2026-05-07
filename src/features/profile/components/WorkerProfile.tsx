'use client';

import {
  User,
  PenLine,
  ArrowLeft,
  Loader2,
  MoreVertical,
  LogOut,
  Upload,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AvailabilitySummary from '@/features/profile/components/AvailabilitySummary';
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile';
import { useWorkerAvailability } from '@/features/profile/hooks/useWorkerAvailability';
import { parseBackendAvailability } from '@/features/profile/utils/availability';
import { useAuthStore } from '@/store/auth';
import UploadCVDialog from '@/features/cvs/components/UploadCVDialog';
import UpdateCVDialog from '@/features/cvs/components/UpdateCVDialog';
import DeleteCVDialog from '@/features/cvs/components/DeleteCVDialog';
import { useState } from 'react';
import { WorkerCV } from '@/features/cvs/types';

export default function WorkerProfile() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const [isUploadCVDialogOpen, setIsUploadCVDialogOpen] = useState(false);
  const [isUpdateCVDialogOpen, setIsUpdateCVDialogOpen] = useState(false);
  const [isDeleteCVDialogOpen, setIsDeleteCVDialogOpen] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useWorkerProfile();
  const { data: availability, isLoading: isAvailabilityLoading } =
    useWorkerAvailability();

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    clearToken();
    router.push('/');
  };

  if (isProfileLoading || isAvailabilityLoading) {
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

  const { selectedDays, startHour, endHour } =
    parseBackendAvailability(availability);
  const skillsList = profile.skills
    ? profile.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

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
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
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
                    {profile.full_name}
                  </h1>
                  <p className="text-muted-foreground/80 font-medium">WORKER</p>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b pb-2">
                    Tentang Saya
                  </h3>
                  <p className="text-foreground leading-relaxed md:text-lg opacity-90 whitespace-pre-wrap">
                    {profile.bio || 'Belum ada deskripsi yang ditambahkan.'}
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b pb-2">
                    Keahlian
                  </h3>
                  {skillsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                      {skillsList.map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm text-sm font-semibold uppercase tracking-wide"
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

                <div className="mt-10">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b pb-2">
                    Ketersediaan Kerja
                  </h3>

                  <AvailabilitySummary
                    selectedDays={selectedDays}
                    startHour={startHour}
                    endHour={endHour}
                  />
                </div>

                <div className="mt-10">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Curriculum Vitae
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setIsUploadCVDialogOpen(true)}
                          className="cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" /> Upload CV Baru
                        </DropdownMenuItem>
                        {profile.cvs && profile.cvs.length > 0 && (
                          <>
                            <DropdownMenuItem
                              onClick={() => setIsUpdateCVDialogOpen(true)}
                              className="cursor-pointer"
                            >
                              <PenLine className="w-4 h-4 mr-2" /> Update CV
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setIsDeleteCVDialogOpen(true)}
                              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Hapus CV
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {profile.cvs && profile.cvs.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {profile.cvs.map((cv: WorkerCV, idx: number) => (
                        <div
                          key={cv.id || idx}
                          className="flex flex-col rounded-xl border bg-muted/10 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {/* PDF Preview */}
                          <div className="w-full h-52 bg-slate-100 relative overflow-hidden">
                            <iframe
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${cv.file_url}`}
                              className="w-full h-full pointer-events-none"
                            />
                            {/* Overlay to capture click and open in new tab */}
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/${cv.file_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0"
                              title="Buka CV"
                            />
                          </div>
                          {/* Footer */}
                          <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {cv.category?.name || 'Kategori Tidak Diketahui'}
                            </p>
                            <a
                              href={cv.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 shrink-0 ml-2"
                            >
                              Buka ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg inline-block w-full">
                      Belum ada Curriculum Vitae yang diunggah.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UploadCVDialog
        open={isUploadCVDialogOpen}
        onOpenChange={setIsUploadCVDialogOpen}
      />
      {profile.cvs && profile.cvs.length > 0 && (
        <>
          <UpdateCVDialog
            open={isUpdateCVDialogOpen}
            onOpenChange={setIsUpdateCVDialogOpen}
            initialCVs={profile.cvs}
          />
          <DeleteCVDialog
            open={isDeleteCVDialogOpen}
            onOpenChange={setIsDeleteCVDialogOpen}
            initialCVs={profile.cvs}
          />
        </>
      )}
    </div>
  );
}
