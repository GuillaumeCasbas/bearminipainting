import { BaseError } from './base.error';

export class CodeNotUniqueError extends BaseError {
  readonly code: string;

  constructor(code: string) {
    super(`Code '${code}' is not unique`);
    this.code = code;
    this.name = 'CodeNotUniqueError';
  }
}

export class ProjectNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Project with id '${id}' not found`);
  }
}

export class ProjectCodeNotFoundError extends BaseError {
  constructor(code: string) {
    super(`Project with code '${code}' not found`);
  }
}
