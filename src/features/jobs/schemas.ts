import z from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Judul harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  category_id: z.number().min(1, 'Kategori harus dipilih'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  salary: z.number().min(1, 'Gaji harus diisi'),
  type: z.enum(['Onsite', 'Remote', 'Hybrid']),
  schedules: z
    .array(
      z.object({
        day: z.string().min(1, 'Hari harus dipilih'),
        start_time: z.string().min(1, 'Jam mulai harus diisi'),
        end_time: z.string().min(1, 'Jam selesai harus diisi'),
      })
    )
    .min(1, 'Minimal 1 jadwal kerja'),
});

export type JobFormValues = z.infer<typeof jobSchema>;
