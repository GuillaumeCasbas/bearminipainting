import { EncouragementRepository } from '../../../core/ports/encouragement.repository';

const STORAGE_KEY = 'minipaint_encouragement_cache';
const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface EncouragementCache {
  [messageId: string]: number; // Timestamp
}

export default class LocalStorageEncouragementRepository implements EncouragementRepository {
  async getRecentlyDisplayed(): Promise<string[]> {
    const cache = this.getCache();
    const now = Date.now();
    return Object.entries(cache)
      .filter(([_, timestamp]) => now - timestamp < TTL_MS)
      .map(([id]) => id);
  }

  async markAsDisplayed(id: string): Promise<void> {
    const cache = this.getCache();
    cache[id] = Date.now();
    this.setCache(cache);
  }

  async cleanOldMessages(): Promise<void> {
    const cache = this.getCache();
    const now = Date.now();
    Object.keys(cache).forEach(id => {
      if (now - cache[id] > TTL_MS) {
        delete cache[id];
      }
    });
    this.setCache(cache);
  }

  private getCache(): EncouragementCache {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private setCache(cache: EncouragementCache): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }
}
