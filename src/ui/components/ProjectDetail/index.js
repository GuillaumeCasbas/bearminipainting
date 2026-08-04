"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetail = ProjectDetail;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const projectContext_1 = require("@/ui/contexts/projectContext");
// Completion rate thresholds (from BEA-8 specifications)
const COMPLETION_RATE_RED_THRESHOLD = 20;
const COMPLETION_RATE_GREEN_THRESHOLD = 80;
function ProjectDetail() {
    const { id } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [project, setProject] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const { getProjectByIdUseCase } = (0, projectContext_1.useProjectContext)();
    (0, react_1.useEffect)(() => {
        const loadProject = async () => {
            if (!id) {
                setError({ code: 404, message: 'Project not found.' });
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const project = await getProjectByIdUseCase.execute(id);
                if (!project) {
                    setError({ code: 404, message: 'Project not found.' });
                }
                else {
                    setProject(project);
                }
            }
            catch (err) {
                setError({ code: 500, message: 'Failed to load project details. Please try again.' });
            }
            finally {
                setIsLoading(false);
            }
        };
        loadProject();
    }, [id]);
    const getCompletionRateColor = (rate) => {
        if (rate < COMPLETION_RATE_RED_THRESHOLD)
            return 'bg-red-500';
        if (rate < COMPLETION_RATE_GREEN_THRESHOLD)
            return 'bg-orange-500';
        return 'bg-green-500';
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-md p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Loading project details..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("svg", { className: "h-5 w-5 text-red-500", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-3", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-red-700", children: ["Error ", error.code] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: error.message })] })] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700", children: "Back to Projects" })] }));
    }
    if (!project) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Project not found." }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4", children: "Back to Projects" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0, jsx_runtime_1.jsx)("nav", { className: "text-sm mb-6", "aria-label": "Breadcrumb", children: (0, jsx_runtime_1.jsxs)("ol", { className: "list-none p-0 inline-flex", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-blue-600 hover:text-blue-800", children: "Projects" }), (0, jsx_runtime_1.jsx)("span", { className: "mx-2 text-gray-400", children: '>' })] }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: project.name }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: project.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: ["Code: ", project.code] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: ["ID: ", project.id.substring(0, 8), "..."] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Completion Rate" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-4 mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: `h-4 rounded-full ${getCompletionRateColor(project.getCompletionRate())}`, style: { width: `${project.getCompletionRate()}%` } }) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [project.getCompletionRate(), "% complete"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Total Units" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: project.units.length })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Units" }), project.units.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 italic", children: "No units, please add new one to start your wonderful painting journey!" })) : ((0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1", children: project.units.map((unit) => ((0, jsx_runtime_1.jsx)("li", { className: "text-sm text-gray-700", children: unit.name }, unit.id))) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/'), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700", children: "Back to Projects" }) })] }));
}
