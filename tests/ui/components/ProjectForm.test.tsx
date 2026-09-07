import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectForm } from '../../../src/ui/components/ProjectForm';

// Mock the useProjectStore
const mockAddProject = jest.fn();
const mockUseProjectStore = jest.fn();

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => mockUseProjectStore(),
}));

describe('ProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProjectStore.mockReturnValue({
      addProject: mockAddProject,
      isLoading: false,
    });
  });

  it('should render the form with all fields', () => {
    render(<ProjectForm />);

    expect(screen.getByText('Create a new project')).toBeInTheDocument();
    expect(screen.getByLabelText('Project name')).toBeInTheDocument();
    expect(screen.getByLabelText('Unique code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Orks Army')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. ORK-001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
  });

  it('should update input values when typed', () => {
    render(<ProjectForm />);

    const nameInput = screen.getByLabelText('Project name');
    const codeInput = screen.getByLabelText('Unique code');

    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    fireEvent.change(codeInput, { target: { value: 'TEST-001' } });

    expect(nameInput).toHaveValue('Test Project');
    expect(codeInput).toHaveValue('TEST-001');
  });

  it('should call addProject when form is submitted', async () => {
    render(<ProjectForm />);

    const nameInput = screen.getByLabelText('Project name');
    const codeInput = screen.getByLabelText('Unique code');

    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    fireEvent.change(codeInput, { target: { value: 'TEST-001' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

    await waitFor(() => {
      expect(mockAddProject).toHaveBeenCalledWith('Test Project', 'TEST-001');
    });
  });

  it('should clear inputs after form submission', async () => {
    render(<ProjectForm />);

    const nameInput = screen.getByLabelText('Project name');
    const codeInput = screen.getByLabelText('Unique code');

    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    fireEvent.change(codeInput, { target: { value: 'TEST-001' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(codeInput).toHaveValue('');
    });
  });

  it('should disable inputs and button when isLoading is true', () => {
    mockUseProjectStore.mockReturnValue({
      addProject: mockAddProject,
      isLoading: true,
    });

    render(<ProjectForm />);

    const nameInput = screen.getByLabelText('Project name');
    const codeInput = screen.getByLabelText('Unique code');
    const submitButton = screen.getByRole('button', { name: /Creating.../ });

    expect(nameInput).toBeDisabled();
    expect(codeInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });

  it('should display "Create Project" button text when not loading', () => {
    render(<ProjectForm />);

    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
  });

  describe('Name validation (BEA-18)', () => {
    it('should display error message when name is empty on submit', async () => {
      render(<ProjectForm />);

      const nameInput = screen.getByLabelText('Project name');
      const codeInput = screen.getByLabelText('Unique code');

      // Enter only code, leave name empty
      fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument();
      });
    });

    it('should display error message when name is whitespace-only on submit', async () => {
      render(<ProjectForm />);

      const nameInput = screen.getByLabelText('Project name');
      const codeInput = screen.getByLabelText('Unique code');

      // Enter only whitespace for name
      fireEvent.change(nameInput, { target: { value: '   ' } });
      fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument();
      });
    });

    it('should not display error when name is valid', async () => {
      render(<ProjectForm />);

      const nameInput = screen.getByLabelText('Project name');
      const codeInput = screen.getByLabelText('Unique code');

      fireEvent.change(nameInput, { target: { value: 'Valid Project' } });
      fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

      await waitFor(() => {
        expect(screen.queryByText('Project name is required')).not.toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing in name field', async () => {
      render(<ProjectForm />);

      const nameInput = screen.getByLabelText('Project name');
      const codeInput = screen.getByLabelText('Unique code');

      // Submit with empty name to show error
      fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument();
      });

      // Start typing in name field
      fireEvent.change(nameInput, { target: { value: 'A' } });

      await waitFor(() => {
        expect(screen.queryByText('Project name is required')).not.toBeInTheDocument();
      });
    });

    it('should not call addProject when name is empty', async () => {
      render(<ProjectForm />);

      const codeInput = screen.getByLabelText('Unique code');

      fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

      await waitFor(() => {
        expect(mockAddProject).not.toHaveBeenCalled();
      });
    });
  });
});
