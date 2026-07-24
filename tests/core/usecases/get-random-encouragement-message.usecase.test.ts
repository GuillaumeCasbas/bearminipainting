// Jest will automatically use src/data/__mocks__/encouragement-messages.ts
jest.mock('../../../src/data/encouragement-messages');

import { GetRandomEncouragementMessageUseCase } from '../../../src/core/usecases/get-random-encouragement-message.usecase';
import { EncouragementRepository } from '../../../src/core/ports/encouragement.repository';

describe('GetRandomEncouragementMessageUseCase', () => {
  let getRecentlyDisplayedCalls = 0;
  let cleanOldMessagesCalled = false;
  let markAsDisplayedCalledWith: string | null = null;
  let getRecentlyDisplayedReturnValues: string[][] = [];
  let returnIndex = 0;

  const mockRepository: EncouragementRepository = {
    getRecentlyDisplayed: async (): Promise<string[]> => {
      getRecentlyDisplayedCalls++;
      return getRecentlyDisplayedReturnValues[returnIndex++] ?? [];
    },
    markAsDisplayed: async (id: string): Promise<void> => {
      markAsDisplayedCalledWith = id;
    },
    cleanOldMessages: async (): Promise<void> => {
      cleanOldMessagesCalled = true;
    },
  };

  const useCase = new GetRandomEncouragementMessageUseCase(mockRepository);

  beforeEach(() => {
    getRecentlyDisplayedCalls = 0;
    cleanOldMessagesCalled = false;
    markAsDisplayedCalledWith = null;
    getRecentlyDisplayedReturnValues = [];
    returnIndex = 0;
  });

  it('should return a message not recently displayed', async () => {
    getRecentlyDisplayedReturnValues = [['enc-1']];

    const result = await useCase.execute();

    expect(result.id).not.toBe('enc-1');
    expect(['enc-2', 'enc-3']).toContain(result.id);
    expect(markAsDisplayedCalledWith).toBe(result.id);
  });

  it('should clean cache and retry if all messages were recently displayed', async () => {
    getRecentlyDisplayedReturnValues = [['enc-1', 'enc-2', 'enc-3'], []];

    const result = await useCase.execute();

    expect(cleanOldMessagesCalled).toBe(true);
    expect(getRecentlyDisplayedCalls).toBe(2);
    expect(markAsDisplayedCalledWith).toBe(result.id);
  });

  it('should mark the returned message as displayed', async () => {
    getRecentlyDisplayedReturnValues = [[]];

    await useCase.execute();

    expect(markAsDisplayedCalledWith).not.toBeNull();
  });
});
