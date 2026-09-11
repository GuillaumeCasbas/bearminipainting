import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Unit } from "@/core/entities/Unit";
import { Project } from "@/core/entities/Project";
import { useProjectContext } from "@/ui/contexts/projectContext";
import { useProjectStore } from "@/ui/stores/projectStore";
import { UnitNotFoundError, OrphanedUnitError } from "@/core/errors";
import { getCompletionRateColor } from "@/ui/utils/completionColors";
import { Dropdown, DropdownItem } from "@/ui/components/Dropdown";
import {ProgressBar} from "@/ui/components/ProgressBar";

export function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null,
  );

  const { getUnitByIdUseCase, getProjectByIdUseCase } = useProjectContext();
  const { projects, toggleTodoStatus, addTodo, deleteTodo, deleteUnit } = useProjectStore();
  const [newTodoLabel, setNewTodoLabel] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState<boolean>(false);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Find unit and project from store
  const unit = useMemo(() => {
    if (!unitId) return null;
    for (const project of projects) {
      const foundUnit = project.units.find((u) => u.id === unitId);
      if (foundUnit) return foundUnit;
    }
    return null;
  }, [unitId, projects]);

  const project = useMemo(() => {
    if (!unit) return null;
    return projects.find((p) => p.id === unit.projectId) ?? null;
  }, [unit, projects]);

  const handleAddTodo = async () => {
    if (!newTodoLabel.trim() || !unit) return;

    await addTodo(unit.id, newTodoLabel);
    setNewTodoLabel("");

    // Auto-focus the input for quick addition of multiple todos
    setTimeout(() => {
      if (newTodoInputRef.current) {
        newTodoInputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    const loadUnitDetails = async () => {
      if (!unitId) {
        setError({ code: 404, message: "Unit not found." });
        setIsLoading(false);
        return;
      }

      // If unit is already in store, no need to load
      if (unit) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load unit
        const unitData = await getUnitByIdUseCase.execute(unitId);

        // Load parent project for full code and name display
        const projectData = await getProjectByIdUseCase.execute(
          unitData.projectId,
        );

        if (!projectData) {
          // Parent project no longer exists (BEA-20 basic handling)
          const orphanedError = new OrphanedUnitError(
            unitData.id,
            unitData.projectId,
          );
          setError({ code: 404, message: orphanedError.message });
        }
      } catch (err) {
        if (err instanceof UnitNotFoundError) {
          setError({ code: 404, message: err.message });
        } else {
          setError({
            code: 500,
            message: "Failed to load unit details. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitDetails();
  }, [unitId, getUnitByIdUseCase, getProjectByIdUseCase, unit]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading unit details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error {error.code}</p>
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!unit || !project) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Unit details not available.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Sort todos by order (ascending) for display
  const sortedTodos = [...unit.todos].sort((a, b) => a.order - b.order);
  const completionRate = unit.getCompletionRate();

  return (
    <div>
    {/* Main card */}
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Projects
            </Link>
            <span className="mx-2 text-gray-400">{">"}</span>
          </li>
          <li className="flex items-center">
            <Link
              to={`/projects/${project.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {project.name}
            </Link>
            <span className="mx-2 text-gray-400">{">"}</span>
          </li>
          <li>
            <span className="text-gray-600">{unit.name}</span>
          </li>
        </ol>
      </nav>

      {/* Unit Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{unit.name}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {project.code}-{unit.code}
          </span>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <ProgressBar completionRate={completionRate}  withLabel />
      </div>

      {/* Total Todos */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Todos</h2>
        <p className="text-sm text-gray-600">
          {sortedTodos.length} total,
          {sortedTodos.filter((t) => t.status === "DONE").length} completed
        </p>
      </div>

      {/* Todos List */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Todo List</h2>
        </div>

        {sortedTodos.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No todos for this unit.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    État
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Label
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTodos.map((todo) => (
                  <tr
                    key={todo.id}
                    className="hover:bg-gray-50 transition-colors"
                    data-order={todo.order} // For future drag-and-drop
                    data-todo-id={todo.id} // For future drag-and-drop
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input
                        type="checkbox"
                        checked={todo.status === "DONE"}
                        onChange={() => toggleTodoStatus(unit.id, todo.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        aria-label={`Todo ${todo.label} ${todo.status === "DONE" ? "completed" : "not completed"}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                      <div className="flex items-center justify-between">
                        <span
                          className={
                            todo.status === "DONE"
                              ? "line-through text-gray-400"
                              : "text-gray-900"
                          }
                        >
                          {todo.label}
                        </span>
                        <Dropdown
                          position="left"
                          trigger={
                            <button
                              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label="Delete todo"
                              title="Delete todo"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          }
                        >
                          <DropdownItem
                            danger
                            onClick={() => deleteTodo(unit.id, todo.id)}
                          >
                            Delete this todo
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Custom Todo Input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoLabel}
            onChange={(e) => setNewTodoLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            ref={newTodoInputRef}
            placeholder="Add a custom todo..."
            autoComplete="off"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Add custom todo"
          />
          <button
            onClick={handleAddTodo}
            disabled={!newTodoLabel.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-3"
        >
          Back to Project
        </button>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Home
        </button>
      </div>
    </div>

      {/* Danger Zone - Delete Unit (Accordion) */}
      <div className="mt-4 border-2 border-red-500 rounded-lg bg-red-50">
        <button
            onClick={() => setIsDangerZoneOpen(!isDangerZoneOpen)}
            className="w-full p-4 flex justify-between items-center text-left"
            aria-expanded={isDangerZoneOpen}
            aria-controls="unit-danger-zone-content"
        >
          <h3 className="text-lg font-semibold text-red-700">Danger zone</h3>
          <svg
              className={`w-5 h-5 text-red-700 transition-transform ${isDangerZoneOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
          >
            <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
          </svg>
        </button>
        {isDangerZoneOpen && (
            <div id="unit-danger-zone-content" className="px-4 pb-4">
              <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 underline transition-colors"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete this unit
              </button>
            </div>
        )
        }
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && unit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this unit? This action cannot be undone.
              </p>
              <p className="text-sm text-red-600 mb-6">
                Warning: All todos in this unit will also be deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                    onClick={async () => {
                      try {
                        await deleteUnit(unit.id);
                        navigate(`/projects/${project.id}`);
                      } catch (error) {
                        setShowDeleteModal(false);
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Failed to delete unit:', error);
                        }
                      }
                    }}
                    className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
      )}

    </div>
  );
}
