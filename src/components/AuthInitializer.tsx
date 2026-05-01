'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthInitializer() {
  const { initToken, role } = useAuthStore();
  console.log('Role from auth store:', role);

  useEffect(() => {
    initToken();
  }, []);

  return null;
}
