import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/core/entities/Todo';
import { Dropdown, DropdownItem } from '@/ui/components/Dropdown';

interface SortableTodoRowProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function SortableTodoRow({ todo, onToggle, onDelete }: SortableTodoRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md mb-2 ${
        isDragging ? 'opacity-50 shadow-lg ring-2 ring-blue-400' : 'hover:bg-gray-50'
      } transition-shadow`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`Drag to reorder ${todo.label}`}
          title="Drag to reorder"
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
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
        <input
          type="checkbox"
          checked={todo.status === 'DONE'}
          onChange={onToggle}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          aria-label={`Todo ${todo.label} ${todo.status === 'DONE' ? 'completed' : 'not completed'}`}
        />
        <span
          className={
            todo.status === 'DONE'
              ? 'line-through text-gray-400 text-sm'
              : 'text-gray-900 text-sm'
          }
        >
          {todo.label}
        </span>
      </div>
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
        <DropdownItem danger onClick={onDelete}>
          Delete this todo
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
