import { DataManagementRepository } from '@/core/ports/data-management.repository';
import { StoredProjectData } from '@/core/entities/backup-data';

export class LocalStorageDataManagementRepository implements DataManagementRepository {
  private readonly STORAGE_KEY = 'minipaint_projects';

  async getAllRaw(): Promise<string> {
    return localStorage.getItem(this.STORAGE_KEY) ?? '[]';
  }

  async replaceAll(projects: StoredProjectData[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
