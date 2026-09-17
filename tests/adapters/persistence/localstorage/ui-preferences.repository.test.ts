import { LocalStorageUiPreferencesRepository } from '@/adapters/persistence/localstorage/ui-preferences.repository';

const STORAGE_KEY = 'minipaint_ui_preferences';

describe('LocalStorageUiPreferencesRepository Integration', () => {
  let repository: LocalStorageUiPreferencesRepository;

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    jest.clearAllMocks();
    repository = new LocalStorageUiPreferencesRepository();
  });

  describe('getHideDoneTodos', () => {
    it('should return false when no preference is stored (first visit)', async () => {
      expect(await repository.getHideDoneTodos()).toBe(false);
    });

    it('should return false when stored value is missing', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
      expect(await repository.getHideDoneTodos()).toBe(false);
    });

    it('should return false when storage is corrupted', async () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json');
      expect(await repository.getHideDoneTodos()).toBe(false);
    });

    it('should return true when hideDoneTodos=true is stored', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideDoneTodos: true }));
      expect(await repository.getHideDoneTodos()).toBe(true);
    });

    it('should return false when hideDoneTodos=false is stored', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideDoneTodos: false }));
      expect(await repository.getHideDoneTodos()).toBe(false);
    });

    it('should return false when hideDoneTodos is null', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideDoneTodos: null }));
      expect(await repository.getHideDoneTodos()).toBe(false);
    });
  });

  describe('setHideDoneTodos', () => {
    it('should persist hideDoneTodos=true to localStorage', async () => {
      await repository.setHideDoneTodos(true);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.hideDoneTodos).toBe(true);
    });

    it('should persist hideDoneTodos=false to localStorage', async () => {
      await repository.setHideDoneTodos(false);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
      expect(stored.hideDoneTodos).toBe(false);
    });
  });

  describe('Round-trip', () => {
    it('should read back what was written (true)', async () => {
      await repository.setHideDoneTodos(true);
      expect(await repository.getHideDoneTodos()).toBe(true);
    });

    it('should read back what was written (false)', async () => {
      await repository.setHideDoneTodos(false);
      expect(await repository.getHideDoneTodos()).toBe(false);
    });

    it('should overwrite the previous value', async () => {
      await repository.setHideDoneTodos(true);
      await repository.setHideDoneTodos(false);
      expect(await repository.getHideDoneTodos()).toBe(false);
    });
  });
});
