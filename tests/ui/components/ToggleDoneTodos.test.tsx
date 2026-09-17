import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToggleDoneTodos } from '../../../src/ui/components/ToggleDoneTodos';

// Mock the store
const mockSetHideDoneTodos = jest.fn();
const mockUseUiPreferencesStore = jest.fn();

jest.mock('../../../src/ui/stores/uiPreferencesStore', () => ({
  useUiPreferencesStore: () => mockUseUiPreferencesStore(),
}));

describe('ToggleDoneTodos', () => {
  const mockVisible = () => ({
    hideDoneTodos: false,
    setHideDoneTodos: mockSetHideDoneTodos,
  });
  const mockHidden = () => ({
    hideDoneTodos: true,
    setHideDoneTodos: mockSetHideDoneTodos,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUiPreferencesStore.mockImplementation(mockVisible);
  });

  it('should render a fixed label representing the boolean', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByText('Hide completed todos')).toBeInTheDocument();
  });

  it('should keep the same fixed label when DONE todos are hidden', () => {
    mockUseUiPreferencesStore.mockImplementation(mockHidden);

    render(<ToggleDoneTodos />);

    expect(screen.getByText('Hide completed todos')).toBeInTheDocument();
  });

  it('should have aria-pressed false when DONE todos are visible', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have aria-pressed true when DONE todos are hidden', () => {
    mockUseUiPreferencesStore.mockImplementation(mockHidden);

    render(<ToggleDoneTodos />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call setHideDoneTodos(true) when clicked while visible (turn on hiding)', () => {
    render(<ToggleDoneTodos />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSetHideDoneTodos).toHaveBeenCalledWith(true);
  });

  it('should call setHideDoneTodos(false) when clicked while hidden (turn off hiding)', () => {
    mockUseUiPreferencesStore.mockImplementation(mockHidden);

    render(<ToggleDoneTodos />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSetHideDoneTodos).toHaveBeenCalledWith(false);
  });

  it('should have a fixed accessible label', () => {
    render(<ToggleDoneTodos />);

    expect(screen.getByLabelText('Hide completed todos')).toBeInTheDocument();
  });

  it('should keep the same accessible label when hidden', () => {
    mockUseUiPreferencesStore.mockImplementation(mockHidden);

    render(<ToggleDoneTodos />);

    expect(screen.getByLabelText('Hide completed todos')).toBeInTheDocument();
  });
});
