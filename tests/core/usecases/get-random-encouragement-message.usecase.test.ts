// Jest will automatically use src/data/__mocks__/encouragement-messages.ts
jest.mock('../../../src/data/encouragement-messages');

import { GetRandomEncouragementMessageUseCase } from '../../../src/core/usecases/get-random-encouragement-message.usecase';
import { EncouragementRepository } from '../../../src/core/ports/encouragement.repository';

describe('GetRandomEncouragementMessageUseCase', () => {
  const mockRepository: EncouragementRepository = {
    getRecentlyDisplayed: jest.fn(),
    markAsDisplayed: jest.fn(),
    cleanOldMessages: jest.fn(),
  };

  const useCase = new GetRandomEncouragementMessageUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a message not recently displayed', async () => {
    (mockRepository.getRecentlyDisplayed as jest.Mock).mockResolvedValue(['enc-1']);
    (mockRepository.markAsDisplayed as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(result.id).not.toBe('enc-1');
    expect(['enc-2', 'enc-3']).toContain(result.id);
    expect(mockRepository.markAsDisplayed).toHaveBeenCalledWith(result.id);
  });

  it('should clean cache and retry if all messages were recently displayed', async () => {
    (mockRepository.getRecentlyDisplayed as jest.Mock)
      .mockResolvedValueOnce(['enc-1', 'enc-2', 'enc-3'])
      .mockResolvedValueOnce([]);

    (mockRepository.cleanOldMessages as jest.Mock).mockResolvedValue(undefined);
    (mockRepository.markAsDisplayed as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(mockRepository.cleanOldMessages).toHaveBeenCalled();
    expect(mockRepository.getRecentlyDisplayed).toHaveBeenCalledTimes(2);
    expect(mockRepository.markAsDisplayed).toHaveBeenCalled();
  });

  it('should mark the returned message as displayed', async () => {
    (mockRepository.getRecentlyDisplayed as jest.Mock).mockResolvedValue([]);
    (mockRepository.markAsDisplayed as jest.Mock).mockResolvedValue(undefined);

    await useCase.execute();

    expect(mockRepository.markAsDisplayed).toHaveBeenCalled();
  });
});
