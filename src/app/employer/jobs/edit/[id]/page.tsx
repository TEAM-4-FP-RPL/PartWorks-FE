'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore, actions } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import { JobCategory } from '@/types/job.type';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();
  const { jobs } = useStore();

  const jobToEdit = jobs.find((j) => j.id === id);
  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    payRate: '',
    schedule: '',
  });

  useEffect(() => {
    if (jobToEdit) {
      setForm({
        title: jobToEdit.title || '',
        category: jobToEdit.category || '',
        location: jobToEdit.location || '',
        payRate: jobToEdit.payRate?.toString() || '',
        schedule: jobToEdit.shifts?.[0] || '',
      });
    }
  }, [jobToEdit]);

  const handleUpdate = () => {
    if (!jobToEdit) return;

    actions.updateJob({
      ...jobToEdit,
      title: form.title,
      category: form.category as JobCategory,
      location: form.location,
      payRate: Number(form.payRate),
      shifts: [form.schedule as any],
    });
    router.push('/employer/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {}
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="rounded-full gap-2 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI KE DASHBOARD
        </Button>

        <div className="rounded-[2rem] border-2 border-slate-100 shadow-none overflow-hidden bg-white">
          
          {}
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">EDIT LOWONGAN</h2>
              <p className="text-slate-500 text-sm">Perbarui informasi pekerjaan untuk lowongan ini.</p>
            </div>
          </div>

          {}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Judul Lowongan
                </Label>
                <Input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="Contoh: Barista Part-time" 
                  className="h-12 rounded-xl border-slate-200" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Kategori
                  </Label>
                  <Input 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                    placeholder="Contoh: F&B, Retail" 
                    className="h-12 rounded-xl border-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Lokasi
                  </Label>
                  <Input 
                    value={form.location} 
                    onChange={(e) => setForm({ ...form, location: e.target.value })} 
                    placeholder="Contoh: Jakarta Pusat" 
                    className="h-12 rounded-xl border-slate-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Gaji / Upah
                </Label>
                <Input 
                  value={form.payRate} 
                  onChange={(e) => setForm({ ...form, payRate: e.target.value })} 
                  placeholder="Contoh: 25000" 
                  className="h-12 rounded-xl border-slate-200" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Jadwal Kerja
                </Label>
                <Input 
                  value={form.schedule} 
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })} 
                  placeholder="Contoh: Senin - Jumat (08:00 - 12:00)" 
                  className="h-12 rounded-xl border-slate-200" 
                />
              </div>

            </div>

            {}
            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="flex-1 h-12 rounded-xl font-bold border-slate-200"
              >
                BATAL
              </Button>
              <Button 
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2" 
                onClick={handleUpdate}
              >
                <Save className="w-4 h-4" /> SIMPAN PERUBAHAN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}