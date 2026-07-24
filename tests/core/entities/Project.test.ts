import { Project } from "../../../src/core/entities/Project";
import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";

describe("Project", () => {
  it("should create a project with default empty units", () => {
    const project = new Project("1", "Space Marines", "NMS");

    expect(project.id).toBe("1");
    expect(project.name).toBe("Space Marines");
    expect(project.code).toBe("NMS");
    expect(project.units).toEqual([]);
  });

  it("should create a project with units", () => {
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1");
    const project = new Project("1", "Space Marines", "NMS", [unit]);

    expect(project.units).toHaveLength(1);
    expect(project.units[0].name).toBe("Intercessor");
  });

  it("should return 100% completion rate if no units", () => {
    const project = new Project("1", "Space Marines", "NMS", []);

    expect(project.getCompletionRate()).toBe(100);
  });

  it("should calculate completion rate based on unit todos", () => {
    // Create a unit with 6 todos (all TODO)
    const unit1Todos = [
      new Todo("todo-1", "Assembly", "TODO", 10),
      new Todo("todo-2", "Primer", "TODO", 20),
      new Todo("todo-3", "Base", "TODO", 30),
      new Todo("todo-4", "Effects", "TODO", 40),
      new Todo("todo-5", "Basecoat", "TODO", 50),
      new Todo("todo-6", "Varnish", "TODO", 60),
    ];
    const unit1 = new Unit("unit-1", "Intercessor", "IA-01", "1", unit1Todos);
    
    // Create a unit with 6 todos, but mark some as DONE
    const unit2Todos = [
      new Todo("todo-7", "Assembly", "DONE", 10),
      new Todo("todo-8", "Primer", "DONE", 20),
      new Todo("todo-9", "Base", "TODO", 30),
      new Todo("todo-10", "Effects", "TODO", 40),
      new Todo("todo-11", "Basecoat", "TODO", 50),
      new Todo("todo-12", "Varnish", "TODO", 60),
    ];
    const unit2 = new Unit("unit-2", "Tacticus", "IA-02", "1", unit2Todos);

    const project = new Project("1", "Space Marines", "NMS", [unit1, unit2]);

    // unit1 has 0/6 done, unit2 has 2/6 done
    // Total: 2/12 = 16.67% -> rounded to 17%
    expect(project.getCompletionRate()).toBe(17);
  });

  it("should return 100% completion rate if all todos are done", () => {
    const todos = [
      new Todo("todo-1", "Assembly", "DONE", 10),
      new Todo("todo-2", "Primer", "DONE", 20),
      new Todo("todo-3", "Base", "DONE", 30),
      new Todo("todo-4", "Effects", "DONE", 40),
      new Todo("todo-5", "Basecoat", "DONE", 50),
      new Todo("todo-6", "Varnish", "DONE", 60),
    ];
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1", todos);

    const project = new Project("1", "Space Marines", "NMS", [unit]);

    expect(project.getCompletionRate()).toBe(100);
  });
});
