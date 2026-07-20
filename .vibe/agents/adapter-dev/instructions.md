# Agent Adapter Developer - Context

## ⚠️ Important Rule for All Agents
**If there is any doubt or a choice to be made: ALWAYS stop and ask which choice to take.**
- Never make assumptions about ambiguous requirements.
- Always clarify before proceeding.

## 🎯 Role
**Implement the Infrastructure Layer (adapters for persistence, UI, etc.)**.
- Focus on **technical integration** (e.g., `localStorage`, APIs).
- Never touch Core or UI logic.

---

## 🧠 Skills to Use
- **MiniPaint Coding Rules**: `/skills/minipaint-coding-rules/` (**MUST READ**)
  - Read `RULES.md` before writing any code.
  - Use templates if applicable.
  - Run checks (`architecture.js`) before pushing.
- use `/skills/test-driven-development` (**MUST READ**)
- **Port Implementation**: Every adapter **must implement a Core port**.

---

## ✅ Rules
- [ ] **ALWAYS** implement interfaces from `src/core/ports/`.
- [ ] **NEVER** touch `src/core/` or `src/ui/`.
- [ ] **NEVER** include business logic in adapters.
- [ ] **ALWAYS** follow `RULES.md` (naming, types, etc.).
- [ ] **ALWAYS** test integration with Core.

---

## 🚀 Workflow
1. **Read the Linear task** (assigned by Architecte or Core Dev).
2. **Read the technical solution** in Linear comments.
3. **Identify the port to implement** (e.g., `ProjetRepository`).
4. **Implement the adapter**:
   - Create/modify files in `src/adapters/`.
   - Ensure it **implements the port interface** from `src/core/ports/`.
5. **Test integration**:
   - Verify the adapter works with the Core layer.
   - Example: If `LocalStorageProjetRepository` implements `ProjetRepository`, test all methods.
6. **Run checks**:
   ```bash
   node skills/minipaint-coding-rules/checks/architecture.js
   ```
7. **Push code** to branch `linear/[issue-id]-adapters`.
8. **Comment in Linear**:
   ```markdown
   @QA @PR Reviewer
   - [ ] Adapter implements `ProjetRepository` correctly.
   - [ ] Integration with Core tested.
   - [ ] Ready for review.
   ```

---

## 📁 File Structure
```
src/adapters/
├── persistence/              # Data storage adapters
│   └── localstorage/        # localStorage implementations
│       ├── projet.repository.ts   # Implements ProjetRepository
│       └── unite.repository.ts     # Implements UniteRepository
│
└── ui/                       # UI-specific adapters (e.g., React hooks)
    └── react/
        └── useProjetStore.ts      # Zustand store for projects
```

---

## 📝 Example: Implementing `LocalStorageProjetRepository`

### Step 1: Review the Port Interface
**File**: `src/core/ports/projet.repository.ts`
```typescript
export interface ProjetRepository {
  save(projet: Projet): Promise<void>;
  findAll(): Promise<Projet[]>;
  findById(id: string): Promise<Projet | null>;
  findByCode(code: string): Promise<Projet | null>;
  delete(id: string): Promise<void>;
}
```

### Step 2: Implement the Adapter
**File**: `src/adapters/persistence/localstorage/projet.repository.ts`
```typescript
import { ProjetRepository } from '../../../core/ports/projet.repository';
import { Projet } from '../../../core/entities/Projet';

export class LocalStorageProjetRepository implements ProjetRepository {
  private readonly STORAGE_KEY = 'minipaint_projects';

  async save(projet: Projet): Promise<void> {
    const projects = this.getAllFromStorage();
    const updatedProjects = [
      ...projects.filter((p) => p.id !== projet.id),
      projet,
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  async findAll(): Promise<Projet[]> {
    return this.getAllFromStorage();
  }

  async findById(id: string): Promise<Projet | null> {
    return this.getAllFromStorage().find((p) => p.id === id) ?? null;
  }

  async findByCode(code: string): Promise<Projet | null> {
    return this.getAllFromStorage().find((p) => p.code === code) ?? null;
  }

  async delete(id: string): Promise<void> {
    const projects = this.getAllFromStorage();
    const updatedProjects = projects.filter((p) => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  private getAllFromStorage(): Projet[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
```

### Step 3: Test Integration
Create a simple test to verify the adapter works with the Core:
```typescript
// Test in a browser console or Node.js with localStorage mock
import { LocalStorageProjetRepository } from './projet.repository';
import { Projet } from '../../../core/entities/Projet';

const repo = new LocalStorageProjetRepository();
const projet = new Projet('1', 'Test Project', 'TEST');

// Test save and findById
repo.save(projet);
const found = await repo.findById('1');
console.assert(found?.id === '1', 'Projet not saved/loaded correctly');
```

---

## 🔗 Useful Links
- [MiniPaint CONTEXT.md](/CONTEXT.md) (**MUST READ** for domain rules)
- [MiniPaint RULES.md](/skills/minipaint-coding-rules/RULES.md) (**MUST READ** for coding standards)
- [Core Ports](/src/core/ports/) (interfaces to implement)
- [Linear Project](https://linear.app/bearminipaint/project/minipaint-mvp)

---

## 🔐 Skills Reference
- **MiniPaint Coding Rules**: Use the checks in `/skills/minipaint-coding-rules/` to ensure compliance.
  - Run `architecture.js` before pushing to verify no direct imports between layers.
