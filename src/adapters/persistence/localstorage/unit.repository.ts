import { UnitRepository } from '@/core/ports/unit.repository';
import { Unit } from '@/core/entities/Unit';
import { ProjectRepository } from '@/core/ports/project.repository';
import { Project } from '@/core/entities/Project';
import { ProjectNotFoundError, UnitNotFoundError } from '@/core/errors';

export class LocalStorageUnitRepository implements UnitRepository {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async findById(unitId: string): Promise<Unit | null> {
    const projects = await this.projectRepository.findAll();
    for (const project of projects) {
      const unit = project.units.find((u) => u.id === unitId);
      if (unit) {
        return unit;
      }
    }
    return null;
  }

  async findByProjectIdAndCode(projectId: string, code: string): Promise<Unit | null> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) return null;
    return project.units.find((u) => u.code === code) ?? null;
  }

  async create(unit: Unit): Promise<void> {
    const project = await this.projectRepository.findById(unit.projectId);
    if (!project) {
      throw new ProjectNotFoundError(unit.projectId);
    }

    const updatedProject = new Project(
      project.id,
      project.name,
      project.code,
      [...project.units, unit]
    );

    await this.projectRepository.save(updatedProject);
  }

  async update(unit: Unit): Promise<void> {
    const project = await this.projectRepository.findById(unit.projectId);
    if (!project) {
      throw new ProjectNotFoundError(unit.projectId);
    }

    // Validate data integrity: unit must exist in the project
    // (protects against cases where unit.projectId is valid but unit doesn't belong to the project)
    const existingUnit = project.units.find((u) => u.id === unit.id);
    if (!existingUnit) {
      throw new UnitNotFoundError(unit.id);
    }

    const updatedUnits = project.units.map((u) => (u.id === unit.id ? unit : u));
    const updatedProject = new Project(
      project.id,
      project.name,
      project.code,
      updatedUnits
    );

    await this.projectRepository.save(updatedProject);
  }
}
