import { BaseError } from './base.error';

export class UnitCodeNotUniqueError extends BaseError {
  constructor(code: string) {
    super(`Unit code '${code}' is not unique`);
  }
}

export class UnitNameEmptyError extends BaseError {
  constructor() {
    super('Unit name cannot be empty');
  }
}

export class UnitCodeInvalidCharactersError extends BaseError {
  constructor(code: string) {
    super(`Unit code '${code}' contains invalid characters. Only letters, numbers and hyphens are allowed.`);
  }
}
