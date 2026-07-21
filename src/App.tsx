import { useEffect } from 'react';
import ProjetForm from './components/ProjetForm';
import ProjetList from './components/ProjetList';
import ToastContainer from './components/Toast';
import { useProjetStore } from './stores/projetStore';

function App() {
  const { loadProjets } = useProjetStore();

  // Charger les projets au montage
  useEffect(() => {
    loadProjets();
  }, [loadProjets]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MiniPaint</h1>
          <p className="text-gray-600 mt-1">
            Suivez l'avancement de vos armées Warhammer
          </p>
        </header>

        <main>
          <ProjetForm />
          <ProjetList />
        </main>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
