import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Unit } from '@/core/entities/Unit';
import { Project } from '@/core/entities/Project';
import { UnitForm } from '@/ui/components/UnitForm';
import { useProjectStore } from '@/ui/stores/projectStore';
import {ProgressBar} from "@/ui/components/ProgressBar";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(null);
  const [showUnitForm, setShowUnitForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState<boolean>(false);

  const { addUnit, deleteProject, loadProjects, getProjectById } = useProjectStore();

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError({ code: 404, message: 'Project ID is missing' });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const project = await getProjectById(id);
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
  }, [id, getProjectById]);

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
    <div>

    {/* Main card */ }
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{project.code}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-800">{project.getCompletionRate()}%</span>
          <ProgressBar completionRate={project.getCompletionRate()} />
        </div>
      </div>

      {/* Units List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Units</h2>
          <button
            onClick={() => setShowUnitForm(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Unit
          </button>
        </div>
        {project.units.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No units, please add new one to start your wonderful painting journey!
          </p>
        ) : (
          <div className="space-y-4">
            {[...project.units]
              .sort((a, b) => {
                const rateDiff = b.getCompletionRate() - a.getCompletionRate();
                if (rateDiff !== 0) return rateDiff;
                return a.name.localeCompare(b.name);
              })
              .map((unit: Unit) => (
                <div
                  key={unit.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      to={`/units/${unit.id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {unit.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{project.code}-{unit.code}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-40">
                        <ProgressBar completionRate={unit.getCompletionRate()} withLabel />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Unit Modal */}
      {showUnitForm && id && (
        <UnitForm
          projectId={id}
          onClose={() => setShowUnitForm(false)}
          onSubmit={async (name: string, code: string) => {
            await addUnit(id, name, code);
            // Refresh the project after adding a unit
            const updatedProject = await getProjectById(id);
            if (updatedProject) {
              setProject(updatedProject);
            }
          }}
        />
      )}
    </div>

      {/* Danger Zone - Delete Project (Accordion) */}
      <div className="mt-4 border-2 border-red-500 rounded-lg bg-red-50">
        <button
            onClick={() => setIsDangerZoneOpen(!isDangerZoneOpen)}
            className="w-full p-4 flex justify-between items-center text-left"
            aria-expanded={isDangerZoneOpen}
            aria-controls="danger-zone-content"
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
            <div id="danger-zone-content" className="px-4 pb-4">
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
                Delete this project
              </button>
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && project && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Warning: Deleting {project.name} will also delete its {project.units.length} units and all their todos. This action cannot be undone. Continue?
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
                      if (!id) {
                        return;
                      }
                      try {
                        await deleteProject(id);
                        navigate('/');
                      } catch (error) {
                        // Error is already handled by the store (toast shown)
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Failed to delete project:', error);
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
