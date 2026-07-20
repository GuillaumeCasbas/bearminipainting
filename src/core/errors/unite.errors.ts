import { BaseError } from './base.error';

export class UniteCodeNotUniqueError extends BaseError {
  constructor(code: string) {
    super(`Unite code '${code}' is not unique`);
  }
}
