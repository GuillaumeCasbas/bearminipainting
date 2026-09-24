import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsPage } from '../../../src/ui/components/SettingsPage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the store
const mockExportData = jest.fn();
const mockImportData = jest.fn();
const mockAddToast = jest.fn();

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    const state = {
      exportData: mockExportData,
      importData: mockImportData,
      addToast: mockAddToast,
    };
    return selector ? selector(state) : state;
  },
}));

// Mock URL.createObjectURL / revokeObjectURL for download tests
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();
URL.createObjectURL = mockCreateObjectURL;
URL.revokeObjectURL = mockRevokeObjectURL;

describe('SettingsPage (BEA-46)', () => {
  const validBackup = JSON.stringify([
    { id: 'p1', name: 'Project', code: 'P1', units: [] },
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the page with export and import sections', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Export data' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Import data' })).toBeInTheDocument();
    expect(screen.getByText(/Download all your painting data/)).toBeInTheDocument();
    expect(screen.getByText(/restore it on another device/)).toBeInTheDocument();
  });

  it('downloads a minipaint-export-YYYY-MM-DD.json file and shows a success toast on export', async () => {
    mockExportData.mockResolvedValue('[]');

    render(<SettingsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Export data' }));

    await waitFor(() => {
      expect(mockExportData).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(mockAddToast).toHaveBeenCalledWith('success', 'Data exported successfully');
    });
  });

  it('shows an error toast when the export fails', async () => {
    mockExportData.mockRejectedValue(new Error('boom'));

    render(<SettingsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Export data' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('error', 'Failed to export data');
    });
  });

  it('shows an import confirmation warning before importing and cancels without data change', async () => {
    render(<SettingsPage />);

    const fileInput = screen.getByLabelText(/Choose a JSON file/i) as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [new File([validBackup], 'backup.json', { type: 'application/json' })] },
    });

    // Confirmation dialog appears with a clear warning
    expect(
      screen.getByText(/ALL your current data will be replaced/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // No import performed
    expect(mockImportData).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText(/ALL your current data will be replaced/i),
      ).not.toBeInTheDocument();
    });
  });

  it('imports the file data after explicit confirmation and shows a success toast', async () => {
    mockImportData.mockResolvedValue(true);

    render(<SettingsPage />);

    const fileInput = screen.getByLabelText(/Choose a JSON file/i) as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: { files: [new File([validBackup], 'backup.json', { type: 'application/json' })] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Replace all data' }));

    await waitFor(() => {
      expect(mockImportData).toHaveBeenCalledWith(validBackup);
      expect(mockAddToast).toHaveBeenCalledWith('success', 'Data imported successfully');
    });
  });

  it('shows an error toast and clears the dialog when the import is rejected', async () => {
    mockImportData.mockResolvedValue(false);

    render(<SettingsPage />);

    const fileInput = screen.getByLabelText(/Choose a JSON file/i) as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: { files: [new File([validBackup], 'backup.json', { type: 'application/json' })] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Replace all data' }));

    await waitFor(() => {
      expect(mockImportData).toHaveBeenCalledTimes(1);
      // The store already shows the error toast; the dialog is closed
      expect(
        screen.queryByText(/ALL your current data will be replaced/i),
      ).not.toBeInTheDocument();
    });
  });
});
