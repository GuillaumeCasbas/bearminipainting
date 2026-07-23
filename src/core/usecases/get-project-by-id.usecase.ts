import { ProjectRepository } from '../ports/project.repository';
import { Project } from '../entities/Project';

export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return await this.projectRepository.findById(id);
  }
}
