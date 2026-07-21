import { ProjetRepository } from '../../../core/ports/projet.repository';
import { Projet } from '../../../core/entities/Projet';

export class LocalStorageProjetRepository implements ProjetRepository {
  private readonly STORAGE_KEY = 'minipaint_projects';

  async save(projet: Projet): Promise<void> {
    const projects = this.getAllFromStorage();
    const updatedProjects = [
      ...projects.filter((p) => p.id !== projet.id),
      projet,
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  async findByCode(code: string): Promise<Projet | null> {
    const projects = this.getAllFromStorage();
    return projects.find((p) => p.code === code) ?? null;
  }

  private getAllFromStorage(): Projet[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);
      return parsed.map(
        (item: { id: string; nom: string; code: string; units: unknown[] }) =>
          new Projet(item.id, item.nom, item.code, item.units ?? [])
      );
    } catch {
      return [];
    }
  }
}
