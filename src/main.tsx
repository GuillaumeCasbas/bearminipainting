import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import './ui/index.css';
import { ProjectProvider } from "@/ui/contexts/projectContext";
// Import from DI container
import {
  getAllProjectsUseCase,
  createProjectUseCase,
  getProjectByIdUseCase,
} from '@/di/container';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ProjectProvider
          getAllProjectsUseCase={getAllProjectsUseCase}
          getProjectByIdUseCase={getProjectByIdUseCase}
          createProjectUseCase={createProjectUseCase}
      >
        <App />
      </ProjectProvider>
  </React.StrictMode>,
);
