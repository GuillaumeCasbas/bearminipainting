"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProjectRepository = void 0;
const Project_1 = require("../../../core/entities/Project");
const Unit_1 = require("../../../core/entities/Unit");
const Todo_1 = require("../../../core/entities/Todo");
class LocalStorageProjectRepository {
    constructor() {
        this.STORAGE_KEY = 'minipaint_projects';
    }
    async save(project) {
        const projects = this.getAllFromStorage();
        const updatedProjects = [
            ...projects.filter((p) => p.id !== project.id),
            project,
        ];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
    }
    async findById(id) {
        const projects = this.getAllFromStorage();
        return projects.find((p) => p.id === id) ?? null;
    }
    async findByCode(code) {
        const projects = this.getAllFromStorage();
        return projects.find((p) => p.code === code) ?? null;
    }
    async findAll() {
        return this.getAllFromStorage();
    }
    getAllFromStorage() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            return [];
        }
        try {
            const parsed = JSON.parse(data);
            return parsed.map((item) => {
                const units = item.units
                    ? item.units.map((unitItem) => new Unit_1.Unit(unitItem.id, unitItem.name, unitItem.code, unitItem.projectId, unitItem.todos
                        ? unitItem.todos.map((todoItem) => new Todo_1.Todo(todoItem.id, todoItem.label, todoItem.status, todoItem.order))
                        : []))
                    : [];
                return new Project_1.Project(item.id, item.name, item.code, units);
            });
        }
        catch {
            return [];
        }
    }
}
exports.LocalStorageProjectRepository = LocalStorageProjectRepository;
