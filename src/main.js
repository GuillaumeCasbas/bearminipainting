"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const App_1 = require("./ui/App");
require("./ui/index.css");
const project_repository_1 = require("@/adapters/persistence/localstorage/project.repository");
const create_project_usecase_1 = require("@/core/usecases/create-project.usecase");
const get_project_by_id_usecase_1 = require("@/core/usecases/get-project-by-id.usecase");
const projectContext_1 = require("@/ui/contexts/projectContext");
const localStorageProjectRepo = new project_repository_1.LocalStorageProjectRepository();
const createProjectUseCase = new create_project_usecase_1.CreateProjectUseCase(localStorageProjectRepo);
const getProjectByIdUseCase = new get_project_by_id_usecase_1.GetProjectByIdUseCase(localStorageProjectRepo);
client_1.default.createRoot(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(projectContext_1.ProjectProvider, { getProjectByIdUseCase: getProjectByIdUseCase, createProjectUseCase: createProjectUseCase, children: (0, jsx_runtime_1.jsx)(App_1.App, {}) }) }));
