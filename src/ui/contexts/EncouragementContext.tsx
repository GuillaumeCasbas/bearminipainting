import { createContext, useContext } from 'react';
import { GetRandomEncouragementMessageUseCase } from '../../core/usecases/get-random-encouragement-message.usecase';

export const EncouragementContext = createContext<GetRandomEncouragementMessageUseCase | null>(null);

export function useEncouragementUseCase(): GetRandomEncouragementMessageUseCase {
  const useCase = useContext(EncouragementContext);
  if (!useCase) {
    throw new Error('EncouragementContext.Provider is missing');
  }
  return useCase;
}
