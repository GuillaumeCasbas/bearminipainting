"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const ProjectForm_1 = require("./components/ProjectForm");
const ProjectList_1 = __importDefault(require("./components/ProjectList"));
const ProjectDetail_1 = require("./components/ProjectDetail");
const Toast_1 = __importDefault(require("./components/Toast"));
const projectStore_1 = require("./stores/projectStore");
function App() {
    const { loadProjects } = (0, projectStore_1.useProjectStore)();
    // Load projects on mount
    (0, react_1.useEffect)(() => {
        loadProjects();
    }, [loadProjects]);
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-100 p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "MiniPaint" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Track your Warhammer army progress" })] }), (0, jsx_runtime_1.jsx)("main", { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}), (0, jsx_runtime_1.jsx)(ProjectList_1.default, {})] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/projects/:id", element: (0, jsx_runtime_1.jsx)(ProjectDetail_1.ProjectDetail, {}) })] }) }), (0, jsx_runtime_1.jsx)(Toast_1.default, {})] }) }) }));
}
