import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useProjectContext } from '@/ui/contexts/projectContext';
import { useProjectStore } from '@/ui/stores/projectStore';
import { useUiPreferencesStore } from '@/ui/stores/uiPreferencesStore';
import { UnitNotFoundError, OrphanedUnitError } from '@/core/errors';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { SortableTodoRow } from '@/ui/components/UnitDetail/SortableTodoRow';
import { Modal } from '@/ui/components/Modal';

export function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(null);

  const { getUnitByIdUseCase, getProjectByIdUseCase } = useProjectContext();
  const {
    projects,
    toggleTodoStatus,
    addTodo,
    deleteTodo,
    deleteUnit,
    reorderTodos,
    updateUnitName,
  } = useProjectStore();
  const { hideDoneTodos } = useUiPreferencesStore();
  const [newTodoLabel, setNewTodoLabel] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState<boolean>(false);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const editNameInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
    setNewTodoLabel('');

    // Auto-focus the input for quick addition of multiple todos
    setTimeout(() => {
      if (newTodoInputRef.current) {
        newTodoInputRef.current.focus();
      }
    }, 0);
  };

  const startEditingName = () => {
    if (!unit) return;
    setEditedName(unit.name);
    setNameError('');
    setIsEditingName(true);
    setTimeout(() => {
      if (editNameInputRef.current) {
        editNameInputRef.current.focus();
        editNameInputRef.current.select();
      }
    }, 0);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setEditedName('');
    setNameError('');
  };

  const saveName = async () => {
    if (!unit) return;

    const trimmedName = editedName.trim();

    // No change: cancel without error
    if (trimmedName === unit.name) {
      cancelEditingName();
      return;
    }

    if (trimmedName === '') {
      setNameError('Unit name cannot be empty');
      return;
    }

    const success = await updateUnitName(unit.id, trimmedName);
    if (success) {
      setIsEditingName(false);
      setEditedName('');
      setNameError('');
    }
  };

  useEffect(() => {
    const loadUnitDetails = async () => {
      if (!unitId) {
        setError({ code: 404, message: 'Unit not found.' });
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
        const projectData = await getProjectByIdUseCase.execute(unitData.projectId);

        if (!projectData) {
          // Parent project no longer exists (BEA-20 basic handling)
          const orphanedError = new OrphanedUnitError(unitData.id, unitData.projectId);
          setError({ code: 404, message: orphanedError.message });
        }
      } catch (err) {
        if (err instanceof UnitNotFoundError) {
          setError({ code: 404, message: err.message });
        } else {
          setError({
            code: 500,
            message: 'Failed to load unit details. Please try again.',
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

  // Filtered todos for display: hide DONE todos when the toggle is off
  const visibleTodos = hideDoneTodos ? sortedTodos.filter((t) => t.status !== 'DONE') : sortedTodos;

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
              <span className="mx-2 text-gray-400">{'>'}</span>
            </li>
            <li className="flex items-center">
              <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                {project.name}
              </Link>
              <span className="mx-2 text-gray-400">{'>'}</span>
            </li>
            <li>
              <span className="text-gray-600">{unit.name}</span>
            </li>
          </ol>
        </nav>

        {/* Unit Header */}
        <div className="mb-6">
          {isEditingName ? (
            <div className="mb-2">
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => {
                    setEditedName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      saveName();
                    }
                  }}
                  ref={editNameInputRef}
                  className="flex-1 max-w-md text-4xl font-bold text-gray-900 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Edit unit name"
                />
                <button
                  onClick={saveName}
                  className="mt-1 inline-flex items-center justify-center w-10 h-10 text-green-600 hover:text-green-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  aria-label="Save unit name"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={cancelEditingName}
                  className="mt-1 inline-flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  aria-label="Cancel unit name edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {nameError && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {nameError}
                </p>
              )}
            </div>
          ) : (
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-4xl font-bold text-gray-900">{unit.name}</h1>
              <button
                onClick={startEditingName}
                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Edit unit name"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {project.code}-{unit.code}
            </span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="mb-6">
          <ProgressBar completionRate={completionRate} withLabel />
        </div>

        {/* Todos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Todos</h2>
          <p className="text-sm text-gray-600">
            {sortedTodos.length} total,
            {sortedTodos.filter((t) => t.status === 'DONE').length} completed
          </p>
        </div>

        {/* Todos List */}
        <div>
          {sortedTodos.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No todos for this unit.</p>
          ) : visibleTodos.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-lg font-semibold text-green-600">All todos done 🎉</p>
            </div>
          ) : hideDoneTodos ? (
            <>
              <p className="text-xs text-gray-400 italic mb-2">
                Reordering is only available when all todos are visible.
              </p>
              <div className="divide-y divide-gray-100">
                {visibleTodos.map((todo) => (
                  <SortableTodoRow
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleTodoStatus(unit.id, todo.id)}
                    onDelete={() => deleteTodo(unit.id, todo.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;
                const oldIndex = sortedTodos.findIndex((t) => t.id === active.id);
                const newIndex = sortedTodos.findIndex((t) => t.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return;
                const reordered = arrayMove(sortedTodos, oldIndex, newIndex);
                reorderTodos(
                  unit.id,
                  reordered.map((t) => t.id),
                );
              }}
            >
              <SortableContext
                items={sortedTodos.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-100">
                  {sortedTodos.map((todo) => (
                    <SortableTodoRow
                      key={todo.id}
                      todo={todo}
                      onToggle={() => toggleTodoStatus(unit.id, todo.id)}
                      onDelete={() => deleteTodo(unit.id, todo.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
                if (e.key === 'Enter') {
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {unit && project && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Deletion"
        >
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
        </Modal>
      )}
    </div>
  );
}
