'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Briefcase, User, Mail, Phone, FileText, MapPin, Banknote, Clock, Upload } from 'lucide-react';

export default function QuickApplyPage() {
  const router = useRouter();
  const { id } = useParams();
  const { jobs } = useStore();
  const [mounted, setMounted] = useState(false);
  const job = jobs.find((j) => j.id === id);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    resumeFile: null as File | null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Lowongan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-6">Pekerjaan yang Anda lamar tidak tersedia.</p>
        <Button onClick={() => router.back()} className="bg-blue-600 text-white font-bold h-10 px-6 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI
        </Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Hanya format file PDF yang diperbolehkan.');
        e.target.value = ''; 
        setForm({ ...form, resumeFile: null });
        return;
      }
      setForm({ ...form, resumeFile: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resumeFile) {
      alert('Silakan unggah dokumen PDF lamaran Anda terlebih dahulu.');
      return;
    }
    
    alert(`Lamaran untuk posisi ${job.title} berhasil dikirim beserta dokumen ${form.resumeFile.name}!`);
    router.push('/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      
      {}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
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
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl mt-1 leading-tight">
            Lamar: {job.title}
          </h1>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        
        {}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-600" /> Informasi Pelamar
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Lengkap
                </Label>
                <Input 
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda" 
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Label>
                  <Input 
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contoh@email.com" 
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Nomor Telepon
                  </Label>
                  <Input 
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08123456789" 
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Pengalaman Kerja (Tahun)
                </Label>
                <Input 
                  required
                  type="number"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Contoh: 1" 
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600" 
                />
              </div>

              {}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Unggah Berkas Lamaran (PDF)
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input 
                      required
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-11 rounded-xl border-slate-200 cursor-pointer p-1"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {form.resumeFile ? form.resumeFile.name : "Maks. 5MB"}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 mt-4"
            >
              <Send className="w-4 h-4" /> KIRIM LAMARAN
            </Button>
          </form>
        </div>

        {}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-6">
            <div className="p-3 bg-blue-50/75 w-fit rounded-2xl text-blue-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {job.company}
              </p>
              <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                {job.title}
              </h4>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Banknote className="w-3.5 h-3.5 text-slate-400" /> 
                Rp {job.payRate.toLocaleString()} / {job.payType}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> 
                {Array.isArray(job.shifts) ? job.shifts.join(', ') : 'Tersedia'}
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}