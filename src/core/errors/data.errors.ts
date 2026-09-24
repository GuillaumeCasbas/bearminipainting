import { BaseError } from './base.error';

export class InvalidBackupError extends BaseError {
  constructor(reason: string) {
    super(`Invalid backup file: ${reason}`);
  }
}
