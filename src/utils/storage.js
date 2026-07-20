import { migrateUrduFields } from '../data/fieldOptions';

const STORAGE_KEY = 'punjab-birth-certificate-draft';

export function loadSavedData(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return migrateUrduFields(fallback);
    return migrateUrduFields({ ...fallback, ...JSON.parse(raw) });
  } catch {
    return migrateUrduFields(fallback);
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearSavedData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
