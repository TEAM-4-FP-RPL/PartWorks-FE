export const getDayRange = (from: number | null, to: number | null) => {
  if (from === null || to === null) return [];
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
};
