/**
 * UI Adapter for Projet
 * Exposes Core functionality to UI layer without direct Core imports.
 */

// Re-export types and classes needed by UI
import { Projet } from '../../core/entities/Projet';
import { ProjetRepository } from '../../core/ports/projet.repository';
import LocalStorageProjetRepository from '../persistence/localstorage/projet.repository';
import { CreateProjetUseCase } from '../../core/usecases/create-projet.usecase';
import { CodeNotUniqueError } from '../../core/errors/projet.errors';

// Export types
export type { ProjetRepository };
export { Projet };
export { CodeNotUniqueError };

// Re-export the default repository as both default and named
export default LocalStorageProjetRepository;
export { LocalStorageProjetRepository };

// Factory function to create use case with repository
export function createProjetUseCaseWithRepository(
  repository: ProjetRepository = new LocalStorageProjetRepository()
): CreateProjetUseCase {
  return new CreateProjetUseCase(repository);
}

// Export the use case class for advanced usage
export { CreateProjetUseCase };
