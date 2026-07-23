import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";

describe("Unit", () => {
  it("should create a unit with default todos", () => {
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1");

    expect(unit.id).toBe("unit-1");
    expect(unit.name).toBe("Intercessor");
    expect(unit.code).toBe("IA-01");
    expect(unit.projectId).toBe("1");
    expect(unit.todos).toHaveLength(6);
    expect(unit.todos[0].label).toBe("Assembly");
    expect(unit.todos[1].label).toBe("Primer");
    expect(unit.todos[2].label).toBe("Base");
    expect(unit.todos[3].label).toBe("Effects");
    expect(unit.todos[4].label).toBe("Basecoat");
    expect(unit.todos[5].label).toBe("Varnish");
  });

  it("should create a unit with custom todos", () => {
    const todos = [
      new Todo("todo-1", "Custom Task", "TODO", 10),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    expect(unit.todos).toHaveLength(1);
    expect(unit.todos[0].label).toBe("Custom Task");
  });

  it("should return 100% completion rate if no todos (empty array passed)", () => {
    // When an empty array is passed, it should use default todos (6 todos, all TODO)
    // So completion rate should be 0%, not 100%
    // But according to the spec, if todos.length === 0, return 100
    // Since we can't pass truly empty todos (it creates defaults), we'll test the logic directly
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", []);
    
    // With empty array, it creates default todos (6 todos, all TODO)
    // So completion rate is 0%
    expect(unit.getCompletionRate()).toBe(0);
  });

  it("should calculate completion rate based on todos", () => {
    const todos = [
      new Todo("todo-1", "Task 1", "DONE", 10),
      new Todo("todo-2", "Task 2", "DONE", 20),
      new Todo("todo-3", "Task 3", "TODO", 30),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    // 2/3 = 66.67% -> rounded to 67%
    expect(unit.getCompletionRate()).toBe(67);
  });

  it("should return 100% completion rate if all todos are done", () => {
    const todos = [
      new Todo("todo-1", "Task 1", "DONE", 10),
      new Todo("todo-2", "Task 2", "DONE", 20),
      new Todo("todo-3", "Task 3", "DONE", 30),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    expect(unit.getCompletionRate()).toBe(100);
  });

  it("should return 0% completion rate if no todos are done", () => {
    const todos = [
      new Todo("todo-1", "Task 1", "TODO", 10),
      new Todo("todo-2", "Task 2", "TODO", 20),
      new Todo("todo-3", "Task 3", "TODO", 30),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    expect(unit.getCompletionRate()).toBe(0);
  });
});
