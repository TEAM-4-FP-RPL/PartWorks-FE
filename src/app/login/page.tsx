'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { actions } from '@/store/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = email.startsWith('employer') ? 'employer' : 'job_seeker';
    const name = email.split('@')[0] || 'User';
    actions.login(role, name);
    router.push(role === 'employer' ? '/employer' : '/jobs');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold">Masuk ke PartIn</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lanjutkan pencarian kerja part-time-mu
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Masuk
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Daftar
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Demo: gunakan email diawali employer untuk masuk sebagai employer.
          </p>
        </div>
      </div>
    </div>
  );
}
