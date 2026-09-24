import { DataManagementRepository } from '../ports/data-management.repository';
import {
  StoredProjectData,
  StoredUnitData,
  StoredTodoData,
} from '../entities/backup-data';
import { InvalidBackupError } from '../errors/data.errors';

export class ImportDataUseCase {
  constructor(private readonly repository: DataManagementRepository) {}

  async execute(rawData: string): Promise<void> {
    const projects = this.parseAndValidate(rawData);
    await this.repository.replaceAll(projects);
  }

  private parseAndValidate(rawData: string): StoredProjectData[] {
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

  private validateProject(item: unknown): StoredProjectData {
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
    return {
      id: candidate.id as string,
      name: candidate.name as string,
      code: candidate.code as string,
      units,
    };
  }

  private validateUnit(item: unknown, projectId: string): StoredUnitData {
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
    return {
      id: candidate.id as string,
      name: candidate.name as string,
      code: candidate.code as string,
      projectId: candidate.projectId as string,
      todos,
    };
  }

  private validateTodo(item: unknown, unitId: string): StoredTodoData {
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

    return {
      id: candidate.id as string,
      label: candidate.label as string,
      status: candidate.status as 'TODO' | 'DONE',
      order: candidate.order as number,
    };
  }

  private isObject(item: unknown): boolean {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
  }

  private isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim() !== '';
  }
}
