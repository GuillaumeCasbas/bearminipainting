import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import './ui/index.css';
import {LocalStorageProjectRepository} from "@/adapters/persistence/localstorage/project.repository";
import {CreateProjectUseCase} from "@/core/usecases/create-project.usecase";
import {GetProjectByIdUseCase} from "@/core/usecases/get-project-by-id.usecase"; // Error: The requested module 'http://localhost:5173/src/core/usecases/get-project-by-id.usecase.js' doesn't provide an export named: 'GetProjectByIdUseCase'
import {ProjectProvider} from "@/ui/contexts/projectContext";
import {GetAllProjectsUseCase} from "@/core/usecases/get-all-projects.usecase";

const localStorageProjectRepo = new LocalStorageProjectRepository();
const getAllProjectUseCase = new GetAllProjectsUseCase(localStorageProjectRepo);
const createProjectUseCase = new CreateProjectUseCase(localStorageProjectRepo);
const getProjectByIdUseCase = new GetProjectByIdUseCase(localStorageProjectRepo)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ProjectProvider
          getAllProjectsUseCase={getAllProjectUseCase}
          getProjectByIdUseCase={getProjectByIdUseCase}
          createProjectUseCase={createProjectUseCase}
      >
        <App />
      </ProjectProvider>
  </React.StrictMode>,
);
