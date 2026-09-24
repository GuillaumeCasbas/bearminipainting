import { Project } from '../entities/Project';

export interface DataManagementRepository {
  getAll(): Promise<string>;
  replaceAll(projects: Project[]): Promise<void>;
}
