export function generateNextId(prefix: string, existingIds: string[]): string {
  const numbers = existingIds
    .map(id => {
      const match = id.match(new RegExp(`${prefix}-(\\d+)`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));

  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNum = maxNum + 1;
  return `${prefix}-${String(nextNum).padStart(3, '0')}`;
}

export function validateNik(nik: string): { isValid: boolean; message?: string } {
  if (!nik) return { isValid: false, message: 'NIK wajib diisi' };
  if (!/^\d{16}$/.test(nik)) {
    return { isValid: false, message: 'NIK harus terdiri dari tepat 16 angka' };
  }
  return { isValid: true };
}
