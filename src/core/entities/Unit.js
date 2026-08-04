"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
class Unit {
    constructor(id, name, code, projectId, todos = []) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.projectId = projectId;
        this.todos = todos;
    }
}
exports.Unit = Unit;
