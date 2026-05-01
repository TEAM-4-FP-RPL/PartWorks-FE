'use client';

import { useAuthStore } from '@/store/auth';
import WorkerEditProfile from '@/features/profile/components/WorkerEditProfile';
import EmployerEditProfile from '@/features/profile/components/EmployerEditProfile';

export default function EditProfilePage() {
  const { role } = useAuthStore();

  return (
    <>{role === 'employer' ? <EmployerEditProfile /> : <WorkerEditProfile />}</>
  );
}
