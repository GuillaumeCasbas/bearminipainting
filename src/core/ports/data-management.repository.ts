import { StoredProjectData } from '../entities/backup-data';

export interface DataManagementRepository {
  getAllRaw(): Promise<string>;
  replaceAll(projects: StoredProjectData[]): Promise<void>;
}
