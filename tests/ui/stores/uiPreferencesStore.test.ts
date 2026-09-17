import { useUiPreferencesStore } from '@/ui/stores/uiPreferencesStore';

const STORAGE_KEY = 'minipaint_ui_preferences';

describe('useUiPreferencesStore', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    // Reset store to default state between tests
    useUiPreferencesStore.setState({ showDoneTodos: true });
    jest.clearAllMocks();
  });

  describe('Default state', () => {
    it('should default showDoneTodos to true (all todos visible)', () => {
      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });

    it('should return true when no preference is stored (first visit)', () => {
      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });

    it('should return true when stored value is missing', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });

    it('should return true when storage is corrupted', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json');

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });
  });

  describe('setShowDoneTodos', () => {
    it('should update showDoneTodos to false', () => {
      useUiPreferencesStore.getState().setShowDoneTodos(false);

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(false);
    });

    it('should update showDoneTodos to true', () => {
      useUiPreferencesStore.getState().setShowDoneTodos(false);
      useUiPreferencesStore.getState().setShowDoneTodos(true);

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });

    it('should persist the preference to localStorage', () => {
      useUiPreferencesStore.getState().setShowDoneTodos(false);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.showDoneTodos).toBe(false);
    });

    it('should persist true to localStorage', () => {
      useUiPreferencesStore.getState().setShowDoneTodos(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.showDoneTodos).toBe(true);
    });
  });

  describe('initFromStorage', () => {
    it('should restore showDoneTodos=false from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ showDoneTodos: false }));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(false);
    });

    it('should restore showDoneTodos=true from localStorage', () => {
      useUiPreferencesStore.getState().setShowDoneTodos(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ showDoneTodos: true }));

      useUiPreferencesStore.getState().initFromStorage();

      expect(useUiPreferencesStore.getState().showDoneTodos).toBe(true);
    });
  });
});
