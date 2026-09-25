import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProjectDetail } from './components/ProjectDetail';
import { UnitDetail } from './components/UnitDetail';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './components/SettingsPage';
import ToastContainer from './components/Toast';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ToggleDoneTodos } from './components/ToggleDoneTodos';
import { useProjectStore } from './stores/projectStore';
import { useUiPreferencesStore } from './stores/uiPreferencesStore';
import { BASE_PATH } from '@/ui/config';

function AppBanner() {
  const location = useLocation();
  const isUnitDetailPage = location.pathname.startsWith('/units/');

  if (!isUnitDetailPage) {
    return null;
  }

  return (
    <div className="mb-6 flex justify-end">
      <ToggleDoneTodos />
    </div>
  );
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
            <Navbar />
            <AppBanner />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/settings" element={<SettingsPage />} />
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
