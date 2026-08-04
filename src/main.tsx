import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import './ui/index.css';
import {LocalStorageProjectRepository} from "@/adapters/persistence/localstorage/project.repository";
import {CreateProjectUseCase} from "@/core/usecases/create-project.usecase";
import {GetProjectByIdUseCase} from "@/core/usecases/get-project-by-id.usecase";
import {ProjectProvider} from "@/ui/contexts/projectContext";

const localStorageProjectRepo = new LocalStorageProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(localStorageProjectRepo);
const getProjectByIdUseCase = new GetProjectByIdUseCase(localStorageProjectRepo)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ProjectProvider
          getProjectByIdUseCase={getProjectByIdUseCase}
          createProjectUseCase={createProjectUseCase}
      >
        <App />
      </ProjectProvider>
  </React.StrictMode>,
);
