import { DecodedToken, UserRole } from '@/types/auth.type';

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const getRoleFromToken = (token: string): UserRole | string => {
  const decoded = decodeToken(token);
  return decoded?.role || '';
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const expiry = decoded.exp * 1000;
  return Date.now() >= expiry;
};

export const hasRole = (
  userRole: string | UserRole,
  requiredRole: UserRole | UserRole[]
): boolean => {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole as UserRole);
};
