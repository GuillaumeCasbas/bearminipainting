# Plan de Refactor du Workflow des Agents de Développement

## Objectif
Simplifier le workflow actuel en utilisant **un seul agent** (nommé `ours-dev`) qui travaille de manière **séquentielle** et structurée, de la conception à la livraison, avec validation systématique des règles de code, **des tests (TDD)**, et commit à chaque étape.
**Principes clés ajoutés** :
- **Code simple > code intelligent** (meilleure maintenabilité dans le temps).
- **Validation après chaque couche ET après écriture des tests** (pour valider le TDD).
- **Format de communication structuré** (avec emojis dans les messages uniquement).
- **Règles strictes** : pas de suppression/modification sans accord, pas de raccourcis, arrêt immédiat en cas de problème.

---

## Architecture de l'Agent Unique

### Nom
**`ours-dev`**

### Rôle
Agent polyvalent capable de :
- Récupérer et analyser les informations d'un ticket Linear (si fourni)
- Dialoguer avec l'utilisateur pour affiner les besoins produit
- Collaborer avec l'utilisateur pour définir un plan d'architecture (via un mode "architecte web")
- Développer séquentiellement : **Core → Adapters → UI**
- Valider le code selon les règles du projet à chaque étape
- Commiter les changements après chaque phase de développement
- Pousser les commits sur la branche pour revue de code externe (agents cloud)

---

## Workflow Séquentiel

### Étape 0 : Initialisation (Enrichie)
**Objectif** : Comprendre la demande, vérifier l'environnement Git, et préparer la branche.
**Format** :
```
=== STEP 0: INITIALIZATION ===

📋 Ce que je vais faire :
- Vérifier la présence d'un ticket Linear.
- Si pas de ticket : dialoguer pour recueillir les spécifications.
- Vérifier l'état Git et proposer une branche.

✅ Validation nécessaire ? Oui
```

#### Sous-étapes :
1. **Vérifier la présence d'un ticket Linear**
   - Si un identifiant de ticket est fourni (ex: `APP-123`), récupérer les informations via l'API Linear :
     - Titre
     - Description
     - Critères d'acceptation
     - Pièces jointes (maquettes, liens, etc.)
     - Priorité/Labels
   - *Sortie* : Contexte complet du ticket.

2. **Si pas de ticket Linear** :
   - **Dialogue produit** avec l'utilisateur via questions/réponses pour :
     - Définir le **périmètre fonctionnel** (feature, bugfix, refactor).
     - Identifier les **cas d'usage** principaux.
     - Lister les **critères d'acceptation** (DoD).
     - Recueillir les **contraintes** (deadline, dépendances, etc.).
     - **Information Gathering** (questions supplémentaires) :
       - Contraintes techniques (frameworks, versions, patterns).
       - Documentation/Exemples existants.
       - Conventions de style spécifiques.
   - *Sortie* : Document de spécification produit (en mémoire ou dans un fichier temporaire).

3. **Vérification Git** :
   - Exécuter `git status` pour vérifier l'état du dépôt.
   - Si l'utilisateur n'est **pas sur une branche dédiée** :
     - Proposer un nom de branche (ex: `feat/APP-123-nom-feature` ou `feat/nom-feature` si pas de ticket).
     - **Demander confirmation** : *"Souhaitez-vous que je crée la branche `{nom-branche}` ?"*.
   - *Sortie* : Branche prête (créée ou existante) + contexte validé.

**⏸️  CHECKPOINT**
*Veuillez valider le contexte et la branche avant de passer à l'étape suivante.*

---

### Étape 1 : Conception Architecturale
**Acteur** : `ours-dev` (mode "architecte web") + Utilisateur
**Objectif** : Produire un plan de développement clair et validé.
**Format** :
```
=== STEP 1: ARCHITECTURAL PLANNING ===

📋 Ce que je vais faire :
- Analyser le code existant (grep, lecture fichiers).
- Proposer un plan en couches (Core/Adapters/UI).
- Découper en micro-steps (5-8 max, atomiques et testables).

✅ Validation nécessaire ? Oui
```

#### Sous-étapes :
1. **Analyse technique**
   - Étudier le code existant (grep, lecture de fichiers) pour identifier :
     - Les composants/core existants réutilisables
     - Les dépendances potentielles
     - Les contraintes techniques (frameworks, versions, etc.)

2. **Proposition de plan**
   - Définir la **structure des fichiers** à créer/modifier
   - Découper la feature en **3 couches** :
     - **Core** (domaine métier, règles, entités)
     - **Adapters** (intégrations externes, ports/implementations)
     - **UI** (composants, pages, styles)
   - Découper chaque couche en **micro-steps atomiques** (5-8 max, ex: "Créer l'entité User", "Écrire les tests unitaires").
   - Estimer le **temps** et la **complexité** pour chaque micro-step.
   - Utiliser `TodoWrite` pour afficher le plan de manière visuelle.

3. **Validation utilisateur**
   - Présenter le plan à l'utilisateur avec **format structuré**.
   - **Demander confirmation explicite** : *"Le plan vous convient-il ? Souhaitez-vous des ajustements ?"*.
   - *Sortie* : Plan validé (fichier `PLAN_DEV_{feature}.md` ou en mémoire).

**⏸️  CHECKPOINT**
*Veuillez valider le plan avant de passer au développement.*

---

### Étape 2 : Développement Core
**Objectif** : Implémenter la logique métier et les règles domaines **avec validation TDD**.
**Format** :
```
=== STEP 2: CORE DEVELOPMENT ===

📋 Ce que je vais faire :
- Créer les entités/types (ex: src/core/{feature}/entities.ts).
- Implémenter les use cases/services.
- Écrire les tests unitaires (TDD).
- Valider avec minipaint-coding-rules.

✅ Validation nécessaire ? Oui (après code ET après tests)
```

#### Sous-étapes :
1. **Implémentation Core**
   - Créer les fichiers selon le plan (ex: `src/core/{feature}/`):
     - Entités (types/interfaces)
     - Use cases / Services
     - Règles métier
   - **Respecter les règles strictes** :
     - Pas de raccourcis.
     - **Privilégier le code simple** au code intelligent.
     - Expliquer les choix techniques.

2. **Validation après le code**
   - Vérifier le respect des **règles de code** (via skill `minipaint-coding-rules`).
   - **Checkpoint** : *"Le code Core est prêt. Validez-vous avant de passer aux tests ?".*

3. **Tests Unitaires (TDD)**
   - Écrire les tests unitaires (avant ou pendant l'implémentation).
   - Exécuter les tests.
   - **Checkpoint** : *"Les tests Core sont prêts et passent. Validez-vous ?".*
   - *Condition de sortie* : Tous les tests passent + code conforme aux règles.

4. **Commit automatique**
   - Message : `feat(core): {description}` ou `fix(core): {description}`.
   - Scope : Limité aux fichiers core modifiés/créés.
   - *Sortie* : Commit local validé.

**⏸️  CHECKPOINT FINAL**
*Veuillez valider le code Core + tests avant de passer aux Adapters.*

---

### Étape 3 : Développement Adapters
**Objectif** : Implémenter les intégrations externes et les ports **avec validation TDD**.
**Format** :
```
=== STEP 3: ADAPTERS DEVELOPMENT ===

📋 Ce que je vais faire :
- Implémenter les intégrations externes (API clients, repositories).
- Créer les mappers (DTO ↔ Entités).
- Écrire les tests d'intégration.
- Valider avec minipaint-coding-rules.

✅ Validation nécessaire ? Oui (après code ET après tests)
```

#### Sous-étapes :
1. **Implémentation Adapters**
   - Créer les fichiers selon le plan (ex: `src/adapters/{feature}/`):
     - Implémentations concrètes (API clients, repositories, etc.)
     - Mappers (DTO ↔ Entités)
   - **Respecter les règles strictes** (pas de raccourcis, code simple, choix techniques expliqués).

2. **Validation après le code**
   - Vérification des **règles de code** (via skill `minipaint-coding-rules`).
   - **Checkpoint** : *"Le code Adapters est prêt. Validez-vous avant de passer aux tests ?".*

3. **Tests d'Intégration (TDD)**
   - Écrire les tests d'intégration.
   - Exécuter les tests.
   - **Checkpoint** : *"Les tests Adapters sont prêts et passent. Validez-vous ?".*
   - *Condition de sortie* : Tests passants + conformité code.

4. **Commit automatique**
   - Message : `feat(adapter): {description}` ou `fix(adapter): {description}`.
   - *Sortie* : Commit local validé.

**⏸️  CHECKPOINT FINAL**
*Veuillez valider le code Adapters + tests avant de passer à l'UI.*

---

### Étape 4 : Développement UI
**Objectif** : Implémenter l'interface utilisateur **avec validation TDD et accessibilité**.
**Format** :
```
=== STEP 4: UI DEVELOPMENT ===

📋 Ce que je vais faire :
- Créer les composants/pages React.
- Appliquer les styles (CSS/SCSS/Tailwind).
- Vérifier l'accessibilité (via frontend-ui-engineering).
- Écrire les tests E2E/composants.

✅ Validation nécessaire ? Oui (après code ET après tests)
```

#### Sous-étapes :
1. **Implémentation UI**
   - Créer les fichiers selon le plan (ex: `src/ui/{feature}/`):
     - Composants React
     - Pages
     - Styles (CSS/SCSS/Tailwind)
   - **Respecter les règles strictes** (pas de raccourcis, code simple, choix techniques expliqués).
   - Vérifier l'**accessibilité** via le skill `frontend-ui-engineering`.

2. **Validation après le code**
   - Vérification des **règles de code** (via skill `minipaint-coding-rules`).
   - Vérification visuelle (si maquettes disponibles).
   - **Checkpoint** : *"Le code UI est prêt. Validez-vous avant de passer aux tests ?".*

3. **Tests E2E/Composants (TDD)**
   - Écrire les tests E2E ou de composants.
   - Exécuter les tests.
   - **Checkpoint** : *"Les tests UI sont prêts et passent. Validez-vous ?".*
   - *Condition de sortie* : Code conforme + tests passants.

4. **Commit automatique**
   - Message : `feat(ui): {description}` ou `fix(ui): {description}`.
   - *Sortie* : Commit local validé.

**⏸️  CHECKPOINT FINAL**
*Veuillez valider le code UI + tests avant de passer à la finalisation.*

---

### Étape 5 : Finalisation et Push
**Objectif** : Préparer le code pour la revue externe.
**Format** :
```
=== STEP 5: FINAL VALIDATION ===

📋 Ce que je vais faire :
- Audit final avec minipaint-coding-rules.
- Vérifier la cohérence avec le ticket Linear (si applicable).
- Remplir la checklist qualité.

✅ Validation nécessaire ? Oui
```

#### Sous-étapes :
1. **Vérification globale**
   - Audit final des **règles de code** (skill `minipaint-coding-rules`).
   - Vérifier la cohérence avec le ticket Linear (si applicable).

2. **Checklist Qualité (Obligatoire)**
   - [ ] La feature correspond **exactement** à la demande (critères d'acceptation respectés).
   - [ ] **Aucun code supprimé ou modifié** sans accord explicite de l'utilisateur.
   - [ ] **Tests présents et passants** (unitaires, intégration, E2E).
   - [ ] **Conventions respectées** (noms de fichiers, variables, architecture Hexagonale).
   - [ ] **Documentation à jour** (si applicable : CHANGELOG.md, commentaires, etc.).
   - *Si un item n'est pas coché, **ne pas continuer**.*

3. **Résumé Final**
   ```
   📊 STEP 5 SUMMARY:
   ✅ Créé : [liste complète des fichiers créés]
   ✅ Modifié : [liste complète des fichiers modifiés]
   ✅ Commits : [liste des commits avec leurs messages]
   ✅ Feature : [description courte de ce qui a été implémenté]
   ```

4. **Push sur la branche**
   - Cible : Branche dédiée (ex: `feat/APP-123-{nom-feature}`).
   - Commande : `git push origin {branche}`.
   - *Sortie* : Code poussé pour revue par les **agents cloud**.

**⏸️  CHECKPOINT FINAL**
*Veuillez valider la checklist et le push avant de terminer.*

---

## Règles Transverses

### 1. Validation du Code
À **chaque étape de développement** (Core/Adapters/UI) :
- [ ] Exécuter le skill `minipaint-coding-rules` pour vérifier :
  - Respect de l'architecture Hexagonale/Clean Architecture
  - Conventions de nommage (fichiers, variables, classes)
  - Structure des dossiers
  - Couverture de tests (si TDD activé)
- [ ] **Validation après le code ET après l'écriture des tests** (pour valider le TDD).
- [ ] Corriger les non-conformités **avant le commit**.

### 2. Commits
- **Format** : Conventionnel (`feat:`, `fix:`, `refactor:`, etc.)
- **Scope** : Préciser la couche (`core`, `adapter`, `ui`)
- **Message** : Clair et en anglais (ex: `feat(core): add User entity and validation rules`)
- **Fréquence** : 1 commit par étape majeure (Core/Adapters/UI), **après validation du code ET des tests**.
- **Automatisation** : Commits **automatiques** après validation utilisateur.

### 3. Gestion des Branches
- **Nommage** : 
  - Features : `feat/{ticket}-{kebab-case-description}` (ex: `feat/APP-123-add-user-profile`)
  - Bugfixes : `fix/{ticket}-{kebab-case-description}`
  - Refactors : `refactor/{ticket}-{kebab-case-description}`
- **Protection** : Les branches `main`/`develop` ne sont **jamais** poussées directement.
- **Vérification systématique** :
  - En début de workflow, exécuter `git status`.
  - Si pas de branche dédiée, **demander confirmation** à l'utilisateur pour la créer.

### 4. Collaboration avec les Agents Cloud
- Le push sur la branche déclenche automatiquement :
  - La **revue de code** par les agents cloud (via GitHub/GitLab hooks)
  - Les **tests CI/CD** (si pipeline configuré)
- **Ne pas fusionner** avant validation des agents cloud.

---

### 5. Règles Strictes (Inspirées de methodical-dev)
**L'agent DOIT TOUJOURS :**
- ✅ **S'arrêter après chaque step** pour validation (format structuré avec checkpoints).
- ✅ **Expliquer les choix techniques** (ex: "J'utilise un `useCase` pour respecter Clean Architecture").
- ✅ **Demander confirmation explicite** pour :
  - La création de branche Git.
  - Les modifications ou suppressions de code existant.
  - Les changements d'architecture.
- ✅ **Privilégier le code simple au code intelligent** (meilleure maintenabilité dans le temps).
- ✅ **Suivre la procédure de gestion des problèmes** (voir section dédiée).
- ✅ **Respecter le format de communication structuré** (emojis autorisés **uniquement dans les messages**).

**L'agent NE DOIT JAMAIS :**
- ❌ Sauter une étape sans validation utilisateur.
- ❌ Continuer si l'utilisateur n'a pas validé la step précédente.
- ❌ Prendre des raccourcis "pour simplifier".
- ❌ Implémenter différemment de la demande ou du plan validé.
- ❌ Supprimer ou modifier du code existant sans accord explicite.
- ❌ Modifier l'architecture sans validation.

---

### 6. Communication Structurée
**Format obligatoire pour les messages de l'agent** (emojis autorisés **uniquement ici**) :
```
=== STEP [N]: [Nom de l'étape] ===

📋 Ce que je vais faire :
- [Action 1]
- [Action 2]

✅ Validation nécessaire ? Oui/Non

[Résultat de l'implémentation]

📊 STEP [N] SUMMARY:
✅ Créé : [liste fichiers]
✅ Modifié : [liste fichiers]
✅ Feature : [description]

⏸️  CHECKPOINT
Veuillez valider avant de continuer.
```

---

### 7. Gestion des Problèmes
En cas de **blocage, erreur ou incertitude** :
1. **STOP immédiat** (ne pas continuer).
2. **Expliquer clairement** le problème (cause, impact).
3. **Proposer des solutions alternatives** (si applicable).
4. **Attendre la décision de l'utilisateur** (ne jamais contourner le problème).
5. **Ne jamais** supprimer du code pour "résoudre" un problème.

**Exemple** :
```
❌ ERREUR : Conflit de merge détecté dans src/core/user/entity.ts
📋 Solutions possibles :
1. Résoudre le conflit manuellement (je guide).
2. Annuler les changements et repartir de la dernière version stable.
⏸️  CHECKPOINT
Quelle solution choisir ?
```

---

## Schéma du Workflow (Mis à Jour)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              ÉTAPE 0 : INITIALISATION (ENRICHIE)                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Vérifier ticket Linear ou Information Gathering (si pas de ticket)             │   │
│  │ ✅ Vérification Git (git status) + demande confirmation branche                       │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ÉTAPE 1 : CONCEPTION ARCHITECTURALE                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Analyse code existant + contraintes techniques                                   │   │
│  │ ✅ Proposition de plan (Core/Adapters/UI) + micro-steps (5-8 max)                   │   │
│  │ ✅ Validation utilisateur (format structuré)                                          │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              ÉTAPE 2 : DÉVELOPPEMENT CORE                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Implémentation (entités, use cases, règles métier)                                │   │
│  │ ✅ CHECKPOINT : Validation code + minipaint-coding-rules                              │   │
│  │ ✅ Tests unitaires (TDD) + CHECKPOINT                                                  │   │
│  │ ✅ Commit automatique (feat(core): ...)                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ÉTAPE 3 : DÉVELOPPEMENT ADAPTERS                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Implémentation (API clients, repositories, mappers)                             │   │
│  │ ✅ CHECKPOINT : Validation code + minipaint-coding-rules                              │   │
│  │ ✅ Tests d'intégration + CHECKPOINT                                                   │   │
│  │ ✅ Commit automatique (feat(adapter): ...)                                           │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               ÉTAPE 4 : DÉVELOPPEMENT UI                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Implémentation (composants, pages, styles)                                         │   │
│  │ ✅ Vérification accessibilité (frontend-ui-engineering)                               │   │
│  │ ✅ CHECKPOINT : Validation code + minipaint-coding-rules                              │   │
│  │ ✅ Tests E2E/Composants + CHECKPOINT                                                   │   │
│  │ ✅ Commit automatique (feat(ui): ...)                                                 │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ÉTAPE 5 : FINALISATION                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Vérification globale (tests + règles)                                              │   │
│  │ ✅ Checklist qualité (5 items) OBIGATOIRE                                             │   │
│  │ ✅ Résumé final (fichiers créés/modifiés, commits)                                     │   │
│  │ ✅ Push sur branche (git push origin {branche})                                        │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Points d'Attention

### ⚠️ Bloquants Potentiels
1. **Accès à Linear** :
   - Nécessite une API key configurée dans l'environnement (`LINEAR_API_KEY`).
   - Vérifier les permissions (lecture des tickets du projet).

2. **Règles de Code** :
   - Le skill `minipaint-coding-rules` doit être **obligatoirement** appelé à chaque étape.
   - **Validation après le code ET après les tests** (pour le TDD).
   - Bloquer le commit si non-conformité.

3. **Tests** :
   - Si un test échoue, **ne pas passer à l'étape suivante**.
   - **Checkpoint obligatoire après l'écriture des tests** pour validation.
   - Corriger immédiatement ou demander de l'aide à l'utilisateur.

4. **Conflits Git** :
   - Toujours faire un `git pull` avant de commencer (si branche existante).
   - **Vérification Git systématique en Étape 0** (`git status`).
   - Gérer les conflits **avant** de pousser.

5. **Règles Strictes** :
   - **Code simple > code intelligent** (priorité à la maintenabilité).
   - **Pas de suppression/modification de code existant** sans accord explicite.
   - **Pas de raccourcis** "pour simplifier".

### 📌 Bonnes Pratiques
- **Documentation** : Générer un `CHANGELOG.md` ou `DEV_NOTES.md` pour les features complexes.
- **Atomicité** : Chaque commit doit être **atomique** (1 changement logique = 1 commit).
- **Transparence** : Informer l'utilisateur à chaque transition d'étape avec **format structuré**.
- **TDD** : Écrire les tests **avant ou pendant** l'implémentation pour valider la logique.
- **Emojis** : Autorisés **uniquement dans les messages de l'agent** (pas dans le code).

---

## Prochaines Étapes

1. [x] **Valider et enrichir ce plan** avec l'utilisateur (intégration de methodical-dev-skill.md).
2. [ ] **Configurer l'agent `ours-dev`** :
   - Définir les skills à charger (`minipaint-coding-rules`, `test-driven-development`, `frontend-ui-engineering`).
   - Intégrer la logique séquentielle (états + transitions).
   - Implémenter le **format de communication structuré** (avec checkpoints).
   - Ajouter les **règles strictes** (code simple, pas de suppression sans accord, etc.).
3. [ ] **Tester le workflow** sur une feature simple (ex: ajout d'un bouton avec logique métier).
4. [ ] **Documenter les commandes** pour lancer `ours-dev` (ex: `vibe --agent ours-dev --ticket APP-123`).
5. [ ] **Créer un template de fichier de configuration** pour l'agent (ex: `.vibe/agents/ours-dev/SKILL.md`).

---

## Annexes

### Exemple de Commande
```bash
# Avec ticket Linear
vibe --agent ours-dev --ticket APP-123 --feature "Ajout du profil utilisateur"

# Sans ticket (mode dialogue)
vibe --agent ours-dev --feature "Implémenter la recherche globale"
```

### Structure des Fichiers Générés
```
project/
├── src/
│   ├── core/
│   │   └── {feature}/
│   │       ├── entities.ts
│   │       ├── use-cases.ts
│   │       └── __tests__/
│   ├── adapters/
│   │   └── {feature}/
│   │       ├── {implementation}.ts
│   │       └── mappers.ts
│   └── ui/
│       └── {feature}/
│           ├── components/
│           └── pages/
├── PLAN_DEV_{feature}.md  # Plan validé (optionnel)
└── CHANGELOG.md            # Mises à jour
```

---

*Document créé le 22/07/2026. **Mis à jour le 22/07/2026** : Intégration des règles de methodical-dev-skill.md (validations TDD, format structuré, règles strictes, vérification Git).*
