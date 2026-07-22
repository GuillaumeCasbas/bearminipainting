import { Project } from '../entities/Project';
import { ProjectRepository } from '../ports/project.repository';
import { CodeNotUniqueError } from '../errors/project.errors';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(name: string, code: string): Promise<Project> {
    // Check if code is already used
    const existingProject = await this.projectRepository.findByCode(code);
    if (existingProject) {
      throw new CodeNotUniqueError(code);
    }

    // Generate UUID for the new project
    const id = crypto.randomUUID();

    // Create and save the new project
    const newProject = new Project(id, name, code);
    await this.projectRepository.save(newProject);

    return newProject;
  }
}
