// LocalStorage persistence utility for Kebudayaan NTB Dashboard

export const STORAGE_KEYS = {
  KECAMATAN: 'kebudayaan_ntb_master_kecamatan_v1',
  DESA: 'kebudayaan_ntb_master_desa_v1',
  JENIS_SANGGAR: 'kebudayaan_ntb_master_jenis_sanggar_v1',
  JENIS_SENIMAN: 'kebudayaan_ntb_master_jenis_seniman_v1',
  KATEGORI_KOLEKSI: 'kebudayaan_ntb_master_kategori_koleksi_v1',
  SANGGAR: 'kebudayaan_ntb_sanggar_list_v1',
  SENIMAN: 'kebudayaan_ntb_seniman_list_v1',
  CAGAR: 'kebudayaan_ntb_cagar_list_v1',
  KOLEKSI: 'kebudayaan_ntb_koleksi_list_v1',
  USERS: 'kebudayaan_ntb_users_list_v1',
  CURRENT_USER: 'kebudayaan_ntb_current_user_v1',
  ACTIVITY_LOGS: 'kebudayaan_ntb_activity_logs_v1',
  LAST_SYNCED: 'kebudayaan_ntb_last_synced_v1',
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? (parsed as T) : defaultValue;
  } catch (err) {
    console.warn(`[SI-BUDAYA] Error reading localStorage for key "${key}":`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[SI-BUDAYA] Error writing to localStorage for key "${key}":`, err);
  }
}

export function clearAllAppData(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  Object.values(STORAGE_KEYS).forEach((k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      // ignore
    }
  });
}
