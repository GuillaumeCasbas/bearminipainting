import { useEffect } from 'react';
import { useProjetStore } from '../stores/projetStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useProjetStore();

  // Supprimer automatiquement les toasts après 5 secondes
  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded-md shadow-lg animate-slide-in-right
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `}
          role="alert"
        >
          <div className="flex items-center gap-2">
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
