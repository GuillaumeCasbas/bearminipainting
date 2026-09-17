import { UiPreferencesRepository } from '@/core/ports/ui-preferences.repository';

const STORAGE_KEY = 'minipaint_ui_preferences';

interface StoredUiPreferences {
  hideDoneTodos: boolean;
}

export class LocalStorageUiPreferencesRepository implements UiPreferencesRepository {
  async getHideDoneTodos(): Promise<boolean> {
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

  async setHideDoneTodos(value: boolean): Promise<void> {
    try {
      const data: StoredUiPreferences = { hideDoneTodos: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently ignore storage errors (UI preference is non-critical)
    }
  }
}
