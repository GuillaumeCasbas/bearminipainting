import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProjectDetail } from './components/ProjectDetail';
import { UnitDetail } from './components/UnitDetail';
import ToastContainer from './components/Toast';
import { Footer } from './components/Footer';
import { useProjectStore } from './stores/projectStore';
import { BASE_PATH } from '@/ui/config';

export function App() {
  const { loadProjects } = useProjectStore();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <Router basename={BASE_PATH}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex flex-col p-8">
          <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">MiniPaint</h1>
              <p className="text-gray-600 mt-1">Track your miniature painting progress</p>
            </header>

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
