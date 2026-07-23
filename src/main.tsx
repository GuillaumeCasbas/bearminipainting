import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import './ui/index.css';
import { EncouragementContext } from './ui/contexts/EncouragementContext';
import { GetRandomEncouragementMessageUseCase } from './core/usecases/get-random-encouragement-message.usecase';
import LocalStorageEncouragementRepository from './adapters/persistence/localstorage/encouragement.repository';

const encouragementUseCase = new GetRandomEncouragementMessageUseCase(
  new LocalStorageEncouragementRepository()
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EncouragementContext.Provider value={encouragementUseCase}>
      <App />
    </EncouragementContext.Provider>
  </React.StrictMode>,
);
