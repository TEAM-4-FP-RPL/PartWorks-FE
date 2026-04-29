'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@/types/auth.type';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
