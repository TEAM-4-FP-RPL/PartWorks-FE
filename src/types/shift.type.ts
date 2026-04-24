export type Shift = 'all' | 'pagi' | 'siang' | 'malam' | 'weekend';

export const SHIFTS: { value: Shift; label: string }[] = [
  { value: 'pagi', label: 'Pagi' },
  { value: 'siang', label: 'Siang' },
  { value: 'malam', label: 'Malam' },
  { value: 'weekend', label: 'Weekend' },
];
export const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
