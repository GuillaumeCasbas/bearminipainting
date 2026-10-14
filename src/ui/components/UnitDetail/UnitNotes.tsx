import { useState } from 'react';
import { Unit } from '@/core/entities/Unit';
import { UNIT_NOTES_MAX_LENGTH } from '@/core/constants/unit-notes';
import { RenderMarkdown } from '@/ui/components/RenderMarkdown';

interface UnitNotesProps {
  unit: Unit;
  onSave: (newNotes: string) => Promise<boolean>;
}

export function UnitNotes({ unit, onSave }: UnitNotesProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedNotes, setEditedNotes] = useState<string>('');

  const startEditing = () => {
    setEditedNotes(unit.notes);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedNotes('');
  };

  const save = async () => {
    const success = await onSave(editedNotes);
    if (success) {
      setIsEditing(false);
      setEditedNotes('');
    }
  };

  if (isEditing) {
    return (
      <div className="mb-6">
        <textarea
          value={editedNotes}
          onChange={(e) => setEditedNotes(e.target.value.slice(0, UNIT_NOTES_MAX_LENGTH))}
          aria-label="Unit notes"
          maxLength={UNIT_NOTES_MAX_LENGTH}
          rows={5}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            {editedNotes.length}/{UNIT_NOTES_MAX_LENGTH} characters
          </p>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="inline-flex items-center justify-center w-9 h-9 text-green-600 hover:text-green-700 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Save unit notes"
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
              className="inline-flex items-center justify-center w-9 h-9 text-red-600 hover:text-red-700 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Cancel unit notes edit"
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
        </div>
      </div>
    );
  }

  if (unit.notes === '') {
    return (
      <div className="mb-6">
        <button
          onClick={startEditing}
          className="text-blue-600 hover:text-blue-800 underline"
          aria-label="add notes to this unit"
        >
          add notes to this unit
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
        <button
          onClick={startEditing}
          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 transition-colors"
          aria-label="Edit unit notes"
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
      <div className="border border-gray-300 rounded-md p-3">
        <RenderMarkdown content={unit.notes} />
      </div>
    </div>
  );
}
