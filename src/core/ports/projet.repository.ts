import { Projet } from '../entities/Projet';

export interface ProjetRepository {
  save(projet: Projet): Promise<void>;
  findByCode(code: string): Promise<Projet | null>;
  findAll(): Promise<Projet[]>;
}
