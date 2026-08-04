"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
class Todo {
    constructor(id, label, status = 'TODO', order) {
        this.id = id;
        this.label = label;
        this.status = status;
        this.order = order;
    }
}
exports.Todo = Todo;
