'use client';
import AvailabilityCalendar from '@/features/profile/components/AvailabilityCalendarForm';
import React, { useState } from 'react';
import { User, PenLine, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: 'Himawan',
    bio: 'Saya adalah seorang pekerja lepas yang antusias untuk membantu proyek Anda.',
    skills: ['Mengetik', 'Microsoft Office', 'Desain Grafis'],
    avatar: '',
  });

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6">
      {/* <AvailabilityCalendar /> */}
      <div className="max-w-4xl mx-auto mt-8">
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
              </div>

              <Button
                onClick={handleEdit}
                className="shrink-0 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm"
              >
                <PenLine className="w-4 h-4" />
                Edit Profil
              </Button>
            </div>

            <div className="w-full">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center sm:text-left space-y-1.5">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {profile.name}
                  </h1>
                  <p className="text-muted-foreground/80 font-medium">WORKER</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
