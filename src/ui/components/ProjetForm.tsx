import { useState } from 'react';
import { useProjetStore } from '../stores/projetStore';

export default function ProjetForm() {
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const { addProjet, isLoading } = useProjetStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProjet(nom, code);
    setNom('');
    setCode('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Créer un nouveau projet
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet
          </label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Armée des Orques"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Code unique
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: ORQ-001"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Création...' : 'Créer le projet'}
        </button>
      </form>
    </div>
  );
}
