import { useCallback, useEffect, useState } from 'react';
import ProjectList from '../ProjectList';
import { ProjectForm } from '../ProjectForm';
import { Sidebar } from '../Sidebar';
import { AlmostThereSection } from '../AlmostThereSection';
import { subscribeProjectEvents } from '@/ui/stores/projectStore';

export function HomePage() {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const closeSidebar = useCallback(() => setIsSidebarMobileOpen(false), []);

  useEffect(() => subscribeProjectEvents(closeSidebar), [closeSidebar]);

  return (
    <div className="flex flex-row gap-6 items-start">
      <main className="flex-1 min-w-0 flex flex-col gap-6">
        <AlmostThereSection />
        <ProjectList />
      </main>
      <Sidebar
        title="Create a new project"
        isMobileOpen={isSidebarMobileOpen}
        onMobileOpenChange={setIsSidebarMobileOpen}
      >
        <ProjectForm />
      </Sidebar>
    </div>
  );
}
