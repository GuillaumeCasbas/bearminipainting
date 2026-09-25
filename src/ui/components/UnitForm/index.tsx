import { useState } from 'react';
import { Modal } from '../Modal';

interface UnitFormProps {
  onClose: () => void;
  onSubmit: (name: string, code: string) => Promise<void>;
}

export function UnitForm({ onClose, onSubmit }: UnitFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validation
    if (!name.trim()) {
      setError('Unit name cannot be empty');
      return;
    }

    if (!code.trim()) {
      setError('Unit code cannot be empty');
      return;
    }

    try {
      await onSubmit(name, code);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={handleCancel} title="Add Unit">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Code *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and hyphens allowed</p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}
