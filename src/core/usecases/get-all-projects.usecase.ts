import { ProjectRepository } from '../ports/project.repository';
import { Project } from '../entities/Project';

export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}
