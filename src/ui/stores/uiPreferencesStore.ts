import { create } from 'zustand';
import { UiPreferencesRepository } from '@/core/ports/ui-preferences.repository';
import { uiPreferencesRepository } from '@/di/container';

interface UiPreferencesStore {
  hideDoneTodos: boolean;
  setHideDoneTodos: (value: boolean) => void;
  initFromStorage: () => Promise<void>;
}

function createUiPreferencesStore(repository: UiPreferencesRepository) {
  return create<UiPreferencesStore>((set) => ({
    hideDoneTodos: false,
    setHideDoneTodos: (value: boolean) => {
      // Persist optimistically; UI preference is non-critical so persistence errors are swallowed.
      repository.setHideDoneTodos(value).catch(() => {
        /* UI preference persistence is non-critical */
      });
      set({ hideDoneTodos: value });
    },
    initFromStorage: async () => {
      const hideDoneTodos = await repository.getHideDoneTodos();
      set({ hideDoneTodos });
    },
  }));
}

export const useUiPreferencesStore = createUiPreferencesStore(uiPreferencesRepository);
