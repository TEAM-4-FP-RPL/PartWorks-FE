'use client';

import { useAuthStore } from '@/store/auth';
import WorkerEditProfile from '@/features/profile/components/WorkerEditProfile';
import EmployerEditProfile from '@/features/profile/components/EmployerEditProfile';
import { Navbar } from '@/components/Navbar';

export default function EditProfilePage() {
  const { role } = useAuthStore();

  return (
    <>
      <Navbar />
      {role === 'employer' ? <EmployerEditProfile /> : <WorkerEditProfile />}
    </>
  );
}
