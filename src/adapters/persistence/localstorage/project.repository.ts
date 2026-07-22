import { ProjectRepository } from '../../../core/ports/project.repository';
import { Project } from '../../../core/entities/Project';

export default class LocalStorageProjectRepository implements ProjectRepository {
  private readonly STORAGE_KEY = 'minipaint_projects';

  async save(project: Project): Promise<void> {
    const projects = this.getAllFromStorage();
    const updatedProjects = [
      ...projects.filter((p) => p.id !== project.id),
      project,
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  async findByCode(code: string): Promise<Project | null> {
    const projects = this.getAllFromStorage();
    return projects.find((p) => p.code === code) ?? null;
  }

  async findAll(): Promise<Project[]> {
    return this.getAllFromStorage();
  }

  private getAllFromStorage(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);
      return parsed.map(
        (item: { id: string; name: string; code: string; units: unknown[] }) =>
          new Project(item.id, item.name, item.code, item.units ?? [])
      );
    } catch {
      return [];
    }
  }
}
