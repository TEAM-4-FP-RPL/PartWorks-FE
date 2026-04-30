'use client';

import Link from 'next/link';
import { Briefcase, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormRegister } from '@/features/auth/hooks/useFormRegister';

export default function RegisterPage() {
  const {
    role,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    onSubmit,
  } = useFormRegister();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold">Daftar PartWorks</h1>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {(
              [
                { v: 'worker', label: 'Saya pencari kerja', icon: Search },
                { v: 'employer', label: 'Saya employer', icon: Briefcase },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const active = role === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setValue('role', opt.v)}
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
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="kamu@email.com"
                className="px-2"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="px-2"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
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
