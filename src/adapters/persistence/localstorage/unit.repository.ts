import { UnitRepository } from '@/core/ports/unit.repository';
import { Unit } from '@/core/entities/Unit';
import { ProjectRepository } from '@/core/ports/project.repository';
import { Project } from '@/core/entities/Project';

export class LocalStorageUnitRepository implements UnitRepository {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async findByProjectIdAndCode(projectId: string, code: string): Promise<Unit | null> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) return null;
    return project.units.find((u) => u.code === code) ?? null;
  }

  async save(unit: Unit): Promise<void> {
    const project = await this.projectRepository.findById(unit.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedProject = new Project(
      project.id,
      project.name,
      project.code,
      [...project.units, unit]
    );

    await this.projectRepository.save(updatedProject);
  }
}
