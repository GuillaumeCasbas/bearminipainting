import ProjectList from '../ProjectList';
import { ProjectForm } from '../ProjectForm';
import { Sidebar } from '../Sidebar';

export function HomePage() {
  return (
    <div className="flex flex-row gap-6 items-start">
      <main className="flex-1 min-w-0">
        <ProjectList />
      </main>
      <Sidebar title="Create a new project">
        <ProjectForm />
      </Sidebar>
    </div>
  );
}
