import { EncouragementMessage } from '../entities/EncouragementMessage';

export interface EncouragementRepository {
  getRecentlyDisplayed(): Promise<string[]>;
  markAsDisplayed(id: string): Promise<void>;
  cleanOldMessages(): Promise<void>;
}
