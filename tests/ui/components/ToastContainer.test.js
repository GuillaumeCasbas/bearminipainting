"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const Toast_1 = __importDefault(require("../../../src/ui/components/Toast"));
// Mock the useProjectStore
const mockToasts = [];
const mockRemoveToast = jest.fn();
const mockUseProjectStore = jest.fn();
jest.mock('../../../src/ui/stores/projectStore', () => ({
    useProjectStore: () => mockUseProjectStore(),
}));
// Helper to create a test toast
const createTestToast = (overrides = {}) => {
    return {
        id: 'toast-1',
        type: 'success',
        message: 'Test message',
        ...overrides,
    };
};
describe('ToastContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should not render when there are no toasts', () => {
        mockUseProjectStore.mockReturnValue({
            toasts: [],
            removeToast: mockRemoveToast,
        });
        const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(container.firstChild).toBeNull();
    });
    it('should render a success toast', () => {
        const toast = createTestToast({ type: 'success' });
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(react_1.screen.getByText('Test message')).toBeInTheDocument();
        expect(react_1.screen.getByRole('alert')).toHaveClass('bg-green-500');
    });
    it('should render an error toast', () => {
        const toast = createTestToast({ type: 'error' });
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(react_1.screen.getByText('Test message')).toBeInTheDocument();
        expect(react_1.screen.getByRole('alert')).toHaveClass('bg-red-500');
    });
    it('should render an info toast', () => {
        const toast = createTestToast({ type: 'info' });
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(react_1.screen.getByText('Test message')).toBeInTheDocument();
        expect(react_1.screen.getByRole('alert')).toHaveClass('bg-blue-500');
    });
    it('should render multiple toasts', () => {
        const toast1 = createTestToast({ id: 'toast-1', message: 'Message 1' });
        const toast2 = createTestToast({ id: 'toast-2', message: 'Message 2' });
        mockUseProjectStore.mockReturnValue({
            toasts: [toast1, toast2],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(react_1.screen.getByText('Message 1')).toBeInTheDocument();
        expect(react_1.screen.getByText('Message 2')).toBeInTheDocument();
    });
    it('should call removeToast when close button is clicked', () => {
        const toast = createTestToast();
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        const closeButton = react_1.screen.getByLabelText('Close');
        react_1.fireEvent.click(closeButton);
        expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
    });
    it('should auto-remove toasts after 5 seconds', async () => {
        const toast = createTestToast();
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        // Fast-forward time by 5 seconds
        jest.advanceTimersByTime(5000);
        // Wait for useEffect to run
        await (0, react_1.waitFor)(() => {
            expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
        });
    });
    it('should have close button with aria-label', () => {
        const toast = createTestToast();
        mockUseProjectStore.mockReturnValue({
            toasts: [toast],
            removeToast: mockRemoveToast,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Toast_1.default, {}));
        expect(react_1.screen.getByLabelText('Close')).toBeInTheDocument();
    });
});
