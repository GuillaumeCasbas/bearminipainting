"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToastContainer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const projectStore_1 = require("../../stores/projectStore");
function ToastContainer() {
    const { toasts, removeToast } = (0, projectStore_1.useProjectStore)();
    // Automatically remove toasts after 5 seconds
    (0, react_1.useEffect)(() => {
        toasts.forEach((toast) => {
            const timer = setTimeout(() => {
                removeToast(toast.id);
            }, 5000);
            return () => clearTimeout(timer);
        });
    }, [toasts, removeToast]);
    if (toasts.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: toasts.map((toast) => ((0, jsx_runtime_1.jsx)("div", { className: `
            px-4 py-2 rounded-md shadow-lg animate-slide-in-right
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `, role: "alert", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: toast.message }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeToast(toast.id), className: "text-white/70 hover:text-white transition-colors", "aria-label": "Close", children: "\u00D7" })] }) }, toast.id))) }));
}
