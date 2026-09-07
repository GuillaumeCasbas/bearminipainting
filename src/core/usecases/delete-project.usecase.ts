import { ProjectRepository } from '../ports/project.repository';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectId: string): Promise<void> {
    await this.projectRepository.delete(projectId);
  }
}
