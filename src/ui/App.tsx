import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectForm } from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import ToastContainer from './components/Toast';
import { useProjectStore } from './stores/projectStore';
import { useEncouragementUseCase } from './contexts/EncouragementContext';
import { ProjectProvider } from './contexts/project-context';
import { LocalStorageProjectRepository } from '../adapters/persistence/localstorage/project.repository';
import { GetProjectByIdUseCase } from '../core/usecases/get-project-by-id.usecase';

export function App() {
  const encouragementUseCase = useEncouragementUseCase();
  const { loadProjects } = useProjectStore();

  // Initialize use case with repository
  const getProjectByIdUseCase = useMemo(
    () => new GetProjectByIdUseCase(new LocalStorageProjectRepository()),
    []
  );

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <ProjectProvider getProjectByIdUseCase={getProjectByIdUseCase}>
      <Router>
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">MiniPaint</h1>
              <p className="text-gray-600 mt-1">
                Track your Warhammer army progress
              </p>
            </header>

            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <ProjectForm />
                      <ProjectList />
                    </>
                  }
                />
                <Route path="/projects/:id" element={<ProjectDetail />} />
              </Routes>
            </main>

            <ToastContainer />
          </div>
        </div>
      </Router>
    </ProjectProvider>
  );
}
