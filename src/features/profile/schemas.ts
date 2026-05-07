import * as z from 'zod';

export const workerSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong.'),
  bio: z.string().min(1, 'Deskripsi singkat tidak boleh kosong.'),
  skills: z
    .array(z.string())
    .max(5, 'Maksimal hanya 5 skill yang diperbolehkan.'),
  avatar: z.string().optional(),
});

export type WorkerFormValues = z.infer<typeof workerSchema>;

export const employerSchema = z.object({
  name: z.string().min(1, 'Nama Perusahaan tidak boleh kosong.'),
  bio: z.string().min(1, 'Deskripsi Perusahaan tidak boleh kosong.'),
  avatar: z.string().optional(),
});

export type EmployerFormValues = z.infer<typeof employerSchema>;
