// DI Container - Centralized dependency injection for repositories and use cases
// This container provides singleton instances to avoid duplication and ensure consistency

import { LocalStorageProjectRepository } from '../adapters/persistence/localstorage/project.repository';

// UseCases
import { GetAllProjectsUseCase } from '../core/usecases/get-all-projects.usecase';
import { CreateProjectUseCase } from '../core/usecases/create-project.usecase';
import { GetProjectByIdUseCase } from '../core/usecases/get-project-by-id.usecase';

// Singleton instances
// Repositories
const projectRepository = new LocalStorageProjectRepository();

// UseCases
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);

// Export everything
export {
  // Repositories
  projectRepository,
  // UseCases
  getAllProjectsUseCase,
  createProjectUseCase,
  getProjectByIdUseCase,
};
