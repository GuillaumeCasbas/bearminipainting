import { ProjectRepository } from '../ports/project.repository';
import { ProjectNotFoundError } from '../errors';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }
    await this.projectRepository.delete(projectId);
  }
}
