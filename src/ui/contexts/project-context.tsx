import { createContext, useContext, ReactNode } from 'react';
import { GetProjectByIdUseCase } from '../../core/usecases/get-project-by-id.usecase';

interface ProjectContextType {
  getProjectByIdUseCase: GetProjectByIdUseCase;
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
}: {
  children: ReactNode;
  getProjectByIdUseCase: GetProjectByIdUseCase;
}) => {
  return (
    <ProjectContext.Provider value={{ getProjectByIdUseCase }}>
      {children}
    </ProjectContext.Provider>
  );
};
