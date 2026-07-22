import { BaseError } from './base.error';

export class UnitCodeNotUniqueError extends BaseError {
  constructor(code: string) {
    super(`Unit code '${code}' is not unique`);
  }
}
