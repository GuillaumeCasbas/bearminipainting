import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";

describe("Unit", () => {
  it("should create a unit with empty todos when none provided", () => {
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1");

    expect(unit.id).toBe("unit-1");
    expect(unit.name).toBe("Intercessor");
    expect(unit.code).toBe("IA-01");
    expect(unit.projectId).toBe("1");
    expect(unit.todos).toEqual([]);
  });

  it("should create a unit with custom todos", () => {
    const todos = [
      new Todo("todo-1", "Custom Task", "TODO", 10),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    expect(unit.todos).toHaveLength(1);
    expect(unit.todos[0].label).toBe("Custom Task");
  });

  // Tests for getCompletionRate method
  describe("getCompletionRate", () => {
    it("should return 100 when unit has no todos", () => {
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1");

      expect(unit.getCompletionRate()).toBe(100);
    });

    it("should return 100 when all todos are DONE", () => {
      const todos = [
        new Todo("todo-1", "Assembly", "DONE", 10),
        new Todo("todo-2", "Primer", "DONE", 20),
        new Todo("todo-3", "Base", "DONE", 30),
      ];
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

      expect(unit.getCompletionRate()).toBe(100);
    });

    it("should return 0 when no todos are DONE", () => {
      const todos = [
        new Todo("todo-1", "Assembly", "TODO", 10),
        new Todo("todo-2", "Primer", "TODO", 20),
        new Todo("todo-3", "Base", "TODO", 30),
      ];
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

      expect(unit.getCompletionRate()).toBe(0);
    });

    it("should return 50 when half of todos are DONE (3 out of 6)", () => {
      const todos = [
        new Todo("todo-1", "Assembly", "DONE", 10),
        new Todo("todo-2", "Primer", "DONE", 20),
        new Todo("todo-3", "Base", "DONE", 30),
        new Todo("todo-4", "Effects", "TODO", 40),
        new Todo("todo-5", "Basecoat", "TODO", 50),
        new Todo("todo-6", "Varnish", "TODO", 60),
      ];
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

      expect(unit.getCompletionRate()).toBe(50);
    });

    it("should round to nearest integer (2 out of 3 todos = 66.67% -> 67%)", () => {
      const todos = [
        new Todo("todo-1", "Assembly", "DONE", 10),
        new Todo("todo-2", "Primer", "DONE", 20),
        new Todo("todo-3", "Base", "TODO", 30),
      ];
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

      expect(unit.getCompletionRate()).toBe(67);
    });

    it("should round down (1 out of 3 todos = 33.33% -> 33%)", () => {
      const todos = [
        new Todo("todo-1", "Assembly", "DONE", 10),
        new Todo("todo-2", "Primer", "TODO", 20),
        new Todo("todo-3", "Base", "TODO", 30),
      ];
      const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

      expect(unit.getCompletionRate()).toBe(33);
    });
  });
});
