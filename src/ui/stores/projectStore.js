"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProjectStore = void 0;
const zustand_1 = require("zustand");
const project_repository_1 = require("@/adapters/persistence/localstorage/project.repository");
const create_project_usecase_1 = require("@/core/usecases/create-project.usecase");
const errors_1 = require("@/core/errors");
// Initialize use case and repository
const projectRepository = new project_repository_1.LocalStorageProjectRepository();
const createProjectUseCase = new create_project_usecase_1.CreateProjectUseCase(projectRepository);
exports.useProjectStore = (0, zustand_1.create)((set) => ({
    // Initial state
    projects: [],
    isLoading: false,
    toasts: [],
    // Load projects from repository
    loadProjects: async () => {
        set({ isLoading: true });
        try {
            const projects = await projectRepository.findAll();
            set({ projects, isLoading: false });
        }
        catch (error) {
            set({ isLoading: false });
            set({ toasts: [...exports.useProjectStore.getState().toasts, {
                        id: Date.now().toString(),
                        type: 'error',
                        message: 'Failed to load projects'
                    }] });
        }
    },
    // Create a new project
    addProject: async (name, code) => {
        try {
            const newProject = await createProjectUseCase.execute(name, code);
            // Reload the project list
            const projects = await projectRepository.findAll();
            set({ projects });
            // Show success toast
            set({ toasts: [...exports.useProjectStore.getState().toasts, {
                        id: Date.now().toString(),
                        type: 'success',
                        message: `Project "${newProject.name}" created successfully!`
                    }] });
        }
        catch (error) {
            // Handle CodeNotUniqueError
            if (error instanceof errors_1.CodeNotUniqueError) {
                set({ toasts: [...exports.useProjectStore.getState().toasts, {
                            id: Date.now().toString(),
                            type: 'error',
                            message: `Code "${error.code}" is already in use.`
                        }] });
            }
            else {
                set({ toasts: [...exports.useProjectStore.getState().toasts, {
                            id: Date.now().toString(),
                            type: 'error',
                            message: 'Failed to create project'
                        }] });
            }
        }
    },
    // Toast management
    addToast: (type, message) => {
        set({ toasts: [...exports.useProjectStore.getState().toasts, {
                    id: Date.now().toString(),
                    type,
                    message
                }] });
    },
    removeToast: (id) => {
        set({ toasts: exports.useProjectStore.getState().toasts.filter(t => t.id !== id) });
    }
}));
