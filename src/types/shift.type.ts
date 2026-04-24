export type Shift = 'all' | 'morning' | 'afternoon' | 'evening' | 'weekend';

export const SHIFTS: { value: Shift; label: string }[] = [
  { value: 'morning', label: 'Pagi' },
  { value: 'afternoon', label: 'Siang' },
  { value: 'evening', label: 'Malam' },
  { value: 'weekend', label: 'Weekend' },
];
export const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
