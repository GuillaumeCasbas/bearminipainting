"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const ProjectList_1 = __importDefault(require("../../../src/ui/components/ProjectList"));
const Project_1 = require("@/core/entities/Project");
// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ children, to }) => ((0, jsx_runtime_1.jsx)("a", { href: to, children: children })),
}));
// Mock the useProjectStore
const mockProjects = [];
const mockIsLoading = false;
const mockUseProjectStore = jest.fn();
jest.mock('../../../src/ui/stores/projectStore', () => ({
    useProjectStore: () => mockUseProjectStore(),
}));
// Helper to create a test project
const createTestProject = (overrides = {}) => {
    return {
        ...new Project_1.Project('test-id-1', 'Test Project', 'TEST-001', []),
        getCompletionRate: () => 0,
        ...overrides,
    };
};
describe('ProjectList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProjectStore.mockReturnValue({
            projects: mockProjects,
            isLoading: mockIsLoading,
        });
    });
    it('should display loading state', () => {
        mockUseProjectStore.mockReturnValue({
            projects: [],
            isLoading: true,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('Loading projects...')).toBeInTheDocument();
    });
    it('should display empty state when no projects', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('My Projects')).toBeInTheDocument();
        expect(react_1.screen.getByText('No projects created yet.')).toBeInTheDocument();
    });
    it('should display projects in a table', () => {
        const testProject = createTestProject({
            id: 'proj-1',
            name: 'Space Marines',
            code: 'SM',
        });
        mockUseProjectStore.mockReturnValue({
            projects: [testProject],
            isLoading: false,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('My Projects')).toBeInTheDocument();
        expect(react_1.screen.getByText('Space Marines')).toBeInTheDocument();
        expect(react_1.screen.getByText('SM')).toBeInTheDocument();
        // ID is truncated to 8 chars + "..."
        expect(react_1.screen.getByText('proj-1...')).toBeInTheDocument();
    });
    it('should display multiple projects', () => {
        const project1 = createTestProject({
            id: 'proj-1',
            name: 'Space Marines',
            code: 'SM',
        });
        const project2 = createTestProject({
            id: 'proj-2',
            name: 'Orks',
            code: 'ORK',
        });
        mockUseProjectStore.mockReturnValue({
            projects: [project1, project2],
            isLoading: false,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('Space Marines')).toBeInTheDocument();
        expect(react_1.screen.getByText('Orks')).toBeInTheDocument();
        expect(react_1.screen.getByText('SM')).toBeInTheDocument();
        expect(react_1.screen.getByText('ORK')).toBeInTheDocument();
    });
    it('should display completion rate for each project', () => {
        const project = createTestProject({
            id: 'proj-1',
            name: 'Test Project',
            code: 'TEST',
            getCompletionRate: () => 50,
        });
        mockUseProjectStore.mockReturnValue({
            projects: [project],
            isLoading: false,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('50%')).toBeInTheDocument();
    });
    it('should display table headers', () => {
        const project = createTestProject();
        mockUseProjectStore.mockReturnValue({
            projects: [project],
            isLoading: false,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        expect(react_1.screen.getByText('Name')).toBeInTheDocument();
        expect(react_1.screen.getByText('Code')).toBeInTheDocument();
        expect(react_1.screen.getByText('ID')).toBeInTheDocument();
        expect(react_1.screen.getByText('Completion Rate')).toBeInTheDocument();
    });
    it('should truncate long project IDs', () => {
        const project = createTestProject({
            id: 'very-long-project-id-12345678',
            name: 'Test Project',
            code: 'TEST',
        });
        mockUseProjectStore.mockReturnValue({
            projects: [project],
            isLoading: false,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectList_1.default, {}));
        // Should display first 8 characters + "..." (very-lon + ...)
        expect(react_1.screen.getByText('very-lon...')).toBeInTheDocument();
    });
});
