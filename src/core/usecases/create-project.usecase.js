"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectUseCase = void 0;
const Project_1 = require("../entities/Project");
const project_errors_1 = require("../errors/project.errors");
class CreateProjectUseCase {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async execute(name, code) {
        // Check if code is already used
        const existingProject = await this.projectRepository.findByCode(code);
        if (existingProject) {
            throw new project_errors_1.CodeNotUniqueError(code);
        }
        // Create and save the new project
        const id = crypto.randomUUID();
        const newProject = new Project_1.Project(id, name, code);
        await this.projectRepository.save(newProject);
        return newProject;
    }
}
exports.CreateProjectUseCase = CreateProjectUseCase;
