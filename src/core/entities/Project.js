"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
class Project {
    constructor(id, name, code, units = []) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.units = units;
    }
    getCompletionRate() {
        if (this.units.length === 0) {
            return 100;
        }
        const totalTodos = this.units.reduce((sum, unit) => sum + unit.todos.length, 0);
        if (totalTodos === 0) {
            return 100;
        }
        const totalDoneTodos = this.units.reduce((sum, unit) => sum + unit.todos.filter((todo) => todo.status === 'DONE').length, 0);
        const rate = (totalDoneTodos / totalTodos) * 100;
        return Math.round(rate);
    }
}
exports.Project = Project;
