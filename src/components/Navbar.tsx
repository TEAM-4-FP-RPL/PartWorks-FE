import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export function Navbar() {
  const { role, user } = useAuthStore();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </span>
          <p>PartWorks</p>
        </Link>

        <nav className="hidden items-center gap-6 md:flex md:justify-end">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Beranda
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Lowongan
          </Link>
          {role === 'employer' && (
            <Link
              href="/employer/jobs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {role === 'worker' && (
            <Link
              href="/worker/applications"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Lamaran
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-md" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" className="rounded-md" asChild>
                <Link href="/register">Mendaftar</Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border hover:opacity-80 transition-opacity"
                title="Profil Anda"
              >
                <User className="w-4 h-4 text-muted-foreground" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
