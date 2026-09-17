import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProjectDetail } from './components/ProjectDetail';
import { UnitDetail } from './components/UnitDetail';
import ToastContainer from './components/Toast';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToggleDoneTodos } from './components/ToggleDoneTodos';
import { useProjectStore } from './stores/projectStore';
import { useUiPreferencesStore } from './stores/uiPreferencesStore';
import { BASE_PATH } from '@/ui/config';

function AppHeader() {
  const location = useLocation();
  const isUnitDetailPage = location.pathname.startsWith('/units/');

  return <Header actions={isUnitDetailPage ? <ToggleDoneTodos /> : undefined} />;
}

export function App() {
  const { loadProjects } = useProjectStore();
  const { initFromStorage } = useUiPreferencesStore();

  // Load projects and restore UI preferences on mount
  useEffect(() => {
    loadProjects();
    void initFromStorage();
  }, [loadProjects, initFromStorage]);

  return (
    <Router basename={BASE_PATH}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex flex-col p-8">
          <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
            <AppHeader />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/units/:unitId" element={<UnitDetail />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </div>

        <ToastContainer />
      </div>
    </Router>
  );
}
