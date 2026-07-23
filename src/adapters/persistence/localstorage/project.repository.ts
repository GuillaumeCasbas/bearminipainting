import { ProjectRepository } from '../../../core/ports/project.repository';
import { Project } from '../../../core/entities/Project';
import { Unit } from '../../../core/entities/Unit';
import { Todo } from '../../../core/entities/Todo';

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

  async findById(id: string): Promise<Project | null> {
    const projects = this.getAllFromStorage();
    return projects.find((p) => p.id === id) ?? null;
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
      return parsed.map((item: any) => {
        const units = item.units
          ? item.units.map(
              (unitItem: any) =>
                new Unit(
                  unitItem.id,
                  unitItem.name,
                  unitItem.code,
                  unitItem.projectId,
                  unitItem.todos
                    ? unitItem.todos.map(
                        (todoItem: any) =>
                          new Todo(
                            todoItem.id,
                            todoItem.label,
                            todoItem.status as 'TODO' | 'DONE',
                            todoItem.order
                          )
                      )
                    : []
                )
            )
          : [];
        return new Project(item.id, item.name, item.code, units);
      });
    } catch {
      return [];
    }
  }
}
