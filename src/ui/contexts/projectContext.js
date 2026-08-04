"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectProvider = exports.useProjectContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ProjectContext = (0, react_1.createContext)(null);
const useProjectContext = () => {
    const context = (0, react_1.useContext)(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within ProjectProvider');
    }
    return context;
};
exports.useProjectContext = useProjectContext;
const ProjectProvider = ({ children, getProjectByIdUseCase, createProjectUseCase, }) => {
    return ((0, jsx_runtime_1.jsx)(ProjectContext.Provider, { value: { getProjectByIdUseCase, createProjectUseCase }, children: children }));
};
exports.ProjectProvider = ProjectProvider;
