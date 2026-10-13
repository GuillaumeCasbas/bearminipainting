import { Project } from '../entities/Project';
import { ProjectRepository } from '../ports/project.repository';
import { ProjectNotFoundError, ProjectNameRequiredError } from '../errors';

export class UpdateProjectNameUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectId: string, newName: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }
    if (!newName || newName.trim() === '') {
      throw new ProjectNameRequiredError();
    }
    const updatedProject = new Project(project.id, newName.trim(), project.code, project.units);
    await this.projectRepository.save(updatedProject);
    return updatedProject;
  }
}
