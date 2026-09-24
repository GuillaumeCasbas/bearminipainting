import { DataManagementRepository } from '@/core/ports/data-management.repository';
import { Project } from '@/core/entities/Project';

export class LocalStorageDataManagementRepository implements DataManagementRepository {
  private readonly STORAGE_KEY = 'minipaint_projects';

  async getAll(): Promise<string> {
    return localStorage.getItem(this.STORAGE_KEY) ?? '[]';
  }

  async replaceAll(projects: Project[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
