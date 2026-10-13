import { useState, useRef } from 'react';

interface EditableNameProps {
  name: string;
  entityLabel: string;
  onSave: (newName: string) => Promise<boolean>;
}

export function EditableName({ name, entityLabel, onSave }: EditableNameProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const editNameInputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditedName(name);
    setNameError('');
    setIsEditing(true);
    setTimeout(() => {
      if (editNameInputRef.current) {
        editNameInputRef.current.focus();
        editNameInputRef.current.select();
      }
    }, 0);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName('');
    setNameError('');
  };

  const save = async () => {
    const trimmedName = editedName.trim();

    // No change: cancel without error
    if (trimmedName === name) {
      cancelEditing();
      return;
    }

    if (trimmedName === '') {
      setNameError(`${entityLabel} name cannot be empty`);
      return;
    }

    const success = await onSave(trimmedName);
    if (success) {
      setIsEditing(false);
      setEditedName('');
      setNameError('');
    }
  };

  if (isEditing) {
    return (
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
                save();
              }
            }}
            ref={editNameInputRef}
            className="flex-1 max-w-md text-4xl font-bold text-gray-900 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={`Edit ${entityLabel.toLowerCase()} name`}
          />
          <button
            onClick={save}
            className="mt-1 inline-flex items-center justify-center w-10 h-10 text-green-600 hover:text-green-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label={`Save ${entityLabel.toLowerCase()} name`}
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
            onClick={cancelEditing}
            className="mt-1 inline-flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label={`Cancel ${entityLabel.toLowerCase()} name edit`}
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
    );
  }

  return (
    <div className="mb-2 flex items-center gap-2">
      <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
      <button
        onClick={startEditing}
        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 transition-colors"
        aria-label={`Edit ${entityLabel.toLowerCase()} name`}
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
  );
}
