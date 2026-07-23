import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';

export default function ProjectForm() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { addProject, isLoading } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject(name, code);
    setName('');
    setCode('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 id="project-form-title" className="text-xl font-semibold text-gray-800 mb-4">
        Create a new project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="project-form-title">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Orks Army"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Unique code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. ORK-001"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
