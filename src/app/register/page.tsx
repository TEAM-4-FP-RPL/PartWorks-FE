'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { actions } from '@/store/store';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.login(role, name || email.split('@')[0]);
    router.push(role === 'employer' ? '/employer' : '/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold">Daftar PartIn</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mulai gratis dalam 30 detik
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {(
              [
                { v: 'job_seeker', label: 'Saya pencari kerja', icon: Search },
                { v: 'employer', label: 'Saya employer', icon: Briefcase },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const active = role === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setRole(opt.v)}
                  className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${
                    active
                      ? 'border-primary bg-primary-soft'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
              />
            </div>
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
              Buat akun
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
