'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile';
import { useEmployerProfile } from '@/features/profile/hooks/useEmployerProfile';

export function Navbar() {
  const { role, user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const { data: workerProfile } = useWorkerProfile();
  const { data: employerProfile } = useEmployerProfile();

  const photoUrl =
    role === 'worker'
      ? workerProfile?.photo_url
      : role === 'employer'
        ? employerProfile?.logo_url
        : null;

  const displayName =
    role === 'worker'
      ? workerProfile?.full_name
      : role === 'employer'
        ? employerProfile?.company_name
        : user?.display_name;

  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/jobs', label: 'Lowongan' },
    ...(role === 'employer'
      ? [{ href: '/employer/jobs', label: 'Dashboard' }]
      : []),
    ...(role === 'worker'
      ? [{ href: '/worker/applications', label: 'Lamaran' }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </span>
          <p>PartWorks</p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md hidden md:inline-flex"
                asChild
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-md hidden md:inline-flex"
                asChild
              >
                <Link href="/register">Mendaftar</Link>
              </Button>
            </>
          ) : (
            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border hover:opacity-80 transition-opacity overflow-hidden"
              title="Profil Anda"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName || 'Profil'}
                  className="w-full h-full object-cover"
                />
              ) : displayName ? (
                <span className="text-sm font-bold text-muted-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </Link>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-md"
                asChild
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button size="sm" className="flex-1 rounded-md" asChild>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Mendaftar
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
