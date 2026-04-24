import { actions, useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Navbar() {
  const { role, userName } = useStore();
  const navigate = useRouter();

  const handleLogout = () => {
    actions.logout();
    navigate.push('/login');
  };

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
            href="/jobs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Lowongan
          </Link>
          {role === 'job_seeker' && (
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Profil
            </Link>
          )}
          {role === 'employer' && (
            <Link
              href="/employer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {role === 'guest' ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-md">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" className="rounded-md">
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Halo,{' '}
                <span className="font-medium text-foreground">{userName}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-md"
              >
                Keluar
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
