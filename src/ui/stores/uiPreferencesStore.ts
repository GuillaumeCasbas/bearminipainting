import { create } from 'zustand';

const STORAGE_KEY = 'minipaint_ui_preferences';

interface StoredUiPreferences {
  hideDoneTodos: boolean;
}

interface UiPreferencesStore {
  hideDoneTodos: boolean;
  setHideDoneTodos: (value: boolean) => void;
  initFromStorage: () => void;
}

function readFromStorage(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    const parsed = JSON.parse(data) as Partial<StoredUiPreferences>;
    if (parsed.hideDoneTodos === undefined || parsed.hideDoneTodos === null) {
      return false;
    }
    return parsed.hideDoneTodos;
  } catch {
    return false;
  }
}

function persistToStorage(hideDoneTodos: boolean): void {
  try {
    const data: StoredUiPreferences = { hideDoneTodos };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage errors (UI preference is non-critical)
  }
}

export const useUiPreferencesStore = create<UiPreferencesStore>((set) => ({
  hideDoneTodos: false,
  setHideDoneTodos: (value: boolean) => {
    persistToStorage(value);
    set({ hideDoneTodos: value });
  },
  initFromStorage: () => {
    set({ hideDoneTodos: readFromStorage() });
  },
}));
