"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unit_1 = require("../../../src/core/entities/Unit");
const Todo_1 = require("../../../src/core/entities/Todo");
describe("Unit", () => {
    it("should create a unit with empty todos when none provided", () => {
        const unit = new Unit_1.Unit("unit-1", "Intercessor", "IA-01", "1");
        expect(unit.id).toBe("unit-1");
        expect(unit.name).toBe("Intercessor");
        expect(unit.code).toBe("IA-01");
        expect(unit.projectId).toBe("1");
        expect(unit.todos).toEqual([]);
    });
    it("should create a unit with custom todos", () => {
        const todos = [
            new Todo_1.Todo("todo-1", "Custom Task", "TODO", 10),
        ];
        const unit = new Unit_1.Unit("unit-1", "Intercessor", "IA-01", "1", todos);
        expect(unit.todos).toHaveLength(1);
        expect(unit.todos[0].label).toBe("Custom Task");
    });
});
