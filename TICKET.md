# refactor: Uniformiser le mock de localStorage pour les tests

## Description
Actuellement, le mock de `localStorage` est dupliqué dans plusieurs fichiers de test (`jest.setup.js`, `localstorage-project.repository.test.ts`, `encouragement.repository.test.ts`). Cela pose des problèmes de maintenance et de cohérence.

## Objectifs
- Centraliser le mock dans `jest.setup.js` (déjà configuré dans `jest.config.cjs` via `setupFilesAfterEnv`).
- Supprimer les mocks redondants dans les fichiers de test.
- Utiliser `globalThis` au lieu de `global` pour une meilleure compatibilité.
- Garantir que tous les tests utilisent le même mock.

---

## Acceptance Criteria
- [ ] Le mock de `localStorage` est défini **uniquement** dans `jest.setup.js`.
- [ ] Tous les tests utilisent le mock global (pas de redéfinition locale).
- [ ] `npm test` passe avec succès.
- [ ] Le code est conforme aux règles du projet (`RULES.md`).

---

## Tâches techniques
1. Mettre à jour `jest.setup.js` pour :
   - Utiliser `globalThis` au lieu de `global`.
   - Ajouter un reset automatique du `store` avant chaque test (via `beforeEach` global).
2. Supprimer les mocks locaux dans :
   - `tests/adapters/persistence/localstorage-project.repository.test.ts`
   - `tests/adapters/persistence/localstorage/encouragement.repository.test.ts`
3. Vérifier que tous les tests passent.

## Priorité
Moyenne (amélioration de la maintenabilité).
