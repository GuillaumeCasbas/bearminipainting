import { useUiPreferencesStore } from '@/ui/stores/uiPreferencesStore';
import { uiPreferencesRepository } from '@/di/container';

jest.mock('@/di/container', () => ({
  uiPreferencesRepository: {
    getHideDoneTodos: jest.fn(),
    setHideDoneTodos: jest.fn(),
  },
}));

const mockGetHideDoneTodos = uiPreferencesRepository.getHideDoneTodos as jest.Mock;
const mockSetHideDoneTodos = uiPreferencesRepository.setHideDoneTodos as jest.Mock;

describe('useUiPreferencesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to default state between tests
    useUiPreferencesStore.setState({ hideDoneTodos: false });
    mockGetHideDoneTodos.mockResolvedValue(false);
    mockSetHideDoneTodos.mockResolvedValue(undefined);
  });

  describe('Default state', () => {
    it('should default hideDoneTodos to false (all todos visible)', () => {
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

    it('should persist the preference through the port', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(true);
      expect(mockSetHideDoneTodos).toHaveBeenCalledWith(true);
    });

    it('should persist false through the port', () => {
      useUiPreferencesStore.getState().setHideDoneTodos(false);
      expect(mockSetHideDoneTodos).toHaveBeenCalledWith(false);
    });

    it('should update state optimistically even if the port rejects', () => {
      mockSetHideDoneTodos.mockRejectedValue(new Error('storage error'));
      useUiPreferencesStore.getState().setHideDoneTodos(true);
      // State is updated optimistically regardless of persistence failure
      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(true);
    });
  });

  describe('initFromStorage', () => {
    it('should restore hideDoneTodos=true from the port', async () => {
      mockGetHideDoneTodos.mockResolvedValue(true);
      await useUiPreferencesStore.getState().initFromStorage();
      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(true);
    });

    it('should restore hideDoneTodos=false from the port', async () => {
      useUiPreferencesStore.setState({ hideDoneTodos: true });
      mockGetHideDoneTodos.mockResolvedValue(false);
      await useUiPreferencesStore.getState().initFromStorage();
      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });

    it('should set false when the port returns false (no stored value)', async () => {
      mockGetHideDoneTodos.mockResolvedValue(false);
      await useUiPreferencesStore.getState().initFromStorage();
      expect(useUiPreferencesStore.getState().hideDoneTodos).toBe(false);
    });
  });
});
