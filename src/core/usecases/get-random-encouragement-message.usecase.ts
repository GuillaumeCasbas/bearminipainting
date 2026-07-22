import { EncouragementMessage } from '../entities/EncouragementMessage';
import { EncouragementRepository } from '../ports/encouragement.repository';
import { ENCOURAGEMENT_MESSAGES } from '../../data/encouragement-messages';

export class GetRandomEncouragementMessageUseCase {
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  constructor(private readonly encouragementRepository: EncouragementRepository) {}

  async execute(): Promise<EncouragementMessage> {
    const recentlyDisplayedIds = await this.encouragementRepository.getRecentlyDisplayed();

    const availableMessages = ENCOURAGEMENT_MESSAGES.filter(
      (msg) => !recentlyDisplayedIds.includes(msg.id)
    );

    if (availableMessages.length === 0) {
      await this.encouragementRepository.cleanOldMessages();
      return this.execute();
    }

    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessage = availableMessages[randomIndex];

    await this.encouragementRepository.markAsDisplayed(selectedMessage.id);

    return selectedMessage;
  }
}
