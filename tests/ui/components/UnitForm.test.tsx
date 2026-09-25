import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UnitForm } from '../../../src/ui/components/UnitForm';

describe('UnitForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  const fillAndSubmit = (name: string, code: string) => {
    const [nameInput, codeInput] = screen.getAllByRole('textbox');
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(codeInput, { target: { value: code } });
    // fireEvent.submit bypasses the browser's native required-field validation,
    // letting the component's own validation logic run for empty values too.
    const form = document.getElementsByTagName('form')[0];
    fireEvent.submit(form);
  };

  it('renders name and code fields inside the modal', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Unit')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('calls onSubmit and closes the modal when the code format is valid', async () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('Intercessors', 'INT-01');
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Intercessors', 'INT-01');
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('shows the backend error and keeps the modal open when onSubmit rejects', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('Unit code is not unique'));
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('Intercessors', 'INT-01');
    await waitFor(() => {
      expect(screen.getByText('Unit code is not unique')).toBeInTheDocument();
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it.each(['unit@code', 'unit code', 'unit_code', 'INT 01', 'unit.code'])(
    'shows an error and does not submit when the code contains invalid characters (%s)',
    (code) => {
      render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      fillAndSubmit('Intercessors', code);
      expect(
        screen.getByText(
          'Unit code contains invalid characters. Only letters, numbers and hyphens are allowed.',
        ),
      ).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    },
  );

  it('still shows an error when the name is empty', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('', 'INT-01');
    expect(screen.getByText('Unit name cannot be empty')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('still shows an error when the code is empty', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('Intercessors', '');
    expect(screen.getByText('Unit code cannot be empty')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('accepts codes with only letters, numbers and hyphens', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('Intercessors', 'int-01');
    expect(
      screen.queryByText(/invalid characters/i),
    ).not.toBeInTheDocument();
  });

  it('clears the error when the user fixes the code and submits again', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fillAndSubmit('Intercessors', 'unit@code');
    expect(screen.getByText(/invalid characters/i)).toBeInTheDocument();
    fillAndSubmit('Intercessors', 'INT-01');
    expect(screen.queryByText(/invalid characters/i)).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith('Intercessors', 'INT-01');
  });

  it('shows the hint about allowed characters', () => {
    render(<UnitForm onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(
      screen.getByText('Only letters, numbers, and hyphens allowed'),
    ).toBeInTheDocument();
  });
});
