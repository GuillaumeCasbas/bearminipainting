import { create } from 'zustand';
import {
  Project,
  LocalStorageProjectRepository,
  CreateProjectUseCase,
  CodeNotUniqueError,
} from '../../adapters/ui/project';

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
  loadProjects: () => Promise<void>;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

// Initialize use case and repository
const projectRepository = new LocalStorageProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(projectRepository);

export const useProjectStore = create<ProjectStore>((set) => ({
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
      const id = crypto.randomUUID();
      const newProject = await createProjectUseCase.execute(id, name, code);
      
      // Reload the project list
      const projects = await projectRepository.findAll();
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
