import { useSyncExternalStore } from 'react';
import type { Application, Job, Role } from '@/types/shift.type.';

const SEED_JOBS: Job[] = [
  {
    id: '1',
    employerId: 'e1',
    company: 'Kopi Senja',
    title: 'Barista Part-time',
    category: 'F&B',
    location: 'Jakarta Selatan',
    description:
      'Membantu meracik kopi dan melayani pelanggan di coffee shop kami yang ramai. Cocok untuk mahasiswa atau yang mencari pekerjaan fleksibel.',
    requirements: [
      'Ramah dan komunikatif',
      'Pengalaman barista (preferred)',
      'Bisa kerja shift',
    ],
    payRate: 25000,
    payType: 'hourly',
    shifts: ['morning', 'afternoon'],
    duration: '3 bulan',
    createdAt: '2025-04-20T08:00:00Z',
  },
  {
    id: '2',
    employerId: 'e2',
    company: 'Tokopedia Warehouse',
    title: 'Staff Gudang Weekend',
    category: 'Logistik',
    location: 'Bekasi',
    description:
      'Mengelola pengemasan dan pengiriman barang di gudang. Kerja hanya weekend, cocok untuk pekerja sampingan.',
    requirements: ['Fisik sehat', 'Bisa angkat barang', 'Disiplin'],
    payRate: 200000,
    payType: 'daily',
    shifts: ['weekend'],
    duration: '1 bulan',
    createdAt: '2025-04-22T10:00:00Z',
  },
  {
    id: '3',
    employerId: 'e3',
    company: 'Studio Kreasi',
    title: 'Social Media Admin (Remote)',
    category: 'Remote',
    location: 'Remote',
    description:
      'Mengelola konten Instagram dan TikTok, scheduling post, dan reply DM. Bisa dikerjakan dari rumah.',
    requirements: [
      'Aktif di sosmed',
      'Bisa Canva',
      'Punya laptop & internet stabil',
    ],
    payRate: 30000,
    payType: 'hourly',
    shifts: ['morning', 'afternoon', 'evening'],
    duration: '2 bulan',
    createdAt: '2025-04-23T09:00:00Z',
  },
  {
    id: '4',
    employerId: 'e4',
    company: 'Uniqlo Plaza Indonesia',
    title: 'Sales Associate',
    category: 'Retail',
    location: 'Jakarta Pusat',
    description:
      'Melayani customer, menata display, dan stock opname. Lingkungan kerja modern dan supportive.',
    requirements: ['Min. SMA', 'Penampilan rapi', 'Suka fashion'],
    payRate: 22000,
    payType: 'hourly',
    shifts: ['afternoon', 'evening', 'weekend'],
    duration: '3 bulan',
    createdAt: '2025-04-21T11:00:00Z',
  },
  {
    id: '5',
    employerId: 'e5',
    company: 'PT Maju Bersama',
    title: 'Data Entry Admin',
    category: 'Admin',
    location: 'Bandung',
    description:
      'Input data customer ke sistem CRM dan filing dokumen. Pekerjaan rapi dan teliti diperlukan.',
    requirements: ['Mahir Excel', 'Teliti', 'Bisa MS Office'],
    payRate: 150000,
    payType: 'daily',
    shifts: ['morning'],
    duration: '2 minggu',
    createdAt: '2025-04-19T07:00:00Z',
  },
  {
    id: '6',
    employerId: 'e1',
    company: 'Kopi Senja',
    title: 'Kasir Malam',
    category: 'F&B',
    location: 'Jakarta Selatan',
    description: 'Operasional kasir shift malam. Sistem POS akan ditraining.',
    requirements: ['Jujur', 'Tahan begadang', 'Domisili dekat'],
    payRate: 28000,
    payType: 'hourly',
    shifts: ['evening'],
    duration: '1 bulan',
    createdAt: '2025-04-23T15:00:00Z',
  },
];

const SEED_APPS: Application[] = [
  {
    id: 'a1',
    jobId: '1',
    seekerName: 'Andi Pratama',
    seekerSkills: ['Customer service', 'Latte art'],
    seekerAvailability: 'Sen-Jum, Pagi',
    status: 'viewed',
    appliedAt: '2025-04-23T12:00:00Z',
  },
  {
    id: 'a2',
    jobId: '1',
    seekerName: 'Sari Wulandari',
    seekerSkills: ['Cashier', 'Komunikasi'],
    seekerAvailability: 'Setiap hari, Siang',
    status: 'called',
    appliedAt: '2025-04-22T14:00:00Z',
  },
  {
    id: 'a3',
    jobId: '3',
    seekerName: 'Budi Santoso',
    seekerSkills: ['Canva', 'Copywriting', 'Instagram'],
    seekerAvailability: 'Fleksibel, Remote',
    status: 'sent',
    appliedAt: '2025-04-24T09:00:00Z',
  },
];

interface State {
  role: Role;
  userName: string;
  jobs: Job[];
  applications: Application[];
  appliedJobIds: Set<string>;
}

let state: State = {
  role: 'guest',
  userName: '',
  jobs: SEED_JOBS,
  applications: SEED_APPS,
  appliedJobIds: new Set(),
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const emit = () => listeners.forEach((l) => l());
const getSnapshot = () => state;

function setState(updater: (s: State) => State) {
  state = updater(state);
  emit();
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const actions = {
  login(role: Exclude<Role, 'guest'>, name: string) {
    setState((s) => ({
      ...s,
      role,
      userName: name || (role === 'employer' ? 'Employer' : 'Pencari Kerja'),
    }));
  },
  logout() {
    setState((s) => ({ ...s, role: 'guest', userName: '' }));
  },
  addJob(job: Job) {
    setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
  },
  apply(
    jobId: string,
    seekerName: string,
    skills: string[],
    availability: string
  ) {
    setState((s) => {
      if (s.appliedJobIds.has(jobId)) return s;
      const newApp: Application = {
        id: `a${Date.now()}`,
        jobId,
        seekerName,
        seekerSkills: skills,
        seekerAvailability: availability,
        status: 'sent',
        appliedAt: new Date().toISOString(),
      };
      const next = new Set(s.appliedJobIds);
      next.add(jobId);
      return {
        ...s,
        applications: [newApp, ...s.applications],
        appliedJobIds: next,
      };
    });
  },
  updateAppStatus(appId: string, status: Application['status']) {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === appId ? { ...a, status } : a
      ),
    }));
  },
};
