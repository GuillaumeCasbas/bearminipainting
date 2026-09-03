import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Unit } from '@/core/entities/Unit';
import { Project } from '@/core/entities/Project';
import { useProjectContext } from '@/ui/contexts/projectContext';
import { COMPLETION_RATE_RED_THRESHOLD, COMPLETION_RATE_GREEN_THRESHOLD } from '@/ui/constants';

export function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(null);

  const { getUnitByIdUseCase, getProjectByIdUseCase } = useProjectContext();

  useEffect(() => {
    const loadUnitDetails = async () => {
      if (!unitId) {
        setError({ code: 404, message: 'Unit not found.' });
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
          setError({ code: 404, message: 'Parent project not found.' });
        } else {
          setUnit(unitData);
          setProject(projectData);
        }
      } catch (err) {
        setError({ code: 404, message: 'Unit not found.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitDetails();
  }, [unitId, getUnitByIdUseCase, getProjectByIdUseCase]);

  const getCompletionRateColor = (rate: number): string => {
    if (rate < COMPLETION_RATE_RED_THRESHOLD) return 'bg-red-500';
    if (rate < COMPLETION_RATE_GREEN_THRESHOLD) return 'bg-orange-500';
    return 'bg-green-500';
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{unit.name}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Full Code: {project.code}-{unit.code}
          </span>
          <span className="text-sm text-gray-500">
            Project: {project.name}
          </span>
          <span className="text-sm text-gray-500">
            ID: {unit.id.substring(0, 8)}...
          </span>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Completion Rate</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full ${getCompletionRateColor(completionRate)}`}
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {completionRate}% complete
        </p>
      </div>

      {/* Total Todos */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Todos</h2>
        <p className="text-sm text-gray-600">
          {sortedTodos.length} total, 
          {sortedTodos.filter(t => t.status === 'DONE').length} completed
        </p>
      </div>

      {/* Todos List - Read-only, prepared for future drag-and-drop */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Todo List</h2>
          <span className="text-sm text-gray-500">Read-only</span>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                        checked={todo.status === 'DONE'}
                        disabled
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        aria-label={`Todo ${todo.label} ${todo.status === 'DONE' ? 'completed' : 'not completed'}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {todo.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        todo.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {todo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}