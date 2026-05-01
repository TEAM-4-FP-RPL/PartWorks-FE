'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Spinner } from './ui/spinner';

export default function AuthInitializer() {
  const { initToken, role, isLoading } = useAuthStore();

  useEffect(() => {
    initToken();
  }, []);

  if (isLoading) {
    return (
      <div className="inset-0 w-full h-screen overflow-hidden flex justify-center items-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return null;
}
