import { Projet } from '../entities/Projet';
import { ProjetRepository } from '../ports/projet.repository';
import { CodeNotUniqueError } from '../errors/projet.errors';

export class CreateProjetUseCase {
  constructor(private readonly projetRepository: ProjetRepository) {}

  async execute(nom: string, code: string): Promise<Projet> {
    // Check if code is already used
    const existingProjet = await this.projetRepository.findByCode(code);
    if (existingProjet) {
      throw new CodeNotUniqueError(code);
    }

    // Generate UUID for the new project
    const id = crypto.randomUUID();

    // Create and save the new project
    const newProjet = new Projet(id, nom, code);
    await this.projetRepository.save(newProjet);

    return newProjet;
  }
}
