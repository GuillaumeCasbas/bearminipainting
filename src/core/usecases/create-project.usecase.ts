import { Project } from '../entities/Project';
import { ProjectRepository } from '../ports/project.repository';
import { CodeNotUniqueError, ProjectNameRequiredError } from '@/core/errors';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(name: string, code: string): Promise<Project> {
    // Validate name is not empty or whitespace-only
    if (!name || name.trim() === '') {
      throw new ProjectNameRequiredError();
    }

    // Check if code is already used
    const existingProject = await this.projectRepository.findByCode(code);
    if (existingProject) {
      throw new CodeNotUniqueError(code);
    }

    // Create and save the new project
    const id = crypto.randomUUID();
    const newProject = new Project(id, name, code);
    await this.projectRepository.save(newProject);

    return newProject;
  }
}
