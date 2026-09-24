import { DataManagementRepository } from '../ports/data-management.repository';

export class ExportDataUseCase {
  constructor(private readonly repository: DataManagementRepository) {}

  async execute(): Promise<string> {
    return this.repository.getAllRaw();
  }
}
