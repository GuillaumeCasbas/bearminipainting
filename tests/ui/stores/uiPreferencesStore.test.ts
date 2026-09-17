import { useUiPreferencesStore } from '@/ui/stores/uiPreferencesStore';

const STORAGE_KEY = 'minipaint_ui_preferences';

describe('useUiPreferencesStore', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    // Reset store to default state between tests
    useUiPreferencesStore.setState({ hideDoneTodos: false });
    jest.clearAllMocks();
  });

  describe('Default state', () => {
    it('should default hideDoneTodos to false (all todos visible)', () => {
      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });

    it('should return false when no preference is stored (first visit)', () => {
      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });

    it('should return false when stored value is missing', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });

    it('should return false when storage is corrupted', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json');

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });
  });

  describe('setHideDoneTodos', () => {
    it('should update hideDoneTodos to true', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(true);

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(true);
    });

    it('should update hideDoneTodos to false', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(true);
      useUiPreferencesStore.getState().setHideDoneTodos(false);

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });

    it('should persist the preference to localStorage', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.hideDoneTodos).toBe(true);
    });

    it('should persist false to localStorage', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(false);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.hideDoneTodos).toBe(false);
    });
  });

  describe('initFromStorage', () => {
    it('should restore hideDoneTodos=true from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideDoneTodos: true }));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(true);
    });

    it('should restore hideDoneTodos=false from localStorage', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideDoneTodos: false }));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });
  });
});
