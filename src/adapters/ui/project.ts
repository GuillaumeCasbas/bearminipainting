/**
 * UI Adapter for Project
 * Exposes Core functionality to UI layer without direct Core imports.
 */

// Re-export types and classes needed by UI
import { Project } from '../../core/entities/Project';
import { ProjectRepository } from '../../core/ports/project.repository';
import LocalStorageProjectRepository from '../persistence/localstorage/project.repository';
import { CreateProjectUseCase } from '../../core/usecases/create-project.usecase';
import { GetProjectByIdUseCase } from '../../core/usecases/get-project-by-id.usecase';
import { CodeNotUniqueError } from '../../core/errors/project.errors';

// Export types
export type { ProjectRepository };
export { Project };
export { CodeNotUniqueError };

// Re-export the default repository as both default and named
export default LocalStorageProjectRepository;
export { LocalStorageProjectRepository };

// Factory function to create use case with repository
export function createProjectUseCaseWithRepository(
  repository: ProjectRepository = new LocalStorageProjectRepository()
): CreateProjectUseCase {
  return new CreateProjectUseCase(repository);
}

// Factory function to create get project by id use case with repository
export function createGetProjectByIdUseCaseWithRepository(
  repository: ProjectRepository = new LocalStorageProjectRepository()
): GetProjectByIdUseCase {
  return new GetProjectByIdUseCase(repository);
}

// Export the use case classes for advanced usage
export { CreateProjectUseCase };
export { GetProjectByIdUseCase };
