import { DataManagementRepository } from '../ports/data-management.repository';
import { Project } from '../entities/Project';
import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { InvalidBackupError } from '../errors/data.errors';

export class ImportDataUseCase {
  constructor(private readonly repository: DataManagementRepository) {}

  async execute(rawData: string): Promise<void> {
    const projects = this.parseAndValidate(rawData);
    this.validateDomainInvariants(projects);
    await this.repository.replaceAll(projects);
  }

  private validateDomainInvariants(projects: Project[]): void {
    const projectIds = new Set<string>();
    const projectCodes = new Set<string>();
    const unitCodes = new Set<string>();

    for (const project of projects) {
      if (projectCodes.has(project.code)) {
        throw new InvalidBackupError(`Duplicate project code: "${project.code}"`);
      }
      projectCodes.add(project.code);
      projectIds.add(project.id);

      for (const unit of project.units) {
        if (unitCodes.has(unit.code)) {
          throw new InvalidBackupError(`Duplicate unit code: "${unit.code}"`);
        }
        unitCodes.add(unit.code);
      }
    }

    for (const project of projects) {
      for (const unit of project.units) {
        if (!projectIds.has(unit.projectId)) {
          throw new InvalidBackupError(
            `Unit "${unit.id}" references unknown project "${unit.projectId}"`,
          );
        }
      }
    }
  }

  private parseAndValidate(rawData: string): Project[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      throw new InvalidBackupError('the file is not valid JSON');
    }

    if (!Array.isArray(parsed)) {
      throw new InvalidBackupError('expected an array of projects');
    }

    return parsed.map((item) => this.validateProject(item));
  }

  private validateProject(item: unknown): Project {
    if (!this.isObject(item)) {
      throw new InvalidBackupError('a project entry is not an object');
    }
    const candidate = item as Record<string, unknown>;
    if (!this.isNonEmptyString(candidate.id)) {
      throw new InvalidBackupError('a project is missing a valid id');
    }
    if (!this.isNonEmptyString(candidate.name)) {
      throw new InvalidBackupError(`project ${candidate.id} is missing a valid name`);
    }
    if (!this.isNonEmptyString(candidate.code)) {
      throw new InvalidBackupError(`project ${candidate.id} is missing a valid code`);
    }
    if (!Array.isArray(candidate.units)) {
      throw new InvalidBackupError(`project ${candidate.id} is missing a units array`);
    }

    const units = candidate.units.map((unit) => this.validateUnit(unit, candidate.id as string));
    return new Project(
      candidate.id as string,
      candidate.name as string,
      candidate.code as string,
      units,
    );
  }

  private validateUnit(item: unknown, projectId: string): Unit {
    if (!this.isObject(item)) {
      throw new InvalidBackupError(`a unit of project ${projectId} is not an object`);
    }
    const candidate = item as Record<string, unknown>;
    if (!this.isNonEmptyString(candidate.id)) {
      throw new InvalidBackupError(`a unit of project ${projectId} is missing a valid id`);
    }
    if (!this.isNonEmptyString(candidate.name)) {
      throw new InvalidBackupError(`unit ${candidate.id} is missing a valid name`);
    }
    if (!this.isNonEmptyString(candidate.code)) {
      throw new InvalidBackupError(`unit ${candidate.id} is missing a valid code`);
    }
    if (!this.isNonEmptyString(candidate.projectId)) {
      throw new InvalidBackupError(`unit ${candidate.id} is missing a valid projectId`);
    }
    if (!Array.isArray(candidate.todos)) {
      throw new InvalidBackupError(`unit ${candidate.id} is missing a todos array`);
    }

    const todos = candidate.todos.map((todo) => this.validateTodo(todo, candidate.id as string));
    return new Unit(
      candidate.id as string,
      candidate.name as string,
      candidate.code as string,
      candidate.projectId as string,
      todos,
    );
  }

  private validateTodo(item: unknown, unitId: string): Todo {
    if (!this.isObject(item)) {
      throw new InvalidBackupError(`a todo of unit ${unitId} is not an object`);
    }
    const candidate = item as Record<string, unknown>;
    if (!this.isNonEmptyString(candidate.id)) {
      throw new InvalidBackupError(`a todo of unit ${unitId} is missing a valid id`);
    }
    if (!this.isNonEmptyString(candidate.label)) {
      throw new InvalidBackupError(`todo ${candidate.id} is missing a valid label`);
    }
    if (candidate.status !== 'TODO' && candidate.status !== 'DONE') {
      throw new InvalidBackupError(`todo ${candidate.id} has an invalid status`);
    }
    if (typeof candidate.order !== 'number' || !Number.isFinite(candidate.order)) {
      throw new InvalidBackupError(`todo ${candidate.id} is missing a valid order`);
    }

    return new Todo(
      candidate.id as string,
      candidate.label as string,
      candidate.status as 'TODO' | 'DONE',
      candidate.order as number,
    );
  }

  private isObject(item: unknown): boolean {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
  }

  private isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim() !== '';
  }
}
