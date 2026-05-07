import { create } from 'zustand';
import { User, UserRole } from '@/types/auth.type';
import { isTokenExpired } from '@/lib/auth';

interface AuthStore {
  token: string | null;
  user: User | null;
  role: UserRole | string;
  isAuthenticated: boolean;
  isLoading: boolean;

  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearToken: () => void;
  initToken: () => void;
  setRole: (role: UserRole | string) => void;
  setLoading: (loading: boolean) => void;

  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  isEmployer: () => boolean;
  isWorker: () => boolean;
}

const setTokenCookie = (token: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=86400`;
  }
};

const clearTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; max-age=0';
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  role: '',
  isAuthenticated: false,
  isLoading: true,

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    setTokenCookie(token);
    set({ token, isAuthenticated: true });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, role: user.role });
  },

  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearTokenCookie();
    set({
      token: null,
      user: null,
      role: '',
      isAuthenticated: false,
    });
  },

  setRole: (role: UserRole | string) => {
    set({ role });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initToken: () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && !isTokenExpired(savedToken)) {
      setTokenCookie(savedToken);
      const user: User | null = savedUser ? JSON.parse(savedUser) : null;

      set({
        token: savedToken,
        user,
        role: user?.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      clearTokenCookie();
      set({
        token: null,
        role: '',
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  hasRole: (requiredRole: UserRole | UserRole[]): boolean => {
    const { role } = get();

    const roles = Array.isArray(requiredRole)
      ? requiredRole.map((r) => r.toLowerCase())
      : [requiredRole.toLowerCase()];

    return roles.includes(role.toLowerCase());
  },

  isEmployer: (): boolean => {
    return get().role.toLowerCase() === UserRole.EMPLOYER;
  },

  isWorker: (): boolean => {
    return get().role.toLowerCase() === UserRole.WORKER;
  },
}));
