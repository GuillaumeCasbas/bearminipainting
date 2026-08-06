"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const ProjectForm_1 = require("../../../src/ui/components/ProjectForm");
// Mock the useProjectStore
const mockAddProject = jest.fn();
const mockUseProjectStore = jest.fn();
jest.mock('../../../src/ui/stores/projectStore', () => ({
    useProjectStore: () => mockUseProjectStore(),
}));
describe('ProjectForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProjectStore.mockReturnValue({
            addProject: mockAddProject,
            isLoading: false,
        });
    });
    it('should render the form with all fields', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        expect(react_1.screen.getByText('Create a new project')).toBeInTheDocument();
        expect(react_1.screen.getByLabelText('Project name')).toBeInTheDocument();
        expect(react_1.screen.getByLabelText('Unique code')).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText('e.g. Orks Army')).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText('e.g. ORK-001')).toBeInTheDocument();
        expect(react_1.screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
    });
    it('should update input values when typed', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        const nameInput = react_1.screen.getByLabelText('Project name');
        const codeInput = react_1.screen.getByLabelText('Unique code');
        react_1.fireEvent.change(nameInput, { target: { value: 'Test Project' } });
        react_1.fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
        expect(nameInput).toHaveValue('Test Project');
        expect(codeInput).toHaveValue('TEST-001');
    });
    it('should call addProject when form is submitted', async () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        const nameInput = react_1.screen.getByLabelText('Project name');
        const codeInput = react_1.screen.getByLabelText('Unique code');
        react_1.fireEvent.change(nameInput, { target: { value: 'Test Project' } });
        react_1.fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Create Project' }));
        await (0, react_1.waitFor)(() => {
            expect(mockAddProject).toHaveBeenCalledWith('Test Project', 'TEST-001');
        });
    });
    it('should clear inputs after form submission', async () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        const nameInput = react_1.screen.getByLabelText('Project name');
        const codeInput = react_1.screen.getByLabelText('Unique code');
        react_1.fireEvent.change(nameInput, { target: { value: 'Test Project' } });
        react_1.fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
        react_1.fireEvent.submit(react_1.screen.getByRole('form'));
        await (0, react_1.waitFor)(() => {
            expect(nameInput).toHaveValue('');
            expect(codeInput).toHaveValue('');
        });
    });
    it('should disable inputs and button when isLoading is true', () => {
        mockUseProjectStore.mockReturnValue({
            addProject: mockAddProject,
            isLoading: true,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        const nameInput = react_1.screen.getByLabelText('Project name');
        const codeInput = react_1.screen.getByLabelText('Unique code');
        const submitButton = react_1.screen.getByRole('button', { name: /Creating.../ });
        expect(nameInput).toBeDisabled();
        expect(codeInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
        expect(react_1.screen.getByText('Creating...')).toBeInTheDocument();
    });
    it('should display "Create Project" button text when not loading', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ProjectForm_1.ProjectForm, {}));
        expect(react_1.screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
    });
});
