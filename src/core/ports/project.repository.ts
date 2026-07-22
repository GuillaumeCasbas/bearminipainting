import { Project } from '../entities/Project';

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findByCode(code: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
}
