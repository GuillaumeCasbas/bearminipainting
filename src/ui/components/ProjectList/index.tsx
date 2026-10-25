import { Link } from 'react-router-dom';
import { useProjectStore } from '@/ui/stores/projectStore';
import { Project } from '@/core/entities/Project';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { ProjectIcon } from '@/ui/components/Icons';

export default function ProjectList() {
  const { projects, isLoading } = useProjectStore();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Projects</h2>
        <p className="text-gray-500 text-center py-8">No projects created yet.</p>
      </div>
    );
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const rateDiff = b.getCompletionRate() - a.getCompletionRate();
    if (rateDiff !== 0) return rateDiff;
    const nameDiff = a.name.localeCompare(b.name);
    if (nameDiff !== 0) return nameDiff;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Projects</h2>
      <div className="space-y-4">
        {sortedProjects.map((project: Project) => (
          <div
            key={project.id}
            data-testid="project-card"
            className="bg-blue-50 border border-blue-200 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <ProjectIcon className="w-5 h-5 text-blue-600" />
                <Link
                  to={`/projects/${project.id}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {project.name}
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{project.code}</span>
              <div className="w-40">
                <ProgressBar completionRate={project.getCompletionRate()} withLabel />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
