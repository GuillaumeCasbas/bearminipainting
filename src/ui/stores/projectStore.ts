import { create } from 'zustand';
import {Project} from "@/core/entities/Project";
import {Unit} from "@/core/entities/Unit";
import {Todo, TodoStatus} from "@/core/entities/Todo";
import {CodeNotUniqueError} from "@/core/errors";
import {
  UnitNameEmptyError,
  UnitCodeInvalidCharactersError,
  UnitCodeNotUniqueError,
  TodoLabelEmptyError,
  UnitNotFoundError,
  TodoNotFoundError,
} from "@/core/errors";
// Import from DI container
import {
  getAllProjectsUseCase,
  createProjectUseCase,
  createUnitUseCase,
  getProjectByIdUseCase,
  toggleTodoStatusUseCase,
  addTodoToUnitUseCase,
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
  addTodo: (unitId: string, label: string) => Promise<void>;
  toggleTodoStatus: (unitId: string, todoId: string) => Promise<void>;
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

  // Add a todo to a unit
  addTodo: async (unitId: string, label: string) => {
    try {
      // Call use case to add the todo
      const updatedUnit = await addTodoToUnitUseCase.execute(unitId, label);

      // Update the unit in the store
      const projects = useProjectStore.getState().projects;
      const updatedProjects = projects.map((project) => {
        const updatedUnits = project.units.map((unit) =>
          unit.id === updatedUnit.id ? updatedUnit : unit
        );
        if (updatedUnits !== project.units) {
          return new Project(
            project.id,
            project.name,
            project.code,
            updatedUnits
          );
        }
        return project;
      });
      set({ projects: updatedProjects });

    } catch (error) {
      // Catch TodoLabelEmptyError in silence (UI handles this)
      if (error instanceof TodoLabelEmptyError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('TodoLabelEmptyError: Attempted to add empty todo');
        }
        return;
      }
      // Other errors: show toast
      if (error instanceof UnitNotFoundError) {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: error.message,
        }] });
      } else {
        set({ toasts: [...useProjectStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: 'Failed to add todo',
        }] });
      }
    }
  },

  // Toggle todo status with optimistic updates
  toggleTodoStatus: async (unitId: string, todoId: string) => {
    let previousTodoStatus: TodoStatus = 'TODO';

    try {
      const projects = useProjectStore.getState().projects;

      // Find the unit and its parent project
      let targetProject: Project | null = null;
      let targetUnitIndex = -1;
      let targetTodoIndex = -1;
      let targetUnit: Unit | null = null;

      for (const project of projects) {
        targetUnitIndex = project.units.findIndex(u => u.id === unitId);
        if (targetUnitIndex !== -1) {
          targetProject = project;
          targetUnit = project.units[targetUnitIndex];
          targetTodoIndex = targetUnit.todos.findIndex(t => t.id === todoId);
          break;
        }
      }

      if (!targetUnit) {
        throw new UnitNotFoundError(unitId);
      }
      if (targetTodoIndex === -1) {
        throw new TodoNotFoundError(todoId);
      }

      // Save the previous state for rollback
      previousTodoStatus = targetUnit.todos[targetTodoIndex].status;

      // Optimistic update: toggle the todo status locally
      const updatedTodos = [...targetUnit.todos];
      const todoToUpdate = updatedTodos[targetTodoIndex];
      const newStatus = todoToUpdate.status === 'TODO' ? 'DONE' : 'TODO';
      updatedTodos[targetTodoIndex] = new Todo(
        todoToUpdate.id,
        todoToUpdate.label,
        newStatus,
        todoToUpdate.order
      );

      const updatedUnit = new Unit(
        targetUnit.id,
        targetUnit.name,
        targetUnit.code,
        targetUnit.projectId,
        updatedTodos
      );

      // Update the store optimistically
      const updatedProjects = projects.map(p => {
        if (targetProject && p.id === targetProject.id) {
          const updatedUnits = [...p.units];
          updatedUnits[targetUnitIndex] = updatedUnit;
          return new Project(
            p.id,
            p.name,
            p.code,
            updatedUnits
          );
        }
        return p;
      });
      set({ projects: updatedProjects });

      // Call the use case
      await toggleTodoStatusUseCase.execute(unitId, todoId);

    } catch (error) {
      // Rollback optimistic update
      const projects = useProjectStore.getState().projects;
      const updatedProjects = projects.map(p => {
        const unitIndex = p.units.findIndex(u => u.id === unitId);
        if (unitIndex !== -1) {
          const unit = p.units[unitIndex];
          const todoIndex = unit.todos.findIndex(t => t.id === todoId);
          if (todoIndex !== -1) {
            const todos = unit.todos.map(t => {
              if (t.id === todoId) {
                return new Todo(t.id, t.label, previousTodoStatus, t.order);
              }
              return t;
            });
            const revertedUnit = new Unit(
              unit.id,
              unit.name,
              unit.code,
              unit.projectId,
              todos
            );
            const updatedUnits = [...p.units];
            updatedUnits[unitIndex] = revertedUnit;
            return new Project(p.id, p.name, p.code, updatedUnits);
          }
        }
        return p;
      });
      set({ projects: updatedProjects });

      // Error toast
      set({ toasts: [...useProjectStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to toggle todo status',
      }] });
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
