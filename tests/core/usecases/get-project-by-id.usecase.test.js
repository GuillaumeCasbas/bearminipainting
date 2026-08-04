"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_project_by_id_usecase_1 = require("../../../src/core/usecases/get-project-by-id.usecase");
const Project_1 = require("../../../src/core/entities/Project");
const Unit_1 = require("../../../src/core/entities/Unit");
describe("GetProjectByIdUseCase", () => {
    // Track calls for manual verification
    let lastFindByIdCall = null;
    // Manual mock implementation
    const mockRepository = {
        findById: async (id) => {
            lastFindByIdCall = id;
            // Default implementation returns null, tests will override via closure
            return null;
        },
        findByCode: async (_code) => null,
        save: async (_project) => { },
        findAll: async () => [],
    };
    const useCase = new get_project_by_id_usecase_1.GetProjectByIdUseCase(mockRepository);
    it("should return a project if found by id", async () => {
        // Override mock behavior for this test
        const mockProject = new Project_1.Project("1", "Space Marines", "NMS", []);
        mockRepository.findById = async (id) => {
            lastFindByIdCall = id;
            return mockProject;
        };
        const result = await useCase.execute("1");
        expect(result).toBeInstanceOf(Project_1.Project);
        expect(result?.id).toBe("1");
        expect(result?.name).toBe("Space Marines");
        expect(result?.code).toBe("NMS");
        expect(lastFindByIdCall).toBe("1");
    });
    it("should return null if project is not found", async () => {
        // Reset to return null
        mockRepository.findById = async (id) => {
            lastFindByIdCall = id;
            return null;
        };
        const result = await useCase.execute("non-existent-id");
        expect(result).toBeNull();
        expect(lastFindByIdCall).toBe("non-existent-id");
    });
    it("should return a project with units", async () => {
        const mockUnit = new Unit_1.Unit("unit-1", "Intercessor", "IA-01", "1");
        const mockProject = new Project_1.Project("1", "Space Marines", "NMS", [mockUnit]);
        mockRepository.findById = async (id) => {
            lastFindByIdCall = id;
            return mockProject;
        };
        const result = await useCase.execute("1");
        expect(result).toBeInstanceOf(Project_1.Project);
        expect(result?.units).toHaveLength(1);
        expect(result?.units[0].name).toBe("Intercessor");
        expect(result?.units[0].code).toBe("IA-01");
    });
});
