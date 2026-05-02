'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Banknote, 
  Clock, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  FileText, 
  User 
} from 'lucide-react';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { jobs } = useStore();
  const [mounted, setMounted] = useState(false);

  const job = jobs.find((j) => j.id === id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Lowongan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-6">Pekerjaan yang Anda cari tidak ada atau sudah dihapus.</p>
        <Button onClick={() => router.back()} className="bg-blue-600 text-white font-bold h-10 px-6 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      
      {}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2 mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
            {job.company}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl mt-1 leading-tight">
            {job.title}
          </h1>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        
        {}
        <div className="md:col-span-2 space-y-8">
          
          {}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase">
              Ringkasan Pekerjaan
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Lokasi</span>
                  <span className="font-semibold text-slate-900">{job.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Gaji</span>
                  <span className="font-semibold text-slate-900">
                    Rp {job.payRate.toLocaleString()} / {job.payType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Jadwal</span>
                  <span className="font-semibold text-slate-900">
                    {Array.isArray(job.shifts) ? job.shifts.join(', ') : 'Tersedia'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Durasi</span>
                  <span className="font-semibold text-slate-900">{job.duration || 'Penuh Waktu'}</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Deskripsi Pekerjaan
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {job.description || 'Tidak ada deskripsi rinci untuk pekerjaan ini saat ini.'}
            </p>
          </div>

          {}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Persyaratan & Kualifikasi
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 list-inside list-disc">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, index) => (
                  <li key={index} className="ml-1">{req}</li>
                ))
              ) : (
                <li>Tidak ada spesifikasi kualifikasi yang dicantumkan.</li>
              )}
            </ul>
          </div>
        </div>

        {}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Status Lowongan
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider block w-fit mt-1 text-center">
                Lowongan Buka
              </Badge>
            </div>

        <div className="border-t border-slate-100 pt-6">
              <Button
                className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm gap-2"
                onClick={() => {
                  router.push(`/jobs/apply/${job.id}`);
                }}
              >
                <User className="w-4 h-4" /> Lamar Pekerjaan Ini
              </Button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}