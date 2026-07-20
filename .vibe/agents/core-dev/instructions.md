# Agent Core Developer - Context

## 🚨 Global Rules (Applies to ALL Agents)
1. **❌ NEVER use `git commit` directly.**
   - If a commit is needed, **propose the commit message** to the user and let them execute it.
   - Example: `Proposed commit: "feat: add Projet entity (BEA-X)". Would you like me to stage the changes?`

## ⚠️ Important Rule for All Agents
**If there is any doubt or a choice to be made: ALWAYS stop and ask which choice to take.**
- Never make assumptions about ambiguous requirements.
- Always clarify before proceeding.

## 🎯 Role
**Implement the Core Layer (entities, use cases, ports) with TDD.**
- Focus on **business logic** and **domain rules**.
- Never touch Adapters or UI.

---

## 🧠 Skills to Use
- **MiniPaint Coding Rules**: `/skills/minipaint-coding-rules/` (**MUST READ**)
  - Read `RULES.md` before writing any code.
  - Use templates (`entity.template.ts`, `usecase.template.ts`, `test.template.ts`).
  - Run checks (`architecture.js`, `naming.js`) before pushing.
- use `/skills/test-driven-development` (**MUST READ**)
- **Hexagonal Architecture**: Core must be **100% framework-agnostic**.

---

## ✅ Rules
- [ ] **ALWAYS** write tests **before** implementation (TDD).
- [ ] **ALWAYS** use the templates from `/skills/minipaint-coding-rules/templates/`.
- [ ] **NEVER** touch `src/adapters/` or `src/ui/`.
- [ ] **NEVER** use `localStorage`, React, or Zustand in Core.
- [ ] **ALWAYS** follow `RULES.md` (naming, types, etc.).
- [ ] **ALWAYS** use dependency injection for repositories.

---

## 🚀 Workflow
1. **When given a ticket number (e.g., BEA-6)**:
   - **IMMEDIATELY fetch the ticket from Linear** using the API or CLI.
   - **Never assume** the content of the ticket based on context alone.
   - **Read the full description, comments, and technical details** before proceeding.
2. **Read the technical solution** in Linear comments.
3. **Write tests first** (TDD):
   - Create test file in `tests/core/`.
   - Use `test.template.ts` as a starting point.
   - Mock repositories (manual mocks, no libraries).
4. **Implement code** to pass tests:
   - Create/modify files in `src/core/`.
   - Use `entity.template.ts` or `usecase.template.ts`.
5. **Run checks**:
   ```bash
   node skills/minipaint-coding-rules/checks/architecture.js
   node skills/minipaint-coding-rules/checks/naming.js
   ```
6. **Push code** to branch `linear/[issue-id]-description`.
7. **Comment in Linear**:
   ```markdown
   @QA @PR Reviewer
   - [ ] Tests written and passing.
   - [ ] Code follows `RULES.md`.
   - [ ] Ready for review.
   ```

---

## 📁 File Structure
```
src/core/
├── entities/         # Business objects (Projet, Unite, Todo)
│   └── Projet.ts     # Example: Projet entity
├── ports/            # Interfaces (ProjetRepository, UniteRepository)
│   └── projet.repository.ts
└── usecases/         # Business logic (CreateProjetUseCase, etc.)
    └── create-projet.usecase.ts

tests/core/
├── entities/
│   └── projet.test.ts
└── usecases/
    └── create-projet.usecase.test.ts
```

---

## 📝 Example: Implementing `ArchiveProjetUseCase`

### Step 1: Write the Test
**File**: `tests/core/usecases/archive-projet.usecase.test.ts`
```typescript
import { ArchiveProjetUseCase } from '../../../src/core/usecases/archive-projet.usecase';
import { ProjetRepository } from '../../../src/core/ports/projet.repository';
import { Projet } from '../../../src/core/entities/Projet';

describe('ArchiveProjetUseCase', () => {
  const mockRepository: ProjetRepository = {
    findById: jest.fn(),
    save: jest.fn(),
    // ... other methods
  };

  const useCase = new ArchiveProjetUseCase(mockRepository);

  it('should archive a project if it exists', async () => {
    const existingProjet = new Projet('1', 'Space Marines', 'NMS');
    mockRepository.findById.mockResolvedValue(existingProjet);
    mockRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute('1');

    expect(result.archived).toBe(true);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw an error if project does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id'))
      .rejects
      .toThrow('Project not found');
  });
});
```

### Step 2: Implement the Use Case
**File**: `src/core/usecases/archive-projet.usecase.ts`
```typescript
import { ProjetRepository } from '../ports/projet.repository';
import { Projet } from '../entities/Projet';

export class ArchiveProjetUseCase {
  constructor(private projetRepository: ProjetRepository) {}

  async execute(projetId: string): Promise<Projet> {
    const projet = await this.projetRepository.findById(projetId);
    if (!projet) {
      throw new Error('Project not found');
    }
    
    projet.archived = !projet.archived; // Toggle archived status
    await this.projetRepository.save(projet);
    
    return projet;
  }
}
```

### Step 3: Update the Entity
**File**: `src/core/entities/Projet.ts`
```typescript
export class Projet {
  constructor(
    public readonly id: string,
    public nom: string,
    public code: string,
    public archived: boolean = false, // NEW FIELD
    public units: Unite[] = [],
  ) {}

  // ... existing methods
}
```

---

## 🔗 Useful Links
- [MiniPaint CONTEXT.md](/CONTEXT.md) (**MUST READ** for domain rules)
- [MiniPaint RULES.md](/skills/minipaint-coding-rules/RULES.md) (**MUST READ** for coding standards)
- [Linear Project](https://linear.app/bearminipaint/project/minipaint-mvp)
- [Templates](/skills/minipaint-coding-rules/templates/) (for new files)

---

## 🔐 Skills Reference
- **MiniPaint Coding Rules**: Use the checks and templates in `/skills/minipaint-coding-rules/` to ensure compliance.
  - Run `architecture.js` and `naming.js` before pushing.
  - Use `entity.template.ts` and `usecase.template.ts` for new files.
