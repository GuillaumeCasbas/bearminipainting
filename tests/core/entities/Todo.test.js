"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Todo_1 = require("../../../src/core/entities/Todo");
describe("Todo", () => {
    it("should create a todo with default status TODO", () => {
        const todo = new Todo_1.Todo("todo-1", "Assembly", undefined, 10);
        expect(todo.id).toBe("todo-1");
        expect(todo.label).toBe("Assembly");
        expect(todo.status).toBe("TODO");
        expect(todo.order).toBe(10);
    });
    it("should create a todo with DONE status", () => {
        const todo = new Todo_1.Todo("todo-1", "Assembly", "DONE", 10);
        expect(todo.id).toBe("todo-1");
        expect(todo.label).toBe("Assembly");
        expect(todo.status).toBe("DONE");
        expect(todo.order).toBe(10);
    });
    it("should create a todo with custom order", () => {
        const todo = new Todo_1.Todo("todo-1", "Custom Task", "TODO", 100);
        expect(todo.order).toBe(100);
    });
});
