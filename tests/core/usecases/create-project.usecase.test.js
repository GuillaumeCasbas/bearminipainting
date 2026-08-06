"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_project_usecase_1 = require("../../../src/core/usecases/create-project.usecase");
const Project_1 = require("../../../src/core/entities/Project");
const project_errors_1 = require("../../../src/core/errors/project.errors");
describe("CreateProjectUseCase", () => {
    let lastFindByCodeCall = null;
    let saveCalled = false;
    const mockRepository = {
        findById: async (_id) => null,
        findByCode: async (code) => {
            lastFindByCodeCall = code;
            return null;
        },
        save: async (_project) => {
            saveCalled = true;
        },
        findAll: async () => [],
    };
    const useCase = new create_project_usecase_1.CreateProjectUseCase(mockRepository);
    it("should throw CodeNotUniqueError if the code is already used", async () => {
        const existingProject = new Project_1.Project("1", "Space Marines", "NMS");
        mockRepository.findByCode = async (code) => {
            lastFindByCodeCall = code;
            return existingProject;
        };
        await expect(useCase.execute("New Project", "NMS"))
            .rejects
            .toBeInstanceOf(project_errors_1.CodeNotUniqueError);
    });
    it("should create a project if the code is unique", async () => {
        mockRepository.findByCode = async (code) => {
            lastFindByCodeCall = code;
            return null;
        };
        mockRepository.save = async (_project) => {
            saveCalled = true;
        };
        const result = await useCase.execute("New Project", "UNIQUE");
        expect(result).toBeInstanceOf(Project_1.Project);
        expect(result.id).toBeDefined();
        expect(result.name).toBe("New Project");
        expect(result.code).toBe("UNIQUE");
        expect(saveCalled).toBe(true);
    });
});
