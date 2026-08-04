import { createContext, useContext, ReactNode } from 'react';
import { GetProjectByIdUseCase } from '@/core/usecases/get-project-by-id.usecase';
import {CreateProjectUseCase} from "@/core/usecases/create-project.usecase";

interface ProjectContextType {
  getProjectByIdUseCase: GetProjectByIdUseCase;
  createProjectUseCase: CreateProjectUseCase;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({
  children,
  getProjectByIdUseCase,
  createProjectUseCase,
}: {
  children: ReactNode;
  getProjectByIdUseCase: GetProjectByIdUseCase;
  createProjectUseCase: CreateProjectUseCase;
}) => {
  return (
    <ProjectContext.Provider value={{ getProjectByIdUseCase, createProjectUseCase }}>
      {children}
    </ProjectContext.Provider>
  );
};
