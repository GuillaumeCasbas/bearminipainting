import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EncouragementBanner } from '../../../src/ui/components/EncouragementBanner';
import { GetRandomEncouragementMessageUseCase } from '../../../src/core/usecases/get-random-encouragement-message.usecase';
import { EncouragementMessage } from '../../../src/core/entities/EncouragementMessage';

// Mock messages for testing
const testMessage1 = new EncouragementMessage('test-1', 'Test message 1');
const testMessage2 = new EncouragementMessage('test-2', 'Test message 2');

describe('EncouragementBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with a message', async () => {
    // Mock the use case to return a specific message
    const mockExecute = jest.fn().mockResolvedValue(testMessage1);
    const testUseCase = {
      execute: mockExecute,
    } as unknown as GetRandomEncouragementMessageUseCase;

    render(<EncouragementBanner getRandomMessageUseCase={testUseCase} />);

    await waitFor(() => {
      expect(screen.getByText('Test message 1')).toBeInTheDocument();
    });
  });

  it('should display the refresh button', async () => {
    const mockExecute = jest.fn().mockResolvedValue(testMessage1);
    const testUseCase = {
      execute: mockExecute,
    } as unknown as GetRandomEncouragementMessageUseCase;

    render(<EncouragementBanner getRandomMessageUseCase={testUseCase} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Get another encouragement message')).toBeInTheDocument();
    });
  });

  it('should call execute when refresh button is clicked', async () => {
    const mockExecute = jest.fn()
      .mockResolvedValueOnce(testMessage1)
      .mockResolvedValueOnce(testMessage2);
    const testUseCase = {
      execute: mockExecute,
    } as unknown as GetRandomEncouragementMessageUseCase;

    render(<EncouragementBanner getRandomMessageUseCase={testUseCase} />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Test message 1')).toBeInTheDocument();
    });

    // Click refresh button
    const refreshButton = screen.getByLabelText('Get another encouragement message');
    fireEvent.click(refreshButton);

    // Wait for new message
    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Test message 2')).toBeInTheDocument();
    });
  });

  it('should not render when no message is available', async () => {
    const mockExecute = jest.fn().mockResolvedValue(null);
    const testUseCase = {
      execute: mockExecute,
    } as unknown as GetRandomEncouragementMessageUseCase;

    const { container } = render(
      <EncouragementBanner getRandomMessageUseCase={testUseCase} />
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
