'use client';

import { useAuthStore } from '@/store/auth';
import WorkerProfile from '@/features/profile/components/WorkerProfile';
import EmployerProfile from '@/features/profile/components/EmployerProfile';
import { Navbar } from '@/components/Navbar';

export default function ProfilePage() {
  const { role } = useAuthStore();

  return (
    <>
      <Navbar />
      {role === 'employer' ? <EmployerProfile /> : <WorkerProfile />}
    </>
  );
}
