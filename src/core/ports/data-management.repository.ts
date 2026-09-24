import { StoredProjectData } from '../entities/backup-data';

export interface DataManagementRepository {
  getAll(): Promise<string>;
  replaceAll(projects: StoredProjectData[]): Promise<void>;
}
