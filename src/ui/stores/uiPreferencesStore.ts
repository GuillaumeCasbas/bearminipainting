import { create } from 'zustand';

const STORAGE_KEY = 'minipaint_ui_preferences';

interface StoredUiPreferences {
  showDoneTodos: boolean;
}

interface UiPreferencesStore {
  showDoneTodos: boolean;
  setShowDoneTodos: (value: boolean) => void;
  initFromStorage: () => void;
}

function readFromStorage(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return true;
    const parsed = JSON.parse(data) as Partial<StoredUiPreferences>;
    if (parsed.showDoneTodos === undefined || parsed.showDoneTodos === null) {
      return true;
    }
    return parsed.showDoneTodos;
  } catch {
    return true;
  }
}

function persistToStorage(showDoneTodos: boolean): void {
  try {
    const data: StoredUiPreferences = { showDoneTodos };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage errors (UI preference is non-critical)
  }
}

export const useUiPreferencesStore = create<UiPreferencesStore>((set) => ({
  showDoneTodos: true,
  setShowDoneTodos: (value: boolean) => {
    persistToStorage(value);
    set({ showDoneTodos: value });
  },
  initFromStorage: () => {
    set({ showDoneTodos: readFromStorage() });
  },
}));
