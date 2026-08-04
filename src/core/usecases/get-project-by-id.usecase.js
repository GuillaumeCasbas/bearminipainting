"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProjectByIdUseCase = void 0;
class GetProjectByIdUseCase {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async execute(id) {
        return await this.projectRepository.findById(id);
    }
}
exports.GetProjectByIdUseCase = GetProjectByIdUseCase;
