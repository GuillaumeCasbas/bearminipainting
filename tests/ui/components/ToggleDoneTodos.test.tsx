import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToggleDoneTodos } from '../../../src/ui/components/ToggleDoneTodos';

// Mock the store
const mockSetShowDoneTodos = jest.fn();
let mockShowDoneTodos = true;
const mockUseUiPreferencesStore = jest.fn();

jest.mock('../../../src/ui/stores/uiPreferencesStore', () => ({
  useUiPreferencesStore: () => mockUseUiPreferencesStore(),
}));

describe('ToggleDoneTodos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowDoneTodos = true;
    mockUseUiPreferencesStore.mockImplementation(() => ({
      showDoneTodos: mockShowDoneTodos,
      setShowDoneTodos: mockSetShowDoneTodos,
    }));
  });

  it('should render a "Hide done" toggle when DONE todos are visible', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByText('Hide done')).toBeInTheDocument();
  });

  it('should render a "Show done" toggle when DONE todos are hidden', () => {
    mockShowDoneTodos = false;
    mockUseUiPreferencesStore.mockImplementation(() => ({
      showDoneTodos: false,
      setShowDoneTodos: mockSetShowDoneTodos,
    }));

    render(<ToggleDoneTodos />);

    expect(screen.getByText('Show done')).toBeInTheDocument();
  });

  it('should have aria-pressed true when DONE todos are visible', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should have aria-pressed false when DONE todos are hidden', () => {
    mockShowDoneTodos = false;
    mockUseUiPreferencesStore.mockImplementation(() => ({
      showDoneTodos: false,
      setShowDoneTodos: mockSetShowDoneTodos,
    }));

    render(<ToggleDoneTodos />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call setShowDoneTodos(false) when clicked while visible', () => {
    render(<ToggleDoneTodos />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSetShowDoneTodos).toHaveBeenCalledWith(false);
  });

  it('should call setShowDoneTodos(true) when clicked while hidden', () => {
    mockShowDoneTodos = false;
    mockUseUiPreferencesStore.mockImplementation(() => ({
      showDoneTodos: false,
      setShowDoneTodos: mockSetShowDoneTodos,
    }));

    render(<ToggleDoneTodos />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSetShowDoneTodos).toHaveBeenCalledWith(true);
  });

  it('should have an accessible label reflecting the current state', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByLabelText('Hide completed todos')).toBeInTheDocument();
  });

  it('should have an accessible label when hidden', () => {
    mockShowDoneTodos = false;
    mockUseUiPreferencesStore.mockImplementation(() => ({
      showDoneTodos: false,
      setShowDoneTodos: mockSetShowDoneTodos,
    }));

    render(<ToggleDoneTodos />);

    expect(screen.getByLabelText('Show completed todos')).toBeInTheDocument();
  });
});
