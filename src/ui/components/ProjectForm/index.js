"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectForm = ProjectForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const projectStore_1 = require("../../stores/projectStore");
function ProjectForm() {
    const [name, setName] = (0, react_1.useState)('');
    const [code, setCode] = (0, react_1.useState)('');
    const { addProject, isLoading } = (0, projectStore_1.useProjectStore)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await addProject(name, code);
        setName('');
        setCode('');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [(0, jsx_runtime_1.jsx)("h2", { id: "project-form-title", className: "text-xl font-semibold text-gray-800 mb-4", children: "Create a new project" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", "aria-labelledby": "project-form-title", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Project name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g. Orks Army", disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "code", className: "block text-sm font-medium text-gray-700 mb-1", children: "Unique code" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "code", value: code, onChange: (e) => setCode(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g. ORK-001", disabled: isLoading })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Creating...' : 'Create Project' })] })] }));
}
