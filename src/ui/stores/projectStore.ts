import { create } from 'zustand';
import {Project} from "@/core/entities/Project";
import {CodeNotUniqueError} from "@/core/errors";
import {
  UnitNameEmptyError,
  UnitCodeInvalidCharactersError,
  UnitCodeNotUniqueError,
} from "@/core/errors";
// Import from DI container
import {
  getAllProjectsUseCase,
  createProjectUseCase,
  createUnitUseCase,
  getProjectByIdUseCase,
} from '@/di/container';

// Types for toast notifications
export type ToastType = 'success' | 'error' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  message: string;
}

interface ProjectStore {
  // State
  projects: Project[];
  isLoading: boolean;
  toasts: ToastNotification[];

  // Actions
  addProject: (name: string, code: string) => Promise<void>;
  addUnit: (projectId: string, name: string, code: string) => Promise<void>;
  loadProjects: () => Promise<void>;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initial state
  projects: [],
  isLoading: false,
  toasts: [],

  // Load projects from repository
  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await getAllProjectsUseCase.execute();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      set({ toasts: [...useProjectStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to load projects'
      }] });
    }
  },

  // Create a new project
  addProject: async (name: string, code: string) => {
    try {
      const newProject = await createProjectUseCase.execute(name, code);

      // Reload the project list
      const projects = await getAllProjectsUseCase.execute();
      set({ projects });

      // Show success toast
      set({ toasts: [...useProjectStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'success',
        message: `Project "${newProject.name}" created successfully!`
      }] });
    } catch (error) {
      // Handle CodeNotUniqueError
      if (error instanceof CodeNotUniqueError) {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: `Code "${error.code}" is already in use.`
        }] });
      } else {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: 'Failed to create project'
        }] });
      }
    }
  },

  // Add a unit to a project
  addUnit: async (projectId: string, name: string, code: string) => {
    try {
      const newUnit = await createUnitUseCase.execute(name, code, projectId);

      // Reload the project to get updated units
      const updatedProject = await getProjectByIdUseCase.execute(projectId);
      if (!updatedProject) {
        throw new Error('Project not found');
      }

      // Update the project in the store
      const projects = useProjectStore.getState().projects;
      const updatedProjects = projects.map((p) =>
        p.id === projectId ? updatedProject : p
      );
      set({ projects: updatedProjects });

      // Show success toast
      set({ toasts: [...useProjectStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'success',
        message: `Unit "${newUnit.name}" added successfully!`,
      }] });
    } catch (error) {
      // Handle specific errors with user-friendly messages
      if (error instanceof UnitNameEmptyError) {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: error.message,
        }] });
      } else if (error instanceof UnitCodeInvalidCharactersError) {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: error.message,
        }] });
      } else if (error instanceof UnitCodeNotUniqueError) {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: error.message,
        }] });
      } else {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: 'Failed to create unit',
        }] });
      }
    }
  },

  // Toast management
  addToast: (type, message) => {
    set({ toasts: [...useProjectStore.getState().toasts, {
      id: Date.now().toString(),
      type,
      message
    }] });
  },

  removeToast: (id) => {
    set({ toasts: useProjectStore.getState().toasts.filter(t => t.id !== id) });
  }
}));
