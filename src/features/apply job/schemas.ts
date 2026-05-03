import z from 'zod';

export const applyJobSchema = z.object({
  cv_id: z.string().min(1, 'Silakan pilih CV Anda terlebih dahulu'),
  cover_note: z
    .string()
    .min(1, 'Surat lamaran harus diisi')
    .max(1000, 'Maksimal 1000 karakter'),
});

export type ApplyJobFormValues = z.infer<typeof applyJobSchema>;
