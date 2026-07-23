import { useEffect } from 'react';
import { ProjectForm } from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ToastContainer from './components/Toast';
import { useProjectStore } from './stores/projectStore';
import { EncouragementBanner } from './components/EncouragementBanner';
import { GetRandomEncouragementMessageUseCase } from '../core/usecases/get-random-encouragement-message.usecase';
import LocalStorageEncouragementRepository from '../adapters/persistence/localstorage/encouragement.repository';

// Initialize use case with its adapter
const encouragementUseCase = new GetRandomEncouragementMessageUseCase(
  new LocalStorageEncouragementRepository()
);

export function App() {
  const { loadProjects } = useProjectStore();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <EncouragementBanner getRandomMessageUseCase={encouragementUseCase} />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MiniPaint</h1>
          <p className="text-gray-600 mt-1">
            Track your Warhammer army progress
          </p>
        </header>

        <main>
          <ProjectForm />
          <ProjectList />
        </main>

        <ToastContainer />
      </div>
    </div>
  );
}
