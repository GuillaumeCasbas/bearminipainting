import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project } from '../../../adapters/ui/project';
import { Unit } from '../../../adapters/ui/unit';
import { useProjectContext } from '../../contexts/project-context';

// Completion rate thresholds (from BEA-8 specifications)
const COMPLETION_RATE_RED_THRESHOLD = 20;
const COMPLETION_RATE_GREEN_THRESHOLD = 80;

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(null);

  const { getProjectByIdUseCase } = useProjectContext();

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError({ code: 404, message: 'Project not found.' });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const project = await getProjectByIdUseCase.execute(id);
        if (!project) {
          setError({ code: 404, message: 'Project not found.' });
        } else {
          setProject(project);
        }
      } catch (err) {
        setError({ code: 500, message: 'Failed to load project details. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const getCompletionRateColor = (rate: number): string => {
    if (rate < COMPLETION_RATE_RED_THRESHOLD) return 'bg-red-500';
    if (rate < COMPLETION_RATE_GREEN_THRESHOLD) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading project details...</p>
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
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Project not found.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

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
          <li>
            <span className="text-gray-600">{project.name}</span>
          </li>
        </ol>
      </nav>

      {/* Project Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Code: {project.code}</span>
          <span className="text-sm text-gray-500">ID: {project.id.substring(0, 8)}...</span>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Completion Rate</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full ${getCompletionRateColor(project.getCompletionRate())}`}
            style={{ width: `${project.getCompletionRate()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {project.getCompletionRate()}% complete
        </p>
      </div>

      {/* Total Units */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Units</h2>
        <p className="text-sm text-gray-600">{project.units.length}</p>
      </div>

      {/* Units List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Units</h2>
        {project.units.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No units, please add new one to start your wonderful painting journey!
          </p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {project.units.map((unit: Unit) => (
              <li key={unit.id} className="text-sm text-gray-700">
                {unit.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}
