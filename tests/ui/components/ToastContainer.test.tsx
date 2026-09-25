import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastContainer from '../../../src/ui/components/Toast';
import { ToastNotification } from '../../../src/ui/stores/projectStore';

// Mock the useProjectStore
const mockRemoveToast = jest.fn();
const mockUseProjectStore = jest.fn();

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => mockUseProjectStore(),
}));

// Helper to create a test toast
const createTestToast = (overrides = {}): ToastNotification => {
  return {
    id: 'toast-1',
    type: 'success',
    message: 'Test message',
    ...overrides,
  };
};

describe('ToastContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not render any alert when there are no toasts', () => {
    mockUseProjectStore.mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['success', 'error', 'info'] as const)(
    'should render a %s toast with its message',
    (type) => {
      const toast = createTestToast({ type });

      mockUseProjectStore.mockReturnValue({
        toasts: [toast],
        removeToast: mockRemoveToast,
      });

      render(<ToastContainer />);

      expect(screen.getByRole('alert')).toHaveTextContent('Test message');
    },
  );

  it('should render multiple toasts', () => {
    const toast1 = createTestToast({ id: 'toast-1', message: 'Message 1' });
    const toast2 = createTestToast({ id: 'toast-2', message: 'Message 2' });

    mockUseProjectStore.mockReturnValue({
      toasts: [toast1, toast2],
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });

  it('should call removeToast when close button is clicked', () => {
    const toast = createTestToast();

    mockUseProjectStore.mockReturnValue({
      toasts: [toast],
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
  });

  it('should auto-remove toasts after 5 seconds', async () => {
    const toast = createTestToast();

    mockUseProjectStore.mockReturnValue({
      toasts: [toast],
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);

    // Wait for useEffect to run
    await waitFor(() => {
      expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
    });
  });
});
