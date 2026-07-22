import { create } from 'zustand';
import {
  Projet,
  LocalStorageProjetRepository,
  CreateProjetUseCase,
  CodeNotUniqueError,
} from '../../adapters/ui/projet';

// Types pour les notifications toast
type ToastType = 'success' | 'error' | 'info';

interface ToastNotification {
  id: string;
  type: ToastType;
  message: string;
}

interface ProjetStore {
  // État
  projets: Projet[];
  isLoading: boolean;
  toasts: ToastNotification[];
  
  // Actions
  addProjet: (nom: string, code: string) => Promise<void>;
  loadProjets: () => Promise<void>;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

// Initialisation du use case et repository
const projetRepository = new LocalStorageProjetRepository();
const createProjetUseCase = new CreateProjetUseCase(projetRepository);

export const useProjetStore = create<ProjetStore>((set) => ({
  // État initial
  projets: [],
  isLoading: false,
  toasts: [],
  
  // Charger les projets depuis le repository
  loadProjets: async () => {
    set({ isLoading: true });
    try {
      const projets = await projetRepository.findAll();
      set({ projets, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      set({ toasts: [...useProjetStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'error',
        message: 'Erreur lors du chargement des projets'
      }] });
    }
  },
  
  // Créer un nouveau projet
  addProjet: async (nom: string, code: string) => {
    try {
      const newProjet = await createProjetUseCase.execute(nom, code);
      
      // Recharger la liste des projets
      const projets = await projetRepository.findAll();
      set({ projets });
      
      // Afficher un toast de succès
      set({ toasts: [...useProjetStore.getState().toasts, {
        id: Date.now().toString(),
        type: 'success',
        message: `Projet "${newProjet.nom}" créé avec succès !`
      }] });
    } catch (error) {
      // Gérer l'erreur CodeNotUniqueError
      if (error instanceof CodeNotUniqueError) {
        set({ toasts: [...useProjetStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: `Le code "${error.code}" est déjà utilisé.`
        }] });
      } else {
        set({ toasts: [...useProjetStore.getState().toasts, {
          id: Date.now().toString(),
          type: 'error',
          message: 'Erreur lors de la création du projet'
        }] });
      }
    }
  },
  
  // Gestion des toasts
  addToast: (type, message) => {
    set({ toasts: [...useProjetStore.getState().toasts, {
      id: Date.now().toString(),
      type,
      message
    }] });
  },
  
  removeToast: (id) => {
    set({ toasts: useProjetStore.getState().toasts.filter(t => t.id !== id) });
  }
}));
